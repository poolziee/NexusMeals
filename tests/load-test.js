// TODO: fix VU usage: https://github.com/grafana/k6/issues/785
import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const VUsCount = 10;
const baseUrl = 'http://localhost:3000';
const url = (slug) => `${baseUrl}/${slug}`;

export const options = {
  // scenarios: {
  //   create_category: {
  //     exec: 'create_category',
  //     executor: 'ramping-arrival-rate',
  //     gracefulStop: '0s', // stop immediately on stop signal
  //     startRate: '1', // start at 1 iteration per second per VU
  //     timeUnit: '1s', // increase the rate every second
  //     preAllocatedVUs: 10, // number of VUs to pre-allocate
  //     maxVUs: VUsCount, // maximum number of VUs
  //     stages: [
  //       { target: 20, duration: '10s' }, // ramp up to 20 iterations per second over 10 seconds
  //       { target: 20, duration: '10s' }, // stay at 20 iterations per second for 10 seconds
  //       { target: 0, duration: '10s' }, // ramp down to 0 iterations per second over 10 seconds
  //     ],
  //   },
  //   create_product: {
  //     exec: 'create_product',
  //     executor: 'ramping-arrival-rate',
  //     gracefulStop: '0s', // stop immediately on stop signal
  //     startTime: '10s', // start seconds after the start of the test
  //     startRate: '1', // start at 1 iteration per second per VU
  //     timeUnit: '1s', // increase the rate every second
  //     preAllocatedVUs: 10, // number of VUs to pre-allocate
  //     maxVUs: VUsCount, // maximum number of VUs
  //     stages: [
  //       { target: 20, duration: '10s' }, // ramp up to 20 iterations per second over 10 seconds
  //       { target: 20, duration: '10s' }, // stay at 20 iterations per second for 10 seconds
  //       { target: 0, duration: '10s' }, // ramp down to 0 iterations per second over 10 seconds
  //     ],
  //   },
  // },
  scenarios: {
    create_category: {
      executor: 'per-vu-iterations',
      gracefulStop: '0s', // stop immediately on stop signal
      vus: VUsCount, // number of VUs to run concurrently
      iterations: 5, // number of iterations each VU will perform
      maxDuration: '1m', // maximum test duration
      exec: 'create_category', // function to execute
    },
    create_product: {
      executor: 'per-vu-iterations',
      gracefulStop: '0s', // stop immediately on stop signal
      startTime: '10s', // start seconds after the start of the test
      vus: VUsCount, // number of VUs to run concurrently
      iterations: 3, // number of iterations each VU will perform
      startTime: '0s', // start immediately after the create_category scenario
      maxDuration: '1m', // maximum test duration
      exec: 'create_product', // function to execute
    },
  },
};
function VU() {
  const vuModulus = __VU % VUsCount;
  return vuModulus === 0 ? VUsCount : vuModulus;
}

function post(slug, data) {
  return http.post(url(slug), JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function setup() {
  const users = [];
  http.cookieJar().clear(baseUrl);
  for (let i = 1; i <= VUsCount; i++) {
    const uniqueId = `${i}-${uuidv4()}`;
    const registerData = {
      firstName: `John${i}`,
      lastName: `Doe${i}`,
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
    check(res, { 'auth/login': (r) => r.status === 201 });

    const cookies = http.cookieJar().cookiesForURL(baseUrl);
    http.cookieJar().clear(baseUrl);
    users.push(cookies);
  }

  return { users };
}

/** Initialize cookies for the virtual user. */
function setCookieJar(data) {
  const cookies = data.users[VU() - 1];
  const currentUser = JSON.parse(decodeURIComponent(cookies['current_user'][0]));
  let jar = http.cookieJar();
  Object.keys(cookies).forEach((key) => {
    jar.set(baseUrl, key, cookies[key][0]);
  });

  return currentUser;
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

export function create_category(data) {
  setCookieJar(data);
  const uniqueId = `VU.${__VU}-ITER.${__ITER}`;
  let res = post('inventory/category/create', {
    name: `K6-Category-${uniqueId}`,
    description: 'K6-Description',
  });

  check(res, { 'inventory/category/create': (r) => r.status === 201 });
}

export function create_product(data) {
  const currentUser = setCookieJar(data);
  const categories = getCategories(currentUser.id);
  const randomIndex = randomInt(0, categories.length - 1);
  console.log(`User: ${currentUser.username}, Categories: ${categories.length}, randomIndex: ${randomIndex}`);
  console.log(categories);
  const uniqueId = `VU.${__VU}-ITER.${__ITER}`;
  let res = post('inventory/product/create', {
    name: `K6-Product-${uniqueId}`,
    description: 'K6-Description',
    category: categories[randomIndex].name,
    quantity: randomInt(100, 200),
    price: 10,
  });

  check(res, { 'inventory/product/create': (r) => r.status === 201 });
}
