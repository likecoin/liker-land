/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const theme = require('./tailwind.config');

const siteName = 'Liker.Land';

module.exports = {
  env: {
    IS_TESTNET: process.env.IS_TESTNET,
    CI: process.env.CI,
    INTERCOM_APPID: process.env.INTERCOM_APPID,
    SITE_NAME: siteName,
  },
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: (titleChunk) => titleChunk ?
      `${titleChunk} - ${process.env.SITE_NAME}` : process.env.SITE_NAME,
    meta: [
      { name: 'msapplication-TileColor', content: theme.colors['like-green'] },
      { name: 'msapplication-TileImage', content: '/mstile-144x144.png' },
      { name: 'msapplication-config', content: '/browserconfig.xml' },
    ],
    link: [
      { rel: 'preload', href: '/vendor/typekit.js', as: 'script' },
      { rel: 'preload', href: 'https://use.typekit.net/rul4lrs.js', as: 'script' },

      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: theme.colors['like-green'] },

      ...[
        { width: 320, height: 568, pixelRatio: 2, fileName: 'iphone5_splash.png' },
        { width: 375, height: 667, pixelRatio: 2, fileName: 'iphone6_splash.png' },
        { width: 621, height: 1104, pixelRatio: 3, fileName: 'iphoneplus_splash.png' },
        { width: 375, height: 812, pixelRatio: 3, fileName: 'iphonex_splash.png' },
        { width: 414, height: 896, pixelRatio: 2, fileName: 'iphonexr_splash.png' },
        { width: 414, height: 896, pixelRatio: 3, fileName: 'iphonexsmax_splash.png' },
        { width: 768, height: 1024, pixelRatio: 2, fileName: 'ipad_splash.png' },
        { width: 834, height: 1112, pixelRatio: 2, fileName: 'ipadpro1_splash.png' },
        { width: 834, height: 1194, pixelRatio: 2, fileName: 'ipadpro3_splash.png' },
        { width: 102, height: 1366, pixelRatio: 2, fileName: 'ipadpro2_splash.png' },
      ].map(({ width, height, pixelRatio, fileName }) => ({
        rel: 'apple-touch-startup-image',
        href: `/splash/${fileName}`,
        media:
          `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${pixelRatio})`,
      })),
    ],
    script: [
      { src: '/vendor/typekit.js', type: 'text/javascript' },
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: theme.colors['like-cyan'] },

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
    '~/plugins/vue-i18n.js',
    { src: '~/plugins/client-ui-plugins.js', ssr: false },
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
    ['@nuxtjs/pwa', { icon: false }],
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

  /**
   * Nuxt PWA modules
   */
  meta: {
    name: siteName,
    theme_color: theme.colors['like-green'],
    nativeUI: true,
  },
  manifest: {
    name: siteName,
    short_name: siteName,
    icons: [
      '48x48',
      '72x72',
      '96x96',
      '144x144',
      '192x192',
      '256x256',
      '384x384',
      '512x512',
    ].map(sizes => ({
      sizes,
      src: `/android-chrome-${sizes}.png`,
      type: 'image/png',
    })),
    theme_color: theme.colors['like-green'],
    background_color: theme.colors['like-green'],
    display: 'standalone',
    orientation: 'portrait',
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
