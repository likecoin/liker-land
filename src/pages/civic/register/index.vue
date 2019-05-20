<template>
  <div>
    <div v-if="subscriptionInfo" />
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
      stripe: null,
      from: undefined,
      referrer: undefined,
      error: '',
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
      if (!window.Stripe || !process.env.STRIPE_PUBLIC_KEY) {
        console.error('window stripe is missing!'); // eslint-disable-line no-console
        return;
      }
      const stripe = window.Stripe(process.env.STRIPE_PUBLIC_KEY);
      this.stripe = stripe;
      const { type } = data;
      if (type === 'session') {
        const result = await this.stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (result && result.error) {
          this.error = result.error.message;
        }
      } else if (type === 'subscription') {
        // TODO
      }
    },
  },
};
</script>
