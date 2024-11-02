const isNumberPrime = (number) => {
    if (!number || isNaN(number)) {
        return `${number} is not a number.`;
    }

    if (number < 0) {
        return `${number} is not a prime number because it is a negative number.`;
    }

    if (number === 1 || number === 0) {
        return `${number} is not a prime number.`;
    }

    const squaredNumber = Math.floor(Math.sqrt(number));
    for (let i = 2; i <= squaredNumber; i++) {
        if (number % i === 0) {
            return `${number} is not a prime number because it is divisible by ${i}`;
        }
    }

    return `${number} is a prime number! :)`;
};

module.exports = { isNumberPrime };