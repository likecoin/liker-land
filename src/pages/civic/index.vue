<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      CivicLikerPageContentV2(
        :referrer="referrer"
        :price="isLikePay ? 15000 : 5"
        :price-currency="isLikePay ? 'LIKE' : 'USD'"
        :is-year-plan="isLikePay"
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
              svg(v-else-if="selectedPaymentMethod === 'likepay'" height="24px" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32')
                g(style='fill: #28646e')
                  path(d='M15 10.3c-.1 0-.4-.1-.5-.3a.8.8 0 010-1.2C17 6.8 18 5 18.2 4.7c.7-1.3 1.8-1.9 3-1.7.5 0 .8.5.7 1 0 .4-.5.7-1 .7-.6-.1-1 .5-1.3.8a20 20 0 01-4 4.6 1 1 0 01-.5.2M.9 24.5c-.3 0-.5 0-.7-.3A.9.9 0 01.3 23c.9-.7 2.6-1.8 3.1-2 .4-.3 1-.1 1.2.3.2.4 0 1-.4 1.1l-2.8 1.9c-.2.2-.3.2-.5.2')
                  path(d='M22.1 16.5c.4.4.8.2 1.1-.1 2.4-2.3 5-6 5.9-7.9.2-.4.6-.6 1-.4.4.2.4 1 0 1.8a30.6 30.6 0 01-5.8 8c-.3.4-.3.8 0 1 .3.3.7.3 1.1-.1 1.6-1.7 2.7-3 3.6-4.2.3-.4.6-.5.9-.5.4.1.4.5.3 1-.2.7-2.3 3.5-3.2 4.5-2.2 2.5-4.6 4-9 6.2a7.7 7.7 0 00-3.4 2.8l-.8 1.5a1 1 0 00.4 1.4l.5.1a1 1 0 001-.6l.7-1.4a6 6 0 012.6-2.3 25.9 25.9 0 0012-10.5c1.3-2 .7-3.9-.5-4.1v-.3c.8-1.4 1.2-2.4 1.4-3.2.2-1.1-.1-2.4-1.6-2.7 0 0-.1-.1 0-.2 0-.4 0-.8.2-1 .3-1.4-.6-2.7-1.7-3-.7 0-1.4 0-2 .5h-.2c-.3-.3-.6-.5-1.1-.5-1 0-1.9.2-2.6 1.6-.4 1-1.1 2.4-3.2 4.7-2 2.1-4.6 4.2-6.3 5.3-.3.2-.7.2-.7-.3l.9-6c.2-2-.9-2.8-2-3-1-.1-2.6.2-3.4 2.4-.5 1.3-1.5 3.5-2.4 7-.6 2.4-.7 5.2-.1 8.5l-.1.6-2.2 3.7A1 1 0 004 28l.5.2a1 1 0 001-.6l1.2-2.5.8-1.9c.1-.3.2-.7 0-1.6-.4-1.5-.5-4.4.2-7 .8-3.3 2.2-7 2.5-7.7.2-.6.6-.8 1-.8.3 0 1 .2.8 1.5l-1 6.1c-.1.5-.2 1.6.7 2 .7.5 1.4.3 2.3-.3 1.8-1.3 5-3.8 7.1-6 2.1-2.4 2.8-3.9 3.4-5.2.2-.6.9-.5 1-.5.3.1.6.4.4 1-.5 1.6-2.4 5.2-6.2 8.6-.4.4-.4.8-.1 1 .2.3.6.4 1 0a25 25 0 007-10c.1-.5.5-.7.8-.6.4 0 .7.5.5 1.2 0 .6-.4 1.5-.9 2.5-1 2.3-3.3 5.4-5.8 8-.3.3-.3.7 0 1M6.7 5.2c.1-.2 0-.3 0-.4L5.2 1.3c0-.3-.3-.3-.5-.2-.2 0-.5.3-1 .7-.4.4-.7.7-.8 1-.1.1-.1.3.1.4l3.2 2h.5M2 6c-.3 0-.4.2-.5.3l.1 1.3.3 1.1c.1.2.3.3.5.2a43.5 43.5 0 003.6-2M25.5 26.5l-.2.3-1 3.6c0 .3.1.4.3.5h1.2c.6 0 1 0 1.2-.2.2 0 .3-.2.2-.5a41 41 0 00-1.7-3.7M27 25.3c-.1.2 0 .3 0 .4l2.7 2.8c.3.2.4.1.6 0l.6-1.1c.3-.5.5-.9.5-1.2 0-.1 0-.3-.3-.4-.5-.2-3.1-.6-3.7-.6l-.4.1')
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
    isLikePay() {
      return this.selectedPaymentMethod === 'likepay';
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
