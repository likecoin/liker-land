/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { getSitemapRoutes } = require('./config/sitemap');
const { theme } = require('./tailwind.config');

const SITE_NAME = 'Liker Land Bookstore';

const {
  IS_TESTNET,
  CI,
  CRISP_WEBSITE_ID,
  STRIPE_PUBLIC_KEY,
  GA_TRACKING_ID,
  AD_CONVERSION_ID,
  GRE_API_KEY,
  GRE_PROJECT_ID,
  EXTERNAL_URL,
  FACEBOOK_PIXEL_ID,
} = process.env;

const nuxtConfig = {
  env: {
    IS_TESTNET,
    CI,
    CRISP_WEBSITE_ID,
    STRIPE_PUBLIC_KEY,
    GA_TRACKING_ID,
    AD_CONVERSION_ID,
    FACEBOOK_PIXEL_ID,
    GRE_API_KEY,
    GRE_PROJECT_ID,
    SITE_NAME,
    EXTERNAL_URL,
  },
  mode: 'universal',
  server: {
    timing: IS_TESTNET
      ? {
          total: true,
        }
      : false,
  },
  telemetry: false,

  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      class: ['text-[16px]', 'font-sans'],
    },
    titleTemplate: titleChunk => {
      const siteName = process.env.SITE_NAME;
      if (titleChunk) {
        if (titleChunk.includes(siteName)) {
          return titleChunk;
        }
        return `${titleChunk} - ${siteName}`;
      }
      return siteName;
    },
    meta: [
      {
        hid: 'viewport',
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'theme-color',
        name: 'theme-color',
        content: theme.colors['like-green'],
      },
      { name: 'msapplication-TileColor', content: theme.colors['like-green'] },
      { name: 'msapplication-TileImage', content: '/mstile-144x144.png' },
      { name: 'msapplication-config', content: '/browserconfig.xml' },
      { hid: 'og:title', property: 'og:title', content: SITE_NAME },
      {
        hid: 'description',
        name: 'description',
        content:
          'Merge technology and humanity. Drive blockchain publishing to preserve and distribute great stories. Liker Land Bookstore bridges the new world and old, reshaping reading and media culture.',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Merge technology and humanity. Drive blockchain publishing to preserve and distribute great stories. Liker Land Bookstore bridges the new world and old, reshaping reading and media culture.',
      },
      {
        hid: 'og:image',
        name: 'og:image',
        property: 'og:image',
        content: `${EXTERNAL_URL}/images/og/default.jpg`,
      },
    ],
    link: [
      { rel: 'preconnect', href: 'https://storage.googleapis.com' },
      {
        hid: 'stripe-js-link',
        rel: 'preload',
        href: 'https://js.stripe.com/v3',
        as: 'script',
      },
      {
        hid: 'mailerlite-script-link',
        rel: 'preload',
        href: '/js/mailerlite.js',
        as: 'script',
      },
      {
        hid: 'mailerlite-script-universal-link',
        rel: 'preload',
        href: 'https://assets.mailerlite.com/js/universal.js',
        as: 'script',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: theme.colors['like-green'],
      },

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
        media: `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${pixelRatio})`,
      })),
    ],
    script: [
      {
        hid: 'stripe-js-script',
        src: 'https://js.stripe.com/v3',
        async: true,
      },
      {
        hid: 'mailerlite-script',
        src: '/js/mailerlite.js',
        async: true,
      },
      {
        hid: 'schema',
        innerHTML: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Liker Land Bookstore',
            alternateName: ['Liker Land 電子書店', 'Liker.Land'],
            url: 'https://liker.land/',
            potentialAction: [
              {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate:
                    'https://liker.land/store?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            ],
          },
          {
            '@context': 'http://www.schema.org',
            '@type': 'OnlineStore',
            name: 'Liker Land Bookstore',
            alternateName: ['Liker Land 電子書店', 'Liker.Land', 'Liker Land'],
            description:
              'Liker Land is a Web3 bookstore with a decentralized publishing stack that assists authors in registering and storing their articles, ebooks on the blockchain and decentralized networks',
            url: 'https://liker.land',
            logo: 'https://liker.land/logo.png',
            sameAs: [
              'https://www.facebook.com/Liker.Land',
              'https://www.instagram.com/liker.land/',
            ],
            brand: [
              {
                '@context': 'http://www.schema.org',
                '@type': 'Brand',
                url: 'https://liker.land/about/writing-nft',
                name: 'Writing NFT',
              },
              {
                '@context': 'http://www.schema.org',
                '@type': 'Brand',
                url: 'https://liker.land/about/nft-book',
                name: 'NFT Book',
              },
              {
                '@context': 'http://www.schema.org',
                '@type': 'Brand',
                url: 'https://liker.land/civic',
                name: 'Civic Liker',
              },
            ],
          },
          {
            '@context': 'http://www.schema.org',
            '@type': 'WebApplication',
            name: 'Liker Land Bookstore',
            alternateName: ['Liker Land 電子書店', 'Liker.Land'],
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'All',
            url: 'https://liker.land',
            offers: {
              '@context': 'http://www.schema.org',
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
        'default-src': ["'self'", 'data:', 'blob:', '*'],
        'script-src': [
          "'self'",
          "'unsafe-inline'", // ignored by browser with sha support
          "'wasm-unsafe-eval'",
          '*.google-analytics.com',
          'www.googletagmanager.com',
          'www.gstatic.com',
          'www.google.com',
          'googleads.g.doubleclick.net',
          'www.googleadservices.com',

          // stripe
          'https://js.stripe.com',
          'https://checkout.stripe.com',
          'https://*.js.stripe.com',
          'https://maps.googleapis.com',

          // cloudflare
          'static.cloudflareinsights.com',
          'cdnjs.cloudflare.com',

          'https://unpkg.com/@google/model-viewer@3.1.1/',
          'https://substackapi.com',
          '*.crisp.chat',
          'connect.facebook.net',
          '*.elfsight.com',
          'https://assets.mailerlite.com',
        ],
        'frame-src': [
          'blob:',
          'www.google.com',
          'button.like.co',

          // stripe
          'https://js.stripe.com',
          'https://*.js.stripe.com',
          'https://hooks.stripe.com',
          'https://checkout.stripe.com',

          'bid.g.doubleclick.net',
          'td.doubleclick.net',
          'www.googletagmanager.com',

          'verify.walletconnect.com',

          'www.facebook.com',
          'www.youtube.com',

          'https://newsletter.like.co',
          'https://authcore.like.co',
          'https://likecoin.github.io',
          'https://likecoin-integration-test.authcore.io',
          'https://assets.mailerlite.com/',
        ],
        'connect-src': [
          "'self'",
          'data:',
          '*',

          // stripe
          'https://checkout.stripe.com',
          'https://api.stripe.com',
          'https://maps.googleapis.com',

          'wss://client.relay.crisp.chat',
        ],
        'style-src': [
          "'self'",
          'blob:',
          "'unsafe-inline'",
          'client.crisp.chat',
          'fonts.googleapis.com',
          'https://assets.mailerlite.com',
        ],
        'worker-src': ["'self'", 'blob:'],
        'child-src': ["'self'", 'blob:'],
      },
    },
  },

  helmet: {
    referrerPolicy: { policy: 'strict-origin' },
  },

  /*
   ** Global CSS
   */
  css: [
    { src: '@likecoin/ui-vue/dist/ui-vue.css', lang: 'css' },
    { src: '@likecoin/wallet-connector/dist/style.css', lang: 'css' },
    { src: 'v-dropdown-menu/vue2/css', lang: 'css' },
    { src: '~/assets/css/index.scss', lang: 'scss' },
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/likecoin-ui-vue.js',
    '~/plugins/portal-vue.js',
    { src: '~/plugins/gre.client.js', mode: 'client' },
    { src: '~/plugins/gtag.client.js', mode: 'client' },
    { src: '~/plugins/ui-plugin.client.js', ssr: false },
    { src: '~/plugins/vue-cookie.client.js', ssr: false },
    { src: '~/plugins/crisp.client.js', ssr: false },
    { src: '~/plugins/vue-clipboard2', ssr: false },
    { src: '~/plugins/nuxt-client-init.client', ssr: false },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
    '@nuxtjs/sentry',
    '@nuxtjs/sitemap',
    'portal-vue/nuxt',
    [
      'nuxt-facebook-pixel-module',
      {
        track: 'PageView',
        pixelId: FACEBOOK_PIXEL_ID || '0',
        autoPageView: true,
        disabled: !FACEBOOK_PIXEL_ID,
      },
    ],
    // [
    //   '@likecoin/nuxt-google-optimize',
    //   {
    //     plugins: [{ src: '~/plugins/experiment.client.js', mode: 'client' }],
    //   },
    // ],
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [{ path: '~/components', ignore: ['~/components/Async/**.*'] }],

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
   * Nuxt I18n module configuration
   */
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en',
        file: 'en.json',
      },
      {
        code: 'zh-Hant',
        iso: 'zh-Hant',
        file: 'zh-Hant.json',
      },
    ],
    lazy: true,
    strategy: 'prefix',
    defaultLocale: 'zh-Hant',
    langDir: '~/locales/',
    detectBrowserLanguage: false, // Detect language based on IP with Cloudflare
    baseUrl: IS_TESTNET ? 'https://rinkeby.liker.land' : 'https://liker.land',
  },

  /**
   * Nuxt PWA modules
   */
  workbox: {
    runtimeCaching: [
      {
        urlPattern: `https://api\\.${
          IS_TESTNET ? 'rinkeby\\.' : ''
        }like\\.co/.*`,
      },
      {
        urlPattern: `https://us-central1-civic-liker${
          IS_TESTNET ? '-develop' : ''
        }\\.cloudfunctions\\.net/.*`,
      },
    ],
  },
  meta: {
    name: SITE_NAME,
    theme_color: theme.colors['like-green'],
    nativeUI: true,
    appleStatusBarStyle: 'black-translucent',
  },
  manifest: {
    name: SITE_NAME,
    short_name: SITE_NAME,
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
      ignoreErrors: [
        'WebAssembly.instantiate',
        '["@context"].toLowerCase',
        'pktAnnotationHighlighter',
      ],
    },
    tracing: {
      tracesSampleRate: IS_TESTNET ? 1.0 : 0.1,
      browserTracing: {},
      vueOptions: {
        trackComponents: true,
      },
      vueRouterInstrumentationOptions: {
        routeLabel: 'name',
      },
    },
    clientIntegrations: {
      /* default integrations will still be added due to deep-merge */
      ReportingObserver: false, // reporting is very noisy on CSP violation.
      Replay: {},
    },
    clientConfig: {
      replaysSessionSampleRate: IS_TESTNET ? 0.5 : 0.01,
      replaysOnErrorSampleRate: IS_TESTNET ? 1.0 : 1.0,
    },
  },
  sitemap: {
    hostname: EXTERNAL_URL,
    i18n: true,
    routes: getSitemapRoutes,
  },
  // googleOptimize: {
  //   useFetch: false,
  //   maxAge: 86400, // 1 day
  // },
  router: {
    middleware: 'from-channel',
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
              ? { node: 'current' }
              : { browsers: 'ie 11, > 1%, Firefox ESR' },
          },
        ],
      ],
    },
    transpile: [
      'gsap',
      'cosmjs-type',
      '@cosmjs',
      '@likecoin/iscn-js',
      '@likecoin/wallet-connector',
      '@walletconnect',
      ({ isLegacy }) => (isLegacy ? 'axios' : undefined),
    ],

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      /* eslint-disable no-param-reassign */
      if (ctx.isClient && !ctx.isDev) {
        config.devtool = 'source-map';
      }
      if (!ctx.isDev) {
        config.resolve.alias['bn.js'] = path.join(
          __dirname,
          './node_modules/bn.js'
        );
      }
      /* eslint-enable no-param-reassign */
    },
  },
};

module.exports = nuxtConfig;
