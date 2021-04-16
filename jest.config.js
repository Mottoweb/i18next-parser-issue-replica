module.exports = {
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '^src(.*)$': '<rootDir>/src$1',
    '^external(.*)$': '<rootDir>/external$1',
    '\\.(css|scss|ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/jest/mock.js',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.ts',
  ],
  setupFiles: [
    '<rootDir>/jest/setup.js',
    'jest-localstorage-mock',
    '<rootDir>/jest/shim.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest/matchers.js',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': '../../jest-wrapper.js',
  },
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  unmockedModulePathPatterns: [
    'react',
    'enzyme',
    'jasmine-enzyme',
  ],
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
};
