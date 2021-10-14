<template>
  <div class="payment-page">
    <Spinner class="mx-auto my-96" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getStripePaymentStatusAPI, getStripePaymentAPI } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { STRIPE_SDK_URL } from '~/constant';

import Spinner from '~/components/Spinner/Spinner';

export default {
  middleware: 'authenticated',
  components: {
    Spinner,
  },
  data() {
    return {
      isFetched: false,
      stripe: null,
      from: undefined,
      referrer: undefined,
      error: '',
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserShouldRenewCivic',
      'getUserIsCivicLiker',
      'getUserIsCivicLikerV2',
    ]),
  },
  head() {
    return {
      title: this.$t('CivicPage.title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('CivicPage.Og.Title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CivicPage.Og.Description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('CivicPage.Og.Description'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic.png',
        },
      ],
      link: [
        {
          hid: 'preload:stripe',
          rel: 'preload',
          href: STRIPE_SDK_URL,
          as: 'script',
        },
      ],
      script: [{ hid: 'stripe', src: STRIPE_SDK_URL }],
    };
  },
  mounted() {
    if (this.getUserIsCivicLiker) {
      if (!this.getUserShouldRenewCivic) {
        if (this.getUserIsCivicLikerV2) {
          const { from: id } = this.$route.query;
          this.$router.replace({
            name: 'id',
            params: { id },
            query: { civic_welcome: 1 },
          });
        } else {
          this.$router.replace({ name: 'settings-civic' });
        }
        return;
      }
    }
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
        const { willCancel } = await this.$api.$get(
          getStripePaymentStatusAPI()
        );
        if (willCancel) {
          await this.initPaymentSession();
        } else {
          this.$router.replace({ name: 'settings-civic' });
        }
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
      const {
        from,
        referrer,
        quantity,
        utm_source: utmSource,
        utm_medium: utmMedium,
        civic_liker_version: civicLikerVersion,
      } = this.$route.query;
      const { sessionId } = await this.$api.$get(
        getStripePaymentAPI({
          from,
          referrer,
          utmSource,
          utmMedium,
          civicLikerVersion,
          quantity,
        })
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
