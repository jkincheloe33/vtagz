import Axios from 'axios';

const targetEnv = process.env.TARGET_ENV;
const disableAmplitude = process.env.DISABLE_AMPLITUDE;

const isProduction = targetEnv === 'production';
const isStaging = targetEnv === 'staging';
const landingPageUrl = isProduction ? 'http://www.vtagz.com' : '';
const zEKey = '37976b91-24b4-45ac-9038-867c0de5bf27';
const currentBuildVersion = isProduction ? BUILD_VERSION : 'local';

let amplitudeApiKey = '2c4c742607b4a9aa1e324255979e5a3c';
let amplitudeDeploymentKey = 'client-JLeRjxLuyrCiREsDYECoIKXn8mOcrfJo';
let stripeApiKey =
  'pk_test_51KygGICyQR6OmAeK6PrwNGRtRO4Bm2uEyl1ULZbUpFqr6AHTOorCpAPw3UsKDqumOfUJsnZpUiUvOBrUpTnKEmOM00rPt1Tp7S';
let useStripe = true;

const baseUrls = {
  local: 'http://localhost:3010',
  development: 'https://dev.vtagz.com',
  staging: 'https://stage.vtagz.com',
  production: 'https://vtagz.com',
};

const api = ((env) => {
  if (env === 'local') {
    return {
      user: 'http://localhost:3002/user',
      product: 'http://localhost:3003/product',
      order: 'http://localhost:3004/order',
      cache: 'http://localhost:3007/cache',
      tokenState: 'http://localhost:3008/token-state',
      root: 'http://localhost:3010',
      shareSite: 'https://stage-share.vtagz.com',
      tracking: 'https://px.vtagz.com',
      upload: 'https://stage-upload.vtagz.com',
    };
  }
  if (env === 'staging') {
    let root;
    // accept any origin ending in .vtagz.com
    if (/\.vtagz\.com(:3010)?$/.test(location.origin)) {
      root = location.origin;
    } else {
      root = 'https://stage.brands.vtagz.com';
    }

    return {
      account: 'https://stage-api.vtagz.com/account',
      user: 'https://stage-api.vtagz.com/user',
      product: 'https://stage-api.vtagz.com/product',
      order: 'https://stage-api.vtagz.com/order',
      cache: 'https://stage-api.vtagz.com/cache',
      tokenState: 'https://stage-api.vtagz.com/tokenState',
      share: 'https://stage-api.vtagz.com',
      root,
      shareSite: 'https://stage-share.vtagz.com',
      tracking: 'https://px.vtagz.com',
      upload: 'https://stage-upload.vtagz.com',
      unified: 'https://stage-api.vtagz.com/graphql',
      marketing: 'https://stage-api.vtagz.com/marketing',
    };
  }
  if (env === 'production') {
    amplitudeApiKey = '044fb5866bdde86ce8c53cd50ea1ee1e';
    amplitudeDeploymentKey = 'client-L0jTtgHDE0ulyVxb3PxXzjhpPybN8Zvr';
    stripeApiKey =
      'pk_live_51L1a6GBizyVwigInrJG5uuF8gzj5dcP2vn0Cz8YjCTLtnouhCJEEvGkAQP5kyn8AOZH39JkWd78fDka7WbNWbhPu00WqiaD76E';
    return {
      account: 'https://api.vtagz.com/account',
      user: 'https://api.vtagz.com/user',
      product: 'https://api.vtagz.com/product',
      order: 'https://api.vtagz.com/order',
      cache: 'https://api.vtagz.com/cache',
      tokenState: 'https://api.vtagz.com/tokenState',
      share: 'https://api.vtagz.com',
      root: 'https://vtagz.com',
      shareSite: 'https://share.vtagz.com',
      tracking: 'https://px.vtagz.com',
      upload: 'https://upload.vtagz.com',
      unified: 'https://api.vtagz.com/graphql',
      marketing: 'https://api.vtagz.com/marketing',
    };
  }
})(targetEnv);

if (isProduction) {
  const checkVersion = () => {
    Axios.get(`${api.root}/version.txt`, {
      headers: {
        'cache-control': 'no-cache, max-age=0',
      },
    })
      .then(({ data: version }) => {
        version = version.trim();
        // if polled version does not match currentBuildVersion
        // then our index.html is out of date and should be reloaded
        if (version !== currentBuildVersion) {
          location.reload(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  setInterval(checkVersion, 60000);
  checkVersion();
}

const getCookieValue = (name) =>
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';

Axios.defaults.xsrfHeaderName = 'x-xsrf-token';

const auth = {
  header: localStorage.getItem('jwt-token') || '',
  xsrfToken:
    decodeURIComponent(getCookieValue('XSRF-TOKEN')) ||
    localStorage.getItem('xsrf-token') ||
    '',
};

const axiosHeaders = {
  'X-Requested-With': 'XMLHttpRequest',
  'cache-control': 'no-cache',
  'x-xsrf-token': auth.xsrfToken,
  version: '1.1.5',
};

/**
 * Invoked by login and after email verification
 * used to authenticate a user
 */
const setAuthorizationHeader = (bearer, xsrf) => {
  auth.header = bearer.slice(7);
  localStorage.setItem('jwt-token', auth.header);
  if (xsrf) {
    auth.xsrfToken = xsrf;
    localStorage.setItem('xsrf-token', xsrf);
  }
};

const removeAuthorizationHeader = () => {
  auth.header = '';
  auth.xsrfToken = '';
  localStorage.removeItem('jwt-token');
  localStorage.removeItem('xsrf-token');
};

const axios = Axios.create({
  baseURL: api.baseUrl,
  timeout: 12000,
  withCredentials: true,
  headers: axiosHeaders,
  xsrfCookieName: 'XSRF-TOKEN',
});

axios.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${auth.header}`;
    config.headers['x-xsrf-token'] = auth.xsrfToken;
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
// TODO: replace for proper clientId
const googleClientId =
  isProduction || isStaging
    ? '717141853371-85hlurskmdfppl8m47gbknhntdtpfmcr.apps.googleusercontent.com'
    : '10680328425-igh8jo7l1jl7o35l56q2ag7b9pfbf48k.apps.googleusercontent.com';

export {
  amplitudeApiKey,
  amplitudeDeploymentKey,
  zEKey,
  api,
  axios,
  axiosHeaders,
  auth,
  disableAmplitude,
  googleClientId,
  isProduction,
  isStaging,
  landingPageUrl,
  stripeApiKey,
  useStripe,
  setAuthorizationHeader,
  removeAuthorizationHeader,
  baseUrls,
};
