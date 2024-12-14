// src/index.js
const http = require('http');
const url = require('url');
const { isNumberPrime } = require('./prime');
const promClient = require('prom-client');

const register = new promClient.Registry();

promClient.collectDefaultMetrics({
  register,
  prfix: 'primenumber_'
});

/**
 * Monitor the duration of the http requests
 */
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests is seconds',
  labelNames: ['method', 'path', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1]
});

/**
 * Monitor number of the requests
 */
const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status_code']
});

/**
 * Monitor the errors
 */
const errorsTotal = new promClient.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['error_type']
});

/**
 * Monitor number of the correct requests
 */
const correctRequestsTotal = new promClient.Counter({
  name: 'correct_requests',
  help: 'Total number of the prime numbers performed',
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(errorsTotal);
register.registerMetric(correctRequestsTotal);

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  const startTime = process.hrtime();

  const endTimer = (statusCode) => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const duration = seconds + nanoseconds / 1e9;
    const path = url.parse(req.url).pathname;

    httpRequestDuration.labels(req.method, path, statusCode).observe(duration);

    httpRequestTotal.labels(req.method, path, statusCode).inc();
  };

  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/metrics' && req.method === 'GET') {
    console.log('/metrics endpoint called.');
    try {
      const metrics = await register.metrics();

      res.writeHead(200, { 'Content-Type': register.contentType });
      res.end(metrics);
      console.log('metrics set correctly');
      endTimer(200);
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': register.contentType });
      res.end('error collecting metrics');
      console.log('error occured while collecting metrics');
      endTimer(500);
      return;
    }
  } else if (pathname === '/isPrimeNumber' && req.method === 'GET') {
    const { number } = query;

    if (!number) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Please provide a number as query parameter: number');
      errorsTotal.labels('missing_parameter').inc();
      endTimer(400);
      return;
    }

    const numberFromQueryParams = parseFloat(number);

    if (isNaN(numberFromQueryParams)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`${number} is not a valid number.`);
      errorsTotal.labels('invalid_number').inc();
      endTimer(400);
      return;
    }

    try {
      const isPrimeNumber = isNumberPrime(numberFromQueryParams);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(isPrimeNumber);
      correctRequestsTotal.inc();
      endTimer(200);
    } catch (err) {
      res.write(500, { 'Content-Type': 'text/plain' });
      res.end(err.message);
      errorsTotal.labels('error').inc();
      endTimer(500);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    errorsTotal.labels('not_found').inc();
    endTimer(404);
  }
}).on('error', err => {
  console.error('Server error:', err.message);
});

process.on('uncaughtException', err => {
  console.error(err.message);
  process.exit(1);
});

const createServer = () => {
  return server;
};

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

module.exports = { createServer };