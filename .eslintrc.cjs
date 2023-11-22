/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    // Can disable some rules :
		'@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    
    // Standardize the code :
    // "@typescript-eslint/array-type": ["error", { default: 'array-simple' }],
    // "@typescript-eslint/explicit-function-return-type": "error",
    "eqeqeq": "error",
    "no-multiple-empty-lines": "error",
    "no-trailing-spaces": "error",
    "no-useless-return": "error",
    "semi": "off",
    "@typescript-eslint/semi": ["error"],
	},
};