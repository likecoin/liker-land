module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb-base',
    '@nuxtjs',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {},
  settings: {
    'import/resolver': {
      webpack: 'webpack.config.js',
    },
  },
}
