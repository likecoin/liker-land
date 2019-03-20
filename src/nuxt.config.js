/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */

const pkg = require('./package');

module.exports = {
  env: {
    IS_TESTNET: process.env.IS_TESTNET,
    CI: process.env.CI,
  },
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} - liker.land` : 'liker.land',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'theme-color', name: 'theme-color', content: '#D2F0F0' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    script: [
      { src: '/vendor/typekit.js', type: 'text/javascript' },
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#50e3c2' },

  /*
  ** Global CSS
  */
  css: [
    { src: '~/assets/css/index.scss', lang: 'scss' },
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/sentry',
    '@nuxtjs/pwa',
    '@nuxtjs/vuetify',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    browserBaseURL: '/',
  },
  sentry: {},

  /*
  ** Build configuration
  */
  build: {
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js',
        autoprefixer: {}
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      /* eslint-disable no-param-reassign */
      // Run ESLint on save
      if (ctx.isClient) {
        if (ctx.isDev) {
          config.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)/,
          });
        } else {
          config.devtool = 'source-map';
        }
      }
      /* eslint-enable no-param-reassign */
    },
  },
};
