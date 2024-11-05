// src/index.js
const http = require('http');
const url = require('url');
const { isNumberPrime } = require('./prime');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/isPrimeNumber' && req.method === 'GET') {
    const { number } = query;

    if (!number) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Please provide a number as query parameter: number');
      return;
    }

    const numberFromQueryParams = parseFloat(number);

    if (isNaN(numberFromQueryParams)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end(`${number} is not a valid number.`);
      return;
    }

    try {
      const isPrimeNumber = isNumberPrime(numberFromQueryParams);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(isPrimeNumber);
    } catch (err) {
      res.write(500, { 'Content-Type': 'text/plain' });
      res.end(err.message);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
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