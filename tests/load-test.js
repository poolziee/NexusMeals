import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const url = (slug) => `http://nex-api.local/${slug}`;
  const registerData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johnDoe1@mail.com',
    address: 'SomeAddress',
    password: 'Somepass123.',
    role: 'CHEF',
    city: 'Eindhoven',
    postalCode: '5123JP',
    street: 'Marconilaan',
    houseNumber: '13',
  };

  const loginData = {
    email: 'johnDoe1@mail.com',
    password: 'Somepass123.',
  };

  let res = http.post(url('auth/register'), registerData);

  check(res, { 'success register': (r) => r.status === 201 });

  sleep(1);

  res = http.post(url('auth/login'), loginData);

  check(res, { 'success login': (r) => r.status === 201 });
  sleep(0.3);
}
