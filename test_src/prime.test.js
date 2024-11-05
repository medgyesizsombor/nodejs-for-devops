const { isNumberPrime } = require('../src/prime');
const http = require('http');
const { createServer } = require('../src/index');

describe('isNumberPrime function', () => {
  test('should tell that 1 is not a prime number', () => {
    expect(isNumberPrime(1)).toBe('1 is not a prime number.');
  });

  test('should tell that 0 is not a prime number', () => {
    expect(isNumberPrime(0)).toBe('0 is not a prime number.');
  });

  test('should tell that teszt is not a number', () => {
    expect(isNumberPrime('teszt')).toBe('teszt is not a number.');
  });

  test('should tell that -4 is a negative number', () => {
    expect(isNumberPrime(-4))
      .toBe('-4 is not a prime number because it is a negative number.');
  });

  test('should tell that 3.14 is not a prime number', () => {
    expect(isNumberPrime(3.14))
      .toBe('3.14 is not a prime number ' +
        'because it is not a whole number.');
  });

  test('should tell that 3 is a prime number', () => {
    expect(isNumberPrime(3)).toBe('3 is a prime number! :)');
  });
});

describe('HTTP Server', () => {
  let server;
  const PORT = 3000;

  beforeAll(done => {
    server = createServer();
    server.listen(PORT, done);
  });

  afterAll(done => {
    server.close(done);
  });

  const makeRequest = path => {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}${path}`, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({ statusCode: res.statusCode, data });
        });
      }).on('error', reject);
    });
  };

  test('should return 400 for missing parameters', async () => {
    const response = await makeRequest('/isPrimeNumber');
    expect(response.statusCode).toBe(400);
    expect(response.data)
      .toBe('Please provide a number as query parameter: number');
  });

  test('should tell that 1 is not a prime number', async () => {
    const response = await makeRequest('/isPrimeNumber?number=1');
    expect(response.statusCode).toBe(200);
    expect(response.data).toBe('1 is not a prime number.');
  });

  test('should tell that 0 is not a prime number', async () => {
    const response = await makeRequest('/isPrimeNumber?number=0');
    expect(response.statusCode).toBe(200);
    expect(response.data).toBe('0 is not a prime number.');
  });

  test('should tell that it is an invalid number', async () => {
    const response = await makeRequest('/isPrimeNumber?number=teszt');
    expect(response.statusCode).toBe(400);
    expect(response.data).toBe('teszt is not a valid number.');
  });

  test('should tell that -4 is a negative number', async () => {
    const response = await makeRequest('/isPrimeNumber?number=-4');
    expect(response.statusCode).toBe(200);
    expect(response.data)
      .toBe('-4 is not a prime number because it is a negative number.');
  });

  test('should return 404 for not-found path', async () => {
    const response = await makeRequest('/not-found');
    expect(response.statusCode).toBe(404);
    expect(response.data).toBe('Not Found');
  });

  test('should tell that 3.14 is not a prime number', async () => {
    const response = await makeRequest('/isPrimeNumber?number=3.14');
    expect(response.statusCode).toBe(200);
    expect(response.data).toBe('3.14 is not a prime number ' +
      'because it is not a whole number.');
  });
});