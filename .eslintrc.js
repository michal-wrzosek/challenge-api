module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
    "@typescript-eslint/explicit-function-return-type": false,
    "@typescript-eslint/explicit-member-accessibility": false,
    "@typescript-eslint/no-empty-interface": false,
    "@typescript-eslint/prefer-interface": false,
    "@typescript-eslint/no-object-literal-type-assertion": false,
    "@typescript-eslint/camelcase": false,
  },
};
