import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Counter } from 'k6/metrics';

let globalData = { cookies: {}, currentUser: {}, categories: [] };
let vuSetupsDone = new Counter('vu_setups_done');

const prod = __ENV.TEST_RUN_ID ? true : false;
const baseUrl = __ENV.DOMAIN ? `http://${__ENV.DOMAIN}` : 'http://localhost:3000';

/ ** ------------------------------------------------------------------------------** /;

const VUsCount = prod ? 100 : 20;

const cpWarmUpDuration = prod ? 90 : 10;
const cpRampUpDuration = prod ? 90 : 10;
const cpRampUpHigherDuration = prod ? 120 : 10;
const cpSustainedHighLoadDuration = prod ? 300 : 10;
const cpDurationSecs = cpWarmUpDuration + cpRampUpDuration + cpRampUpHigherDuration + cpSustainedHighLoadDuration + 5;

const vuInitTimeoutSecs = VUsCount * 2;

const loadTestGracefulStopSecs = 5;
const ccDurationSecs = 15;

export const options = {
  tags: {
    test_run_id: __ENV.TEST_RUN_ID || 'local-test-run',
  },
  scenarios: {
    // This is the per-VU setup/init equivalent:
    vu_setup: {
      executor: 'per-vu-iterations',
      exec: 'vu_setup',
      vus: VUsCount,
      iterations: 1,
      gracefulStop: '0s',
      maxDuration: `${vuInitTimeoutSecs}s`,
    },
    create_category: {
      executor: 'per-vu-iterations',
      exec: 'create_category',
      vus: VUsCount,
      iterations: 10,
      gracefulStop: `${loadTestGracefulStopSecs}s`,
      startTime: `${vuInitTimeoutSecs}s`,
      maxDuration: `${ccDurationSecs}s`,
    },
    create_product: {
      exec: 'create_product',
      executor: 'ramping-arrival-rate',
      gracefulStop: `${loadTestGracefulStopSecs}s`,
      startTime: `${vuInitTimeoutSecs + ccDurationSecs + loadTestGracefulStopSecs}s`, // start seconds after the start of the test
      startRate: 1,
      timeUnit: '1s', // increase the rate every second
      preAllocatedVUs: VUsCount / 10, // number of VUs to pre-allocate
      maxVUs: VUsCount, // maximum number of VUs
      stages: [
        { target: 10, duration: `${cpWarmUpDuration}s` }, // Warm up service
        { target: 20, duration: `${cpRampUpDuration}s` }, // Ramp up to high load
        { target: 40, duration: `${cpRampUpHigherDuration}s` }, // Continue ramping up to high load
        { target: 60, duration: `${cpSustainedHighLoadDuration}s` }, // Sustained high load
      ],
      tags: { type: 'loadtest' },
    },
    // This is the per-VU teardown/cleanup equivalent:
    vu_teardown: {
      executor: 'per-vu-iterations',
      exec: 'vu_teardown',
      vus: VUsCount,
      iterations: 1,
      startTime: `${vuInitTimeoutSecs + ccDurationSecs + cpDurationSecs + 2 * loadTestGracefulStopSecs}s`,
      maxDuration: `${vuInitTimeoutSecs}s`,
    },
  },
  thresholds: {
    // Make sure all of the VUs finished their setup successfully, so we can
    // ensure that the load test won't continue with broken VU "setup" data
    vu_setups_done: [
      {
        threshold: `count==${VUsCount}`,
        abortOnFail: true,
        delayAbortEval: `${vuInitTimeoutSecs}s`,
      },
    ],
    // Also make sure all of the VU teardown calls finished uninterrupted:
    'iterations{scenario:vu_teardown}': [`count==${VUsCount}`],

    // Ignore HTTP requests from the VU setup or teardown here:
    'http_req_duration{type:loadtest}': ['p(95)<2000', 'avg<1500'],
    'http_req_duration{scenario:create_product}': ['p(95)<2000', 'avg<1500'],
  },
  summaryTrendStats: ['min', 'max', 'med', 'avg', 'p(95)'],
};

/ ** ------------------------------------------------------------------------------** /;

const url = (slug) => `${baseUrl}/${slug}`;

function callerName() {
  const error = new Error();
  const stack = error.stack.split('\n');
  if (stack.length > 3) {
    const callerLine = stack[3].trim();
    const match = callerLine.match(/at (\S+)/);
    if (match && match.length > 1) {
      return match[1];
    }
  }
  return 'unknown';
}

function log(msg, parent = '') {
  const callerParent = parent ? `[${parent}] ` : '';
  console.log(`${callerParent}[${callerName()}] [VU ${__VU} (${globalData.currentUser.username})] ${msg}`);
}

function post(slug, data) {
  return http.post(url(slug), JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function get(slug) {
  return http.get(url(slug));
}

/** Initialize cookies for the virtual user. */
function setCookieJar() {
  let jar = http.cookieJar();
  Object.keys(globalData.cookies).forEach((key) => {
    jar.set(baseUrl, key, globalData.cookies[key][0]);
  });
  return globalData.currentUser;
}

function randomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/ ** ------------------------------------------------------------------------------** /;

export function vu_setup() {
  sleep(__VU);
  vuSetupsDone.add(0);
  http.cookieJar().clear(baseUrl);
  const uniqueId = `$:VU.${__VU}-${uuidv4()}`;
  const registerData = {
    firstName: `John${__VU}`,
    lastName: `Doe${__VU}`,
    email: `johnDoe${uniqueId}@mail.com`,
    username: `johdoe${uniqueId}`,
    address: 'SomeAddress',
    password: 'Somepass123.',
    role: 'CHEF',
    city: 'Eindhoven',
    postalCode: '5123JP',
    street: 'Marconilaan',
    houseNumber: '13',
  };

  const loginData = {
    username: `johdoe${uniqueId}`,
    password: 'Somepass123.',
  };

  let res = post('auth/register', registerData);
  check(res, { 'auth/register': (r) => r.status === 201 });

  res = post('auth/login', loginData);

  if (check(res, { 'auth/login': (r) => r.status === 201 })) {
    globalData.cookies = http.cookieJar().cookiesForURL(baseUrl);
    globalData.currentUser = JSON.parse(decodeURIComponent(globalData.cookies['current_user'][0]));
    http.cookieJar().clear(baseUrl);

    log(`Registered and set globalData.`);

    vuSetupsDone.add(1);
  }
}

export function create_category() {
  setCookieJar();
  const uniqueId = `:VU.${__VU}-ITER.${__ITER}`;
  const categoryName = `K6-Category${uniqueId}`;
  let res = post('inventory/category/create', {
    name: categoryName,
    description: 'K6-Description',
  });

  if (check(res, { 'inventory/category/create': (r) => r.status === 201 })) {
    globalData.categories.push(categoryName);
  }
}

export function create_product() {
  setCookieJar();
  const categories = globalData.categories;
  if (categories.length > 0) {
    const uniqueId = `:VU.${__VU}-ITER.${__ITER}-${uuidv4()}`;
    const productName = `K6-Product-${uniqueId}`;
    let res = post('inventory/product/create', {
      name: productName,
      description: 'K6-Description',
      category: categories[randomInt(0, categories.length - 1)],
      quantity: randomInt(200000, 500000),
      price: randomInt(4, 20) + 0.99,
    });

    check(res, { 'inventory/product/create': (r) => r.status === 201 });
  } else {
    log(`Skipped due to 0 categories.`);
  }
}

export function vu_teardown() {
  setCookieJar();
  if (check(get('auth/logout'), { 'auth/logout': (r) => r.status === 200 })) {
    log(`Logged out.`);
  }
}
