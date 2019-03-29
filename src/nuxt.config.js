/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */

const pkg = require('./package');

module.exports = {
  env: {
    IS_TESTNET: process.env.IS_TESTNET,
    CI: process.env.CI,
    INTERCOM_APPID: process.env.INTERCOM_APPID,
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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'preload', href: '/vendor/typekit.js', as: 'script' },
      { rel: 'preload', href: 'https://use.typekit.net/rul4lrs.js', as: 'script' },
    ],
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
    { src: '@likecoin/ui-vue/dist/ui-vue.css', lang: 'css' },
    { src: '~/assets/css/index.scss', lang: 'scss' },
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/likecoin-ui-vue.js',
    '~/plugins/portal-vue.js',
    { src: '~/plugins/vue-awesome-swiper.js', ssr: false },
    '~/plugins/vue-i18n.js',
    { src: '~/plugins/vue-intercom', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/google-analytics',
    '@nuxtjs/sentry',
    '@nuxtjs/pwa',
    'nuxt-svg-loader',
    'portal-vue/nuxt',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    browserBaseURL: '/',
  },
  googleAnalytics: {
    id: process.env.GA_TRACKING_ID || '',
    dev: false, // disable module for nuxt dev
    disabled: () => !!((window && window.doNotTrack) || (navigator && navigator.doNotTrack)), // eslint-disable-line no-undef
  },
  sentry: {},
  router: {
    middleware: 'sliding-menu',
    extendRoutes(routes, resolve) {
      // Change /settings/following/unfollowed to /settings/unfollowed
      let route = routes.find(r => r.path === '/settings');
      route = route.children.find(r => r.path === 'following');
      route.children.push({
        path: '/settings/unfollowed',
        component: resolve(__dirname, 'pages/settings/following/index.vue'),
        name: 'settings-unfollowed',
      });
    }
  },

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
            exclude: /(node_modules)||(.svg$)/,
          });
        } else {
          config.devtool = 'source-map';
        }
      }
      /* eslint-enable no-param-reassign */
    },
  },
};
