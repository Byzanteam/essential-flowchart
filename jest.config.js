module.exports = {
  rootDir: __dirname,
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
};
