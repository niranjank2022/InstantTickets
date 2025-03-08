export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  rootDir: './',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    transform_regex: [
      'ts-jest',
      {
        isolatedModule: true,
      },
    ],
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
};
