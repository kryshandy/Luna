const { defaults } = require('jest-config');

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.js'],
  clearMocks: true,
  resetMocks: false,
};
