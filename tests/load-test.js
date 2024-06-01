import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Counter } from 'k6/metrics';

const VUsCount = 10;
const vuInitTimeoutSecs = 2 * VUsCount;
const loadTestDurationSecs = 30;
const loadTestGracefulStopSecs = 5;

let vuSetupsDone = new Counter('vu_setups_done');
let globalData = { cookies: {}, currentUser: {} };

const baseUrl = 'http://localhost:3000';
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

function getCategories(chefId, withProducts = false) {
  const res = post('inventory/categories', { chefId, withProducts });
  check(res, { 'inventory/categories': (r) => r.status === 201 });
  return JSON.parse(res.body);
}

function randomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/ ** ---------------------------------------------------------** /;
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
      iterations: 5,
      gracefulStop: `${loadTestGracefulStopSecs}s`,
      startTime: `${vuInitTimeoutSecs}s`,
      maxDuration: `${loadTestDurationSecs}s`,
      tags: { type: 'loadtest' },
    },
    create_product: {
      executor: 'per-vu-iterations',
      exec: 'create_product',
      vus: VUsCount,
      iterations: 3,
      gracefulStop: `${loadTestGracefulStopSecs}s`,
      startTime: `${vuInitTimeoutSecs + loadTestDurationSecs + loadTestGracefulStopSecs}s`,
      maxDuration: `${loadTestDurationSecs}s`,
      tags: { type: 'loadtest' },
    },
    // This is the per-VU teardown/cleanup equivalent:
    vu_teardown: {
      executor: 'per-vu-iterations',
      exec: 'vu_teardown',
      vus: VUsCount,
      iterations: 1,
      startTime: `${vuInitTimeoutSecs + 2 * loadTestDurationSecs + 2 * loadTestGracefulStopSecs}s`,
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

    // Ignore HTTP requests from the VU setup or teardown here
    'http_req_duration{type:loadtest}': ['p(95)<500', 'max<1000'],
    'http_req_duration{scenario:create_category}': ['p(95)<500', 'max<1000'],
    'http_req_duration{scenario:create_product}': ['p(95)<500', 'max<1000'],
  },
  summaryTrendStats: ['min', 'max', 'med', 'avg', 'p(95)'],
};

/ ** ------------------------------------------------------------------------------** /;

export function vu_setup() {
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

    log(`Registered and changed globalData: ${globalData.currentUser.username}.`);

    vuSetupsDone.add(1);
  }
}

export function create_category() {
  setCookieJar();
  const uniqueId = `:VU.${__VU}-ITER.${__ITER}`;
  let res = post('inventory/category/create', {
    name: `K6-Category${uniqueId}`,
    description: 'K6-Description',
  });

  check(res, { 'inventory/category/create': (r) => r.status === 201 });
}

export function create_product() {
  const currentUser = setCookieJar();
  const categories = getCategories(currentUser.id);
  if (categories.length > 0) {
    const uniqueId = `:VU.${__VU}-ITER.${__ITER}-${uuidv4()}`;
    let res = post('inventory/product/create', {
      name: `K6-Product-${uniqueId}`,
      description: 'K6-Description',
      category: categories[randomInt(0, categories.length - 1)].name,
      quantity: randomInt(100, 200),
      price: 10,
    });

    check(res, { 'inventory/product/create': (r) => r.status === 201 });
  } else {
    log(`Skipped due to 0 categories.`);
  }
}

export function vu_teardown() {
  setCookieJar();
  log(`Tearing down...`);

  check(get('auth/logout'), { 'auth/logout': (r) => r.status === 200 });

  log(`Torn down.`);
}
