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
  rules: {
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    "import/extensions": ["error", "always", {
      "js": "never",
      "mjs": "never",
      "jsx": "never",
      "ts": "never",
      "tsx": "never",
      "vue": "never"
    }]
  },
  settings: {
    'import/resolver': {
      webpack: 'webpack.config.js',
    },
  },
}
