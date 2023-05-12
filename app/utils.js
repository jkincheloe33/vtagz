/**
 * Returns an optimized image from the CDN
 * @param {string} src - the full url to the original image
 * @param {number} size - the size of the optimized image
 * current supported sizes are: 1024, 768, 512, 384, 256
 */
const imgSrcCache = {};
export const getImage = (src, size) => {
  if (!src) {
    return '';
  }
  // handles multiple renders that change scoped objects
  if (imgSrcCache[src]) {
    // this is a no-op
    return src;
  }
  const filename = src.slice(src.lastIndexOf('/') + 1);
  const newSrc = src.replace(filename, `${size}/${filename}`);
  imgSrcCache[newSrc] = 1;
  return newSrc;
};

// using location.pathname is unsafe when combining urls
// because the URL may or may not have a trailing slash
// using this method ensures the value will always have
// a trailing slash
export const getPath = () => {
  return location.pathname.replace(/\/+$/, '/');
};

// Start of string, optional +, 1, then 10 digits
export const validateUsPhoneNumber = (phoneNumber) =>
  /^\+?1\d{10}$/.test(phoneNumber);

// restrict input value up to hundredth decimal place
export const validateInputHundredth = (input) =>
  /^\d*(\.\d{0,2})?$/g.test(input);

//fix price for display purposes
export function fixPrice(price) {
  price = price.toString();
  //pad with zeros if less than 3
  if (price.length < 3) {
    price = price.padStart(3, '0');
  }
  let dollars = price.slice(0, -2);
  if (!dollars) {
    dollars = '0';
  }
  return dollars + '.' + price.slice(-2);
}

// removes decimal and converts to an integer
export function parseDecimalPrice(price) {
  price = price.toString();
  const decimalIndex = price.indexOf('.');
  if (decimalIndex === -1 || decimalIndex === price.length - 1) {
    price += '00';
  } else if (decimalIndex === price.length - 2) {
    price = price + '0';
  }
  return parseInt(price.replace('.', ''), 10);
}

export function friendlyDate(str) {
  return new Date(str).toLocaleDateString();
}

export function friendlyDateTime(str) {
  return new Date(str).toLocaleString();
}

export function timeToAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // show 0 as 12
  minutes = minutes < 10 ? `0${minutes}` : minutes; // add 0 to 1-9
  return `${hours}:${minutes}${ampm}`;
}

export function friendlyExpiryDate(num) {
  const date = new Date(num);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  return `${day} ${month} at ${timeToAMPM(date)}`;
}

export function friendlyProductDateTime(str) {
  const d = new Date(str);
  const time = d.getTime();
  if (time === 4760489411174 || time === 0) {
    return '-';
  }
  return d.toLocaleString();
}

export function commaSeparateNumber(num) {
  if (num < 1000) {
    return num.toString();
  }
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function debounce(func, wait = 220) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

export function getWindowWidth() {
  return document.documentElement.clientWidth;
}

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function addClass(name, elem) {
  let { className } = elem;
  className = className
    .split(' ')
    .filter(Boolean)
    .filter((val) => val !== name)
    .join(' ');
  elem.className = `${className} ${name}`;
}

export function removeClass(name, elem) {
  let { className } = elem;
  className = className
    .split(' ')
    .filter(Boolean)
    .filter((val) => val !== name)
    .join(' ');
  elem.className = className;
}

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function isEmail(str) {
  if (!str || typeof str !== 'string') {
    return false;
  }
  return emailRegex.test(str.toLowerCase());
}

const onlyNumbersRegex = /[^0-9]*/g;
export function onlyNumbers(value) {
  return value.replace(onlyNumbersRegex, '');
}

export function maskEmail(email) {
  const [username, domain] = email.split('@');
  const prefix = username.substring(0, 2);
  return `${prefix}***@${domain}`;
}

export function dateStringToEpoch(time) {
  return new Date(time).getTime();
}

// Obtains the shorthand timezone string (PST, PDT, EST, ...)
const timezoneName = new Date()
  .toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'short' })
  .substring(4);
// Format string for date picker
export const dateFormat = `MMMM d yyyy, h:mma '${timezoneName}'`;

// build options for react-select
export const buildOptions = (items) => {
  return items.map((key) => {
    return {
      value: key.toLowerCase(),
      label: key,
    };
  });
};

export function deepEqual(value1, value2) {
  // if any of the values is not an object, return value comparison
  if (!isObject(value1) || !isObject(value2)) {
    return value1 === value2;
  }
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = value1[key];
    const val2 = value2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
}
export function isObject(object) {
  return typeof object === 'object' && object !== null;
}

export function isJsonStringValid(value) {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}

// quill can add a lot of empty tags depending the text that was written and deleted
export function isOnlyHtmlEmptyTags(htmlString) {
  htmlString = htmlString.replace(/(<\/?[^>]+(>|$)|&nbsp;|\s)/g, '');
  return htmlString === '';
}

// abbreviations in steps of 1000x; extensible if need to edit
const abbrev = ['k', 'M', 'B'];

function rnd(n, precision) {
  const prec = 10 ** precision;
  return Math.round(n * prec) / prec;
}

/**
 * https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k#:~:text=24-,var,-floor%3DMath
 * @param {number} n - the number to format
 * @returns abbreviated number if over 1,000 or returns number
 * example: if n = 10000 then we return 10k
 */
export function formatNumber(n) {
  let base = Math.floor(Math.log(Math.abs(n)) / Math.log(1000));
  const suffix = abbrev[Math.min(abbrev.length - 1, base - 1)];
  base = abbrev.indexOf(suffix) + 1;
  return suffix ? rnd(n / 1000 ** base, 2) + suffix : '' + n;
}

/**
 * https://dev.to/admitkard/auto-generate-avatar-colors-randomly-138j
 * @param {number} hash - hash based on a user's id
 * @param {number} min - minimum value allowed
 * @param {number} max- maximum value allowed
 * @returns {number} number within our specified range
 */
export const normalizeHash = (hash, min, max) => {
  return Math.floor((hash % (max - min)) + min);
};

const hRange = 360;
const sRange = 100;
const lRange = 100;
const multiplier = 1634;

/**
 * https://dev.to/admitkard/auto-generate-avatar-colors-randomly-138j
 * @param {number} hash - this can be any number
 * @returns {string} hsl color value
 */
export const generateHSL = (hash) => {
  // using multiplier to generate broader values
  const h = normalizeHash(hash * multiplier, 0, hRange);
  const s = normalizeHash(hash * multiplier, 0, sRange);
  const l = normalizeHash(hash * multiplier, 0, lRange);
  return `hsl(${h}, ${s}%, ${l}%)`;
};
