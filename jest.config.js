module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/config/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/*.test?(-*).[jt]s'],
  modulePathIgnorePatterns: ['/\\.history']
}
