import Axios from 'axios';
import {
  api,
  auth,
  axiosHeaders,
  setAuthorizationHeader,
  removeAuthorizationHeader,
} from './config';

const graphqlAxios = Axios.create({
  method: 'post',
  timeout: 12000,
  withCredentials: true,
  headers: axiosHeaders,
  xsrfCookieName: 'XSRF-TOKEN',
  transformResponse: function (response) {
    const data = JSON.parse(response);
    if (!data.errors) {
      return data.data;
    }
    // Throw if error, append gql error message to error
    const { message, statusCode } = data.errors[0];
    const error = new Error(message);
    error.statusCode = statusCode;
    error.gqlError = message;
    throw error;
  },
});

graphqlAxios.interceptors.request.use(function (config) {
  config.headers.authorization = `Bearer ${auth.header}`;
  config.headers['x-xsrf-token'] = auth.xsrfToken;
  return config;
});

// Assign the result of our query directly to the axios object
// so we don't always have to destructure ie { data: { session: ... } }
graphqlAxios.interceptors.response.use(
  function (config) {
    // keep token fresh
    if (config?.headers?.authorization) {
      setAuthorizationHeader(
        config.headers.authorization,
        config.headers['x-xsrf-token']
      );
    }
    Object.assign(config, config.data);
    return config;
  },
  function (error) {
    if (error?.response?.status === 401) {
      exports.logout().then(() => {
        removeAuthorizationHeader();
        window.location.href = api.root;
      });
    }
    throw error;
  }
);

// Returns a function that makes a graphql request to the set endpoint
const queryRequestWithUrl = (endpoint) => (query, variables) =>
  graphqlAxios({ url: endpoint, data: { query, variables } });
// Contains all query requests by schema
const queries = {
  account: queryRequestWithUrl(`${api.account}`),
  cache: queryRequestWithUrl(`${api.cache}`),
  marketing: queryRequestWithUrl(`${api.marketing}`),
  order: queryRequestWithUrl(`${api.order}`),
  product: queryRequestWithUrl(`${api.product}`),
  tokenState: queryRequestWithUrl(`${api.tokenState}`),
  unified: queryRequestWithUrl(`${api.unified}`),
  user: queryRequestWithUrl(`${api.user}`),
};

const exports = {};
function createQuery(exportName, query) {
  const [service, file] = query.split('.');
  const gql = require(`./gql/${service}/${file}.gql`);
  exports[exportName] = (params) => {
    return queries[service](gql, params);
  };
}

// Account queries
createQuery('createBrand', 'account.create-brand');
createQuery('login', 'account.login');
createQuery('logout', 'account.logout');
createQuery('modifyBrand', 'account.modify-brand');
createQuery('getSession', 'account.session');

// Unififed queries
createQuery('getProducts', 'unified.products');
createQuery('createProduct', 'unified.create-product');
createQuery('deactivateProduct', 'unified.deactivate-product');
createQuery('modifyProduct', 'unified.modify-product');
createQuery('getVariant', 'unified.variant');
createQuery('createVariant', 'unified.create-variant');
createQuery('modifyVariant', 'unified.modify-variant');
createQuery('deleteVariant', 'unified.delete-variant');
createQuery('getAllTimePerformance', 'unified.all-time-performance');
createQuery('getPerformanceSummary', 'unified.performance-summary');

// Marketing queries
createQuery('getSmsCampaign', 'marketing.sms-campaign');
createQuery('createSmsCampaign', 'marketing.create-sms-campaign');
createQuery('updateSmsCampaign', 'marketing.update-sms-campaign');
createQuery('deleteSmsCampaign', 'marketing.delete-sms-campaign');

export default {
  ...exports,
};
