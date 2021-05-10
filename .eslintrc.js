module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-bitwise': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-plusplus': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-underscore-dangle': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'func-names': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'consistent-return': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-shadow': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-mixed-operators': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/prefer-default-export': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-expressions': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-alert': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'class-methods-use-this': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-spread': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-new': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
