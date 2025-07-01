module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/app/javascript/setupTests.js'],
  testMatch: [
    '<rootDir>/app/javascript/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/app/javascript/**/*.{test,spec}.{js,jsx}'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-router-dom)/)'
  ],
  collectCoverageFrom: [
    'app/javascript/**/*.{js,jsx}',
    '!app/javascript/packs/**'
  ],
  moduleFileExtensions: ['js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '/public/']
};
