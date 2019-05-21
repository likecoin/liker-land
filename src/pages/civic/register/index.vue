<template>
  <div>
    <LcLoadingIndicator v-if="!isFetched" class="mx-auto" />
    <div v-if="subscriptionInfo">
      <div v-for="key in Object.keys(subscriptionInfo)" :key="key">
        <span>{{ key }}: </span><span>{{ subscriptionInfo[key] }}</span>
      </div>
    </div>
    <!-- Used to display form errors. -->
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import { getStripePaymentAPI } from '~/util/api';

export default {
  middleware: 'authenticated',
  layout: 'dialog',
  data() {
    return {
      isFetched: false,
      stripe: null,
      from: undefined,
      referrer: undefined,
      error: '',
      subscriptionInfo: null,
    };
  },
  head() {
    return {
      title: this.$t('CivicPage.title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CivicPage.slogan'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('CivicPage.slogan'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic.png',
        },
      ],
      link: [
        { rel: 'preload', href: 'https://js.stripe.com/v3', as: 'script' },
      ],
      script: [{ src: 'https://js.stripe.com/v3' }],
    };
  },
  mounted() {
    this.isFetched = false;
    if (window.sessionStorage) {
      this.from = window.sessionStorage.getItem('civicLikerFrom');
      this.referrer = window.sessionStorage.getItem('civicLikerReferrer');
    }
    this.initStripe();
  },
  methods: {
    async initStripe() {
      const { from, referrer } = this.$route.query;
      const data = await this.$axios.$get(
        getStripePaymentAPI({ from, referrer })
      );
      this.isFetched = true;
      const { type } = data;
      if (type === 'session') {
        await this.initPaymentSession(data.sessionId);
      } else if (type === 'subscription') {
        const {
          status,
          willCancel,
          currentPeriodEnd,
          currentPeriodStart,
          start,
          card: { brand, last4 },
        } = data;
        this.subscriptionInfo = {
          willCancel,
          status,
          currentPeriodEnd,
          currentPeriodStart,
          start,
          card: { brand, last4 },
        };
      }
    },
    async initPaymentSession(sessionId) {
      if (!window.Stripe || !process.env.STRIPE_PUBLIC_KEY) {
        console.error('window stripe is missing!'); // eslint-disable-line no-console
        return;
      }
      const stripe = window.Stripe(process.env.STRIPE_PUBLIC_KEY);
      this.stripe = stripe;
      const result = await this.stripe.redirectToCheckout({
        sessionId,
      });
      if (result && result.error) {
        this.error = result.error.message;
      }
    },
  },
};
</script>
