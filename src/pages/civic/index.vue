<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      CivicLikerPageContentV2(
        :referrer="referrer"
        :rewards-currency="rewardsCurrency"
        @click-join="onClickActionButton"
      )
        template(#payment-select)
          .civic-page__payment-select.relative.mb-8
            .civic-page__payment-select-fake
              svg(v-if="selectedPaymentMethod === 'stripe'" height="24px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28.21 24')
                defs
                  mask#a(x='0' y='2.1' width='28.21' height='19.8' maskUnits='userSpaceOnUse')
                    polygon(points='0 2.1 28.21 2.1 28.21 21.9 0 21.9 0 2.1', style='fill: #fff;fill-rule: evenodd')
                g(style='fill: #28646e')
                  g(style='mask: url(#a)')
                    path(d='M25.31,20.1H2.9A1.1,1.1,0,0,1,1.8,19V10.37H26.41V19a1.1,1.1,0,0,1-1.1,1.1M2.9,3.9H25.31A1.1,1.1,0,0,1,26.41,5V6.75H1.8V5A1.1,1.1,0,0,1,2.9,3.9M25.31,2.1H2.9A2.9,2.9,0,0,0,0,5V19a2.9,2.9,0,0,0,2.9,2.9H25.31a2.91,2.91,0,0,0,2.9-2.9V5a2.91,2.91,0,0,0-2.9-2.9', style='fill-rule: evenodd')
                  circle(cx='4.72' cy='17.19' r='1',)
                  circle(cx='8' cy='17.19' r='1')
              svg(v-else-if="selectedPaymentMethod === 'paypal'" height="24px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.36 24')
                path(d='M5.79,23.19l.42-2.64H.85L3.93,1A.25.25,0,0,1,4.18.8h7.46c2.48,0,4.18.53,5.07,1.59a3.54,3.54,0,0,1,.8,1.52,5.7,5.7,0,0,1,0,2.1v.61l.42.23a3.2,3.2,0,0,1,.85.65A3,3,0,0,1,19.47,9a6.76,6.76,0,0,1-.1,2.24,7.85,7.85,0,0,1-.92,2.53A5.25,5.25,0,0,1,17,15.4a5.88,5.88,0,0,1-2,.88,9.57,9.57,0,0,1-2.44.28H12a1.76,1.76,0,0,0-1.14.42,1.81,1.81,0,0,0-.53,1l0,.24-.75,4.66v.17a.12.12,0,0,1,0,.1.11.11,0,0,1-.08,0Z' style='fill: #253b80')
                path(d='M18.34,6.1a1.78,1.78,0,0,1-.08.44c-1,5.05-4.35,6.79-8.64,6.79H7.43a1.07,1.07,0,0,0-1.06.9L5.26,21.34l-.32,2a.56.56,0,0,0,.45.64h4a.93.93,0,0,0,.92-.8l0-.19.73-4.64,0-.26a.93.93,0,0,1,.92-.79h.58c3.77,0,6.71-1.53,7.57-5.94.36-1.85.18-3.39-.8-4.48A4,4,0,0,0,18.34,6.1Z' style='fill: #179bd7')
                path(d='M17.31,5.69c-.31-.09-.63-.16-.95-.22a12.56,12.56,0,0,0-1.94-.13H8.58a.94.94,0,0,0-.93.79L6.41,14v.23a1.06,1.06,0,0,1,1-.9H9.65c4.3,0,7.67-1.74,8.65-6.79a2.14,2.14,0,0,1,.08-.44,5.65,5.65,0,0,0-.8-.34Z' style='fill: #222d65')
                path(d='M7.65,6.13a.94.94,0,0,1,.93-.8h5.84a11.44,11.44,0,0,1,1.94.14,6.68,6.68,0,0,1,1.15.29,4.59,4.59,0,0,1,.79.34,4.75,4.75,0,0,0-1-4.29C16.28.65,14.21,0,11.64,0H4.18a1.06,1.06,0,0,0-1,.9L0,20.6a.63.63,0,0,0,.52.73H5.26L6.41,14Z' style='fill: #253b80')
              svg(v-else-if="selectedPaymentMethod === 'likepay'" height="24px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20.36 24')
                defs
                  lineargradient#a(x1='0%' y1='50%' x2='100%' y2='50%')
                    stop(stop-color='#D2F0F0' offset='0%')
                    stop(stop-color='#F0E6B4' offset='100%')
                g(fill-rule='nonzero' fill='none')
                  circle(fill='url(#a)' cx='94' cy='94' r='90')
                  g(fill='#28646E')
                    path(d='M94 187.8C42.3 187.8.2 145.7.2 94 .2 42.3 42.3.2 94 .2c51.7 0 93.8 42.1 93.8 93.8 0 51.7-42.1 93.8-93.8 93.8zM94 8.2C46.7 8.2 8.2 46.7 8.2 94s38.5 85.8 85.8 85.8 85.8-38.5 85.8-85.8S141.3 8.2 94 8.2z')
                    path(d='M88.7386 73.1351c-.8455 0-1.8119-.3606-2.4158-1.082-1.208-1.3222-1.0872-3.3659.2416-4.568 9.0594-7.934 13.1663-14.5457 13.891-15.7479 2.6575-4.6883 7.006-7.0925 11.4753-6.3712 1.8119.2404 3.0198 1.8031 2.7782 3.6063-.2416 1.8032-1.8119 3.0054-3.6238 2.765-2.6574-.3607-4.3485 2.1638-5.0732 3.2457-.8456 1.4425-5.3149 8.7755-15.099 17.4308-.604.4809-1.4495.7213-2.1743.7213zM34.503 127.4713c-.9664 0-1.812-.3607-2.4159-1.2022-1.0871-1.3223-.9663-3.366.3624-4.568 3.1406-2.6447 9.6634-6.732 11.8376-7.934 1.5703-.8416 3.503-.1203 4.3485 1.4425.8456 1.5627.1208 3.4861-1.4495 4.3276-1.691.8415-7.7307 4.6883-10.6297 7.0926-.604.601-1.3287.8415-2.0534.8415z')
                    path(d='M115.5545 97.0574c1.3287 1.2022 2.7782.7213 4.1069-.601 9.301-8.8958 19.206-22.7202 22.4673-29.933.7248-1.5628 2.1743-2.4043 3.6238-1.8032 1.8119.7213 1.8119 3.8468.1208 7.0926-4.3485 8.7755-10.2674 18.5127-22.105 30.7744-1.0871 1.2022-.9663 2.765 0 3.6064 1.0871.9617 2.7782.8415 4.3485-.7213 6.1604-6.251 10.2674-11.0595 13.7703-15.9883.9664-1.3223 2.0535-1.8031 3.1406-1.5627 1.5703.3606 1.8119 1.8032 1.3287 3.6064-.7247 2.885-8.9386 13.4638-12.0792 17.0702-8.697 9.7372-17.5148 15.0266-34.305 23.8021-5.9187 3.0053-10.2672 6.0106-12.9247 10.4585-2.4158 4.0872-3.1406 5.4096-3.3822 5.8904-.9663 1.9234-.2415 4.448 1.812 5.4096.6039.2404 1.087.3606 1.691.3606 1.5703 0 3.0198-.9617 3.6238-2.4042 0 0-.1208.1202 3.0198-5.2894 1.5703-2.5244 4.8317-6.3712 9.905-8.6553 16.79-7.6936 23.796-13.7042 33.5801-23.4415 4.4693-4.4478 10.6297-13.9447 12.3208-16.7096 4.711-7.934 2.295-14.666-2.0534-15.7478-.3624-.1202-.4832-.4809-.3624-.8415 3.2614-5.65 4.8317-9.4968 5.4356-12.5021.8456-4.0873-.3624-9.016-5.9188-10.2181-.2416-.1202-.4832-.3607-.3624-.7213.3624-1.3223.7248-2.8851.9664-3.967 1.2079-5.2894-2.1743-10.0979-6.2812-10.9394-2.899-.601-5.4357 0-7.61 1.5628-.3623.2404-.7247.1202-.9663-.1202-.8455-.9617-2.295-1.9234-4.2277-1.9234-3.503-.1202-7.006.9617-9.5426 6.3712-1.8118 3.8468-4.4693 9.016-12.4415 17.7915-7.3684 8.1745-17.6357 15.9883-23.9169 20.1958-1.087.7213-2.6574.601-2.5366-.9617.2416-2.4043 2.7782-18.1522 3.2614-22.8405.7247-7.5734-3.3822-11.0595-7.9723-11.6606-3.7445-.4808-9.5426.601-12.6832 9.1362-1.8118 5.049-5.6772 13.2234-8.9386 26.4468-2.295 9.3766-2.6574 20.1957-.604 32.6979.1209.7212 0 1.5627-.3623 2.1638-2.5366 4.0872-6.1604 9.4968-8.2139 14.1851-.8455 1.9234-.1208 4.2074 1.6911 5.1691.604.3607 1.208.4809 1.9327.4809 1.4495 0 2.899-.8415 3.6238-2.284 1.2079-2.5245 3.7445-7.333 4.7108-9.3766 1.6911-3.4862 2.7783-5.7703 3.2614-7.2128.3624-1.3223.7248-2.8851-.1208-6.251-1.3287-5.7703-1.691-16.7096.604-26.4469 3.1406-12.7425 8.5762-27.0479 9.5426-29.4521.9663-2.4043 2.295-3.1255 3.6237-3.0053 1.3287.1202 3.9862.7212 3.2614 5.5298-1.3287 8.6553-3.1406 19.5946-3.7445 23.3212-.3624 1.8032-.604 6.0107 2.6574 7.934 2.6574 1.5628 5.5564.7214 8.697-1.4425 7.1268-4.8085 19.5683-14.4255 27.299-23.0808 8.0931-9.1362 10.7505-14.5458 12.804-19.4745.9663-2.284 3.3822-2.1638 4.2277-1.9234.8456.2404 1.9327 1.4426 1.208 3.8468-1.812 6.0106-9.301 19.7149-23.5545 32.5777-1.5703 1.4425-1.4495 3.1255-.604 4.0872.7248.8415 2.295 1.4426 3.9862 0 12.9247-10.9394 20.1722-24.0425 23.5544-31.0149 1.6911-3.4862 2.295-5.5298 2.7782-7.2128.7248-2.0436 2.295-2.7648 3.3822-2.5244 1.5703.3606 2.6574 1.9234 2.0535 4.568-.4832 2.2841-1.8119 6.0107-3.503 9.7373-4.107 8.7755-12.804 20.4362-22.2257 30.4138-.9664 1.2022-1.208 2.765.1208 3.967zM56.6717 53.7205c.4775-.4841.3581-.9683.1194-1.4524-.7163-2.1786-4.5363-11.498-5.6106-13.3136-.4775-.9682-1.1938-1.0893-1.91-.8472-.955.3631-2.0294 1.2103-3.82 2.7838-1.7907 1.5734-2.7457 2.5416-3.2232 3.5099-.3581.7262-.3581 1.3313.4775 1.9365 1.6713 1.2103 10.2663 6.4147 12.2957 7.383.7162.242 1.1937.4841 1.6712 0zM38.7266 57c-1.081 0-1.5614.4721-1.6816 1.1803-.12.9442 0 2.3606.3604 4.6032.3603 2.2425.7207 3.6589 1.2011 4.485.3604.5902.961.9443 1.9219.5902 1.9218-.8262 10.8103-5.4293 12.7321-6.7277.3603-.236.8408-.5901.7207-1.1803M128.4993 135.0155c-.589 0-.8247.5995-.9425 1.0791-.8247 2.1582-3.181 11.87-3.5345 13.9083-.1178 1.079.2357 1.5586.9425 1.7984.9426.2398 2.3564.2398 4.5948.12 2.2385-.12 3.6523-.3598 4.5948-.7194.707-.3597 1.0604-.8393.707-1.9184-.5891-2.0383-4.2414-11.2705-5.3018-13.3088-.1178-.4796-.4712-1.079-1.0603-.9592zM134.1298 130.4996c-.361.612.1204 1.1015.361 1.4687 1.4441 1.8359 8.424 9.1795 10.1088 10.5258.8423.7343 1.444.612 2.0458 0 .722-.7344 1.444-1.9583 2.5271-4.039 1.0831-2.0807 1.6848-3.427 1.8052-4.4061.1203-.7344-.2407-1.3464-1.2035-1.7135-2.0458-.612-11.9138-2.2031-14.2003-2.3255-.4813 0-1.083-.1224-1.444.4896z')
              svg(v-else height="24px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 24')

              span.civic-page__payment-select-fake-label {{ $t(`CivicPage.paymentMethod.${selectedPaymentMethod}`) }}
              svg(width="14px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7")
                polyline(points="1 1 7 6 13 1" style="fill: none;stroke: #28646e;stroke-linecap: round;stroke-linejoin: round;stroke-width: 2px")

            select.absolute.pin.opacity-0(
              ref="paymentSelect"
              v-model="selectedPaymentMethod"
            )
              option(
                v-for="method in paymentMethods"
                :key="method"
                :value="method"
              )
                | {{ $t(`CivicPage.paymentMethod.${method}`) }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import CivicLikerPageContentV2 from '~/components/CivicLikerPageContentV2';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import { logTrackerEvent } from '~/util/EventLogger';
// import swiperDirective from '~/util/SwiperDirectives';

import { getOAuthRegisterAPI, getUserMinAPI } from '~/util/api';
import { getAvatarHaloTypeFromUser, checkUserNameValid } from '~/util/user';

import { CrispMixinFactory } from '~/mixins/crisp';
// import experimentMixin from '~/mixins/experiment';

import { PAYMENT_METHOD_LIST } from '~/constant';

export default {
  components: {
    CivicLikerPageContentV2,
    PageHeader,
    SiteNavBar,
  },
  mixins: [
    CrispMixinFactory({ isBootAtMounted: false }),
    // experimentMixin('isExperimenting', 'civic-page', 'variant'),
  ],
  // directives: {
  //   swiper: swiperDirective,
  // },
  data() {
    return {
      isIntroVideoMuted: true,
      referrer: undefined,
      selectedPaymentMethod: PAYMENT_METHOD_LIST[0],
    };
  },
  computed: {
    ...mapGetters([
      'getLocale',
      'getIsHK',
      'getUserId',
      'getUserInfo',
      'getUserIsCivicLikerTrial',
      'getUserIsCivicLiker',
    ]),
    paymentMethods() {
      return PAYMENT_METHOD_LIST;
    },
    getOAuthRegisterAPI() {
      const { from, referrer } = this.$route.query;
      return getOAuthRegisterAPI(from, referrer);
    },
    rewardsCurrency() {
      switch (this.getLocale) {
        case 'zh-Hant': {
          if (this.isCantonese) return 'HKD';
          return 'TWD';
        }
        case 'en':
        default:
          return 'USD';
      }
    },
    isCantonese() {
      if (!process.client) return false;
      return (
        navigator &&
        ((navigator.language &&
          navigator.language.toLowerCase().includes('hk')) ||
          (navigator.languages &&
            navigator.languages.find(lang =>
              lang.toLowerCase().includes('hk')
            )))
      );
    },
  },
  async asyncData({ route, $axios }) {
    // Fetch referrer info
    const { from } = route.query;
    if (from && checkUserNameValid(from)) {
      try {
        const user = await $axios.$get(getUserMinAPI(from));
        return {
          referrer: {
            ...user,
            avatarHalo: getAvatarHaloTypeFromUser(user),
          },
        };
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    return undefined;
  },
  head() {
    return {
      title: this.$t('CivicPage.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CivicPage.ogDescription'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('CivicPage.ogDescription'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic.png',
        },
      ],
      link: [
        { rel: 'canonical', href: `${this.$route.path}` },
        { rel: 'prefetch', href: 'https://js.stripe.com/v3' },
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify([
            {
              '@context': 'http://www.schema.org',
              '@type': 'Product',
              name: 'Civic Liker',
              image: ['https://liker.land/images/og/civic.png'],
              description: this.$t('CivicPage.ogDescription'),
              brand: {
                '@type': 'Brand',
                name: 'Republic of Liker Land',
              },
              url: 'https://liker.land/civic',
              offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                price: '5',
                priceCurrency: 'USD',
                url: 'https://liker.land/civic',
              },
            },
          ]),
          type: 'application/ld+json',
          body: true,
        },
      ],
    };
  },
  async beforeMount() {
    let isHK = this.getIsHK;
    if (isHK === undefined) {
      isHK = false; // Default not from HK
      try {
        const { data: geoData } = await this.$axios.get('api/geoip');
        isHK = geoData.country === 'HK';
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
      this.$store.dispatch('setIsHK', isHK);
    }
    if (isHK) {
      this.selectedPaymentMethod =
        PAYMENT_METHOD_LIST[PAYMENT_METHOD_LIST.length - 1];
      this.$i18n.locale = 'zh-Hant';
      this.setLocale(this.$i18n.locale);
    }
  },
  mounted() {
    const {
      from,
      referrer,
      utm_source: utmSource,
      is_popup: isPopup,
    } = this.$route.query;
    if (window.sessionStorage) {
      if (isPopup)
        window.sessionStorage.setItem(
          'civicLikerIsPopup',
          document.referrer || '1'
        );
      if (from) window.sessionStorage.setItem('civicLikerFrom', from);
      if (referrer)
        window.sessionStorage.setItem('civicLikerReferrer', referrer);
      if (utmSource)
        window.sessionStorage.setItem('civicLikerUtmSource', utmSource);
    }
    logTrackerEvent(this, 'Civic', 'CivicPageLoad', 'CivicPageLoad(civic)', 1);
  },
  methods: {
    ...mapActions(['setLocale']),
    onClickActionButton() {
      logTrackerEvent(
        this,
        'Civic',
        'CivicClickRegister',
        `CivicClick${
          this.getUserIsCivicLikerTrial ? 'Upgrade' : 'Register'
        }(civic)`,
        1
      );
      this.$router.push({
        name: `civic-register-${this.selectedPaymentMethod}`,
        query: this.$route.query,
      });
    },
  },
};
</script>

<style lang="scss">
.civic-page {
  &__payment-select {
    select {
      width: 100%;
    }

    &-fake {
      display: flex;
      align-items: center;
      justify-content: space-between;

      min-width: 16rem;

      padding: 0.75rem 1rem;
      border: 1px solid config('colors.gray-9b');
      border-radius: 8px;

      &-label {
        padding: 0 1rem;
      }
    }
  }
}
</style>
