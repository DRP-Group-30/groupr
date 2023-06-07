module.exports = {
  plugins: ["@typescript-eslint/eslint-plugin", "eslint-plugin-tsdoc"],
  extends: ["plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    // Ensure correct TSDoc comments:
    // https://tsdoc.org/pages/packages/eslint-plugin-tsdoc/
    "tsdoc/syntax": "warn",
  },
};
