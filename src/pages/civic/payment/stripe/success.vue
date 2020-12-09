<template>
  <div class="payment-success-page">
    <Spinner class="mx-auto my-96" />
  </div>
</template>
<script>
import { logTrackerEvent } from '~/util/EventLogger';

import Spinner from '~/components/Spinner/Spinner';

export default {
  components: {
    Spinner,
  },
  middleware: 'authenticated',
  head() {
    return {
      title: this.$t('PaymentSuccessPage.title'),
    };
  },
  mounted() {
    logTrackerEvent(
      this,
      'Civic',
      'CivicPaymentSuccess',
      'CivicPaymentSuccess(stripe)',
      1
    );
    try {
      logTrackerEvent(
        this,
        'Civic',
        'CivicRegisterComplete',
        'CivicRegisterComplete(stripe)',
        1
      );
      const { from } = this.$route.query;
      if (this.$route.query.from) {
        window.location.href = `/${from}?civic_welcome=1`;
      } else {
        window.location.href = `/settings/civic`;
      }
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      throw err;
    }
  },
};
</script>
