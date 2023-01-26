/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const path = require('path');
const { getSitemapRoutes } = require('./config/sitemap');
const { theme } = require('./tailwind.config');

const siteName = 'Liker.Land';

const {
  IS_TESTNET,
  CI,
  CRISP_WEBSITE_ID,
  STRIPE_PUBLIC_KEY,
  GA_TRACKING_ID,
  ADWORDS_TRACKING_ID,
  EXTERNAL_URL,
} = process.env;

const nuxtConfig = {
  env: {
    IS_TESTNET,
    CI,
    CRISP_WEBSITE_ID,
    STRIPE_PUBLIC_KEY,
    GA_TRACKING_ID,
    ADWORDS_TRACKING_ID,
    SITE_NAME: siteName,
    EXTERNAL_URL,
  },
  mode: 'universal',
  server: {
    timing: IS_TESTNET ? {
      total: true
    } : false,
  },
  telemetry: false,

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
      { hid: 'description', name: 'description', content: 'Publish as you write. Collect as you read.' },
      { hid: 'og:description', property: 'og:description', content: 'Publish as you write. Collect as you read.' },
      { hid: 'og:image', name: 'og:image', property: 'og:image', content: '/images/og/default.png' },
    ],
    link: [
      { rel: 'preconnect', href: 'https://storage.googleapis.com' },
      { rel: 'preconnect', href: 'https://p.typekit.net' },
      { rel: 'preload', href: '/vendor/typekit.js', as: 'script' },
      { rel: 'preload', href: 'https://use.typekit.net/rul4lrs.js', as: 'script' },

      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: theme.colors['like-green'] },

      ...[
        { width: 320, height: 568, pixelRatio: 2, fileName: 'iphone5.png' },
        { width: 375, height: 667, pixelRatio: 2, fileName: 'iphone6.png' },
        { width: 621, height: 1104, pixelRatio: 3, fileName: 'iphoneplus.png' },
        { width: 375, height: 812, pixelRatio: 3, fileName: 'iphonex.png' },
        { width: 414, height: 896, pixelRatio: 2, fileName: 'iphonexr.png' },
        { width: 414, height: 896, pixelRatio: 3, fileName: 'iphonexsmax.png' },
        { width: 768, height: 1024, pixelRatio: 2, fileName: 'ipad.png' },
        { width: 834, height: 1112, pixelRatio: 2, fileName: 'ipadpro1.png' },
        { width: 834, height: 1194, pixelRatio: 2, fileName: 'ipadpro3.png' },
        { width: 102, height: 1366, pixelRatio: 2, fileName: 'ipadpro2.png' },
      ].map(({ width, height, pixelRatio, fileName }) => ({
        rel: 'apple-touch-startup-image',
        href: `/images/splash/${fileName}`,
        media:
          `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${pixelRatio})`,
      })),
    ],
    script: [
      { src: '/vendor/typekit.js', type: 'text/javascript' },
      {
        hid: 'schema',
        innerHTML: JSON.stringify([
          {
            '@context': 'http://www.schema.org',
            '@type': 'Organization',
            name: 'Liker Land',
            url: 'https://liker.land',
            logo: 'https://liker.land/logo.png',
            sameAs:['https://www.facebook.com/Liker.Land'],
          },
          {
            '@context': 'http://www.schema.org',
            '@type': 'WebApplication',
            name: 'Liker Land',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'All',
            url: 'https://liker.land',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
          {
            '@context': 'http://www.schema.org',
            '@type': 'MobileApplication',
            name: 'Liker Land',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'IOS',
            url: 'https://apps.apple.com/app/liker-land/id1248232355',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.3',
              ratingCount: '16',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
          {
            '@context': 'http://www.schema.org',
            '@type': 'MobileApplication',
            name: 'Liker Land',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'ANDROID',
            url: 'https://play.google.com/store/apps/details?id=com.oice',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '3.8',
              ratingCount: '1699',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
        ]),
        type: 'application/ld+json',
        body: true,
      },
    ],
    __dangerouslyDisableSanitizersByTagID: { schema: ['innerHTML'] },
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: theme.colors['like-cyan'] },

  render: {
    csp: {
      enabled: true,
      unsafeInlineCompatibility: true,
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': [
          "'self'",
          'data:',
          'blob:',
          '*',
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'", // ignored by browser with sha support
          "'wasm-unsafe-eval'",
          '*.google-analytics.com',
          'www.googletagmanager.com',
          'www.google.com',
          'googleads.g.doubleclick.net',
          'www.googleadservices.com',
          'use.typekit.net',
          'https://js.stripe.com',
          'https://admin.typeform.com',
          '*.crisp.chat',
        ],
        'frame-src': [
          'www.google.com',
          'vimeo.com',
          'player.vimeo.com',
          'button.like.co',
          'https://js.stripe.com',
          'https://hooks.stripe.com',
          'admin.typeform.com',
          'civicliker.typeform.com',
          'bid.g.doubleclick.net',
        ],
        'connect-src': [
          "'self'",
          'data:',
          '*',
          'wss://client.relay.crisp.chat',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'client.crisp.chat',
        ],
      },
    },
  },
  /*
  ** Global CSS
  */
  css: [
    { src: '@likecoin/ui-vue/dist/ui-vue.css', lang: 'css' },
    { src: '@likecoin/wallet-connector/dist/style.css', lang: 'css' },
    { src: '~/assets/css/index.scss', lang: 'scss' },
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/likecoin-ui-vue.js',
    '~/plugins/portal-vue.js',
    '~/plugins/vue-i18n.js',
    { src: '~/plugins/gtag.client.js', mode: 'client' },
    { src: '~/plugins/ui-plugin.client.js', ssr: false },
    { src: '~/plugins/vue-cookie.client.js', ssr: false },
    { src: '~/plugins/crisp.client.js', ssr: false },
    { src: '~/plugins/vue-clipboard2', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/sentry',
    '@nuxtjs/sitemap',
    ['@nuxtjs/pwa', { icon: false }],
    'portal-vue/nuxt',
    // ['@likecoin/nuxt-google-optimize', {
    //   plugins: [{ src: '~/plugins/experiment.client.js', mode: 'client' }],
    // }],
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://github.com/postcss/postcss/wiki/PostCSS-8-for-end-users
    '@nuxt/postcss8',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/svg',
  ],

  // Fix @nuxt/postcss8 error https://github.com/nuxt-community/tailwindcss-module/issues/480
  devServerHandlers: [],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    browserBaseURL: '/',
  },

  /**
   * Nuxt PWA modules
   */
  workbox: {
    runtimeCaching: [
      {
        urlPattern: `https://api\\.${IS_TESTNET ? 'rinkeby\\.' : '' }like\\.co/.*`,
      },
      {
        urlPattern: `https://us-central1-civic-liker${IS_TESTNET ? '-develop' : '' }\\.cloudfunctions\\.net/.*`,
      },
    ],
  },
  meta: {
    name: siteName,
    theme_color: theme.colors['like-green'],
    nativeUI: true,
    appleStatusBarStyle: 'black-translucent',
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
  sentry: {
    config: {
      ignoreErrors: ["WebAssembly.instantiate"],
    },
    clientIntegrations: {
      /* default integrations will still be added due to deep-merge */
      ReportingObserver: false, // reporting is very noisy on CSP violation.
    },
  },
  sitemap: {
    hostname: EXTERNAL_URL,
    routes: getSitemapRoutes,
  },
  // googleOptimize: {
  //   useFetch: false,
  //   maxAge: 86400, // 1 day
  // },
  router: {
    extendRoutes(routes, resolve) {
      const route = routes.find(r => r.name === 'id');
      const [subscribeRoute] = route.children;
      const replaceToUnsubscribe = s => s.replace('subscribe', 'unsubscribe');
      route.children.push({
        name: replaceToUnsubscribe(subscribeRoute.name),
        path: replaceToUnsubscribe(subscribeRoute.path),
        component: subscribeRoute.component,
        chunkName: replaceToUnsubscribe(subscribeRoute.chunkName),
      });

      const civicPageRouteIndex = routes.findIndex(r => r.name === 'civic-from');
      routes.splice(
        civicPageRouteIndex,
        0,
        // For Civic Liker Classic
        {
          path: '/civic/classic',
          component: resolve(__dirname, 'pages/_id/civic/index.vue'),
          name: 'civic-classic',
        },
      );
    }
  },

  /*
  ** Build configuration
  */
  build: {
    babel: {
      presets: ({ isServer }) => [
        [
          '@nuxt/babel-preset-app',
          {
            targets: isServer
              ? { node: '10' }
              : { browsers: 'ie 11, > 0.5%, Firefox ESR' },
          },
        ],
      ],
    },
    transpile: ['gsap'],

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      /* eslint-disable no-param-reassign */
      if (ctx.isClient && !ctx.isDev) {
        config.devtool = 'source-map';
      }
      if (!ctx.isDev) {
        config.resolve.alias['bn.js'] = path.join(__dirname, './node_modules/bn.js');
      }
      /* eslint-enable no-param-reassign */
    },
  },
};

module.exports = nuxtConfig;
