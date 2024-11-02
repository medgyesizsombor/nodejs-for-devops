const { isNumberPrime } = require('../src/math');

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
        expect(isNumberPrime(-4)).toBe('-4 is not a prime number because it is a negative number.');
    });

    test('should tell that 3 is a prime number', () => {
        expect(isNumberPrime(3)).toBe('3 is a prime number! :)');
    });
});