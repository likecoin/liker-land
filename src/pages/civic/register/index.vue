<template>
  <div>
    <LcLoadingIndicator v-if="!isFetched" class="mx-auto" />
    <!-- Used to display form errors. -->
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import { getStripePaymentStatusAPI, getStripePaymentAPI } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';

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
    logTrackerEvent(
      this,
      'Civic',
      'CivicRegisterPageLoad',
      'CivicRegisterPageLoad(civic)',
      1
    );
    this.isFetched = false;
    if (window.sessionStorage) {
      this.from = window.sessionStorage.getItem('civicLikerFrom');
      this.referrer = window.sessionStorage.getItem('civicLikerReferrer');
    }
    this.checkStripeSubscription();
  },
  methods: {
    async checkStripeSubscription() {
      try {
        await this.$axios.$get(getStripePaymentStatusAPI());
        this.$router.replace({ name: 'settings-civic' });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          await this.initPaymentSession();
        } else {
          console.error(err); // eslint-disable-line no-console
          this.$nuxt.error(err);
        }
      } finally {
        this.isFetched = true;
      }
    },
    async initPaymentSession() {
      const { from, referrer, utm_source: utmSource } = this.$route.query;
      const { sessionId } = await this.$axios.$get(
        getStripePaymentAPI({ from, referrer, utmSource })
      );
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
