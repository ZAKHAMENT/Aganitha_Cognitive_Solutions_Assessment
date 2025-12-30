export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"]
};
