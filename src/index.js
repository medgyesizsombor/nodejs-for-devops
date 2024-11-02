// src/index.js
const { isNumberPrime } = require('./prime');

// Get command-line arguments
const args = process.argv.slice(2); // The first two arguments are node path and the script path, so we ignore them

if (args.length !== 1) {
  console.error('Please provide exactly 1 number as arguments.');
  process.exit(1); // Exit with an error code
}

const number = parseInt(args[0]);

if (isNaN(number)) {
  console.error('Argument must be a valid number.');
  process.exit(1); // Exit with an error code
}

const result = isNumberPrime(number);

console.log(result);