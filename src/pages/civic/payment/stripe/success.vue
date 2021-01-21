<template>
  <div class="payment-success-page">
    <Spinner class="mx-auto my-96" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

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
  computed: {
    ...mapGetters(['getIsFollowedAuthor']),
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
      const {
        from,
        civic_liker_version: civicVersionQuery,
      } = this.$route.query;
      const civicLikerVersion = civicVersionQuery === '2' ? 2 : 1;
      if (from && !this.getIsFollowedAuthor(from)) {
        this.followAuthor(from);
      }
      this.setUserCivicLiker({ civicLikerVersion });
      // NOTE: Wait for db sync
      setTimeout(async () => {
        const user = await this.fetchLoginStatus();
        if (!user.isSubscribedCivicLiker) {
          this.setUserCivicLiker({ civicLikerVersion });
        }
        if (from) {
          this.$router.push({
            name: 'id',
            params: { id: from },
            query: { civic_welcome: '1' },
          });
        } else {
          this.$router.push({ name: 'settings-civic' });
        }
      }, 2000);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      throw err;
    }
  },
  methods: {
    ...mapActions(['fetchLoginStatus', 'followAuthor', 'setUserCivicLiker']),
  },
};
</script>
