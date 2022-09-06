<template>
  <Page>
    <div v-if="status === 'error'" class="my-48">
      Purchase Error: {{ result.errorMessage || 'UNKNOWN' }}
      Please <nuxt-link :to="classIdRoute">go back</nuxt-link> and retry
    </div>
    <div v-else-if="isPolling" class="my-48">
      <div v-if="status === 'new'">Waiting for receive payment info</div>
      <div v-else-if="status === 'processing'">Processing...</div>
      <LcLoadingIndicator class="text-like-cyan mx-auto" />
    </div>
    <div v-else-if="status === 'done'" class="my-48">
      <h2>Purchase completed.</h2>
      <p>You have collected this NFT using USD{{ result.fiatPriceString }}</p>
      <p>View <nuxt-link :to="walletRoute">Your portfolio</nuxt-link> or go to <nuxt-link :to="classIdRoute">NFT page</nuxt-link></p>
    </div>
    <div v-else class="my-48">
      Unknown Status
    </div>
  </Page>
</template>

<script>
import walletMixin from '~/mixins/wallet';
import { getStripeFiatPaymentStatus } from '~/util/api';
import { sleep } from '~/util/misc';

export default {
  layout: 'default',
  mixins: [walletMixin],
  data() {
    return {
      classId: this.$route.query.class_id,
      paymentId: this.$route.query.payment_id,
      result: {},
      status: 'new',
    };
  },
  computed: {
    isPolling() {
      return ['new', 'processing'].includes(this.status);
    },
    walletRoute() {
      return {
        name: 'id',
        params: { id: this.result.wallet || this.getAddress },
      };
    },
    classIdRoute() {
      return {
        name: 'nft-class-classId',
        params: { classId: this.classId },
      };
    },
  },
  mounted() {
    if (!this.paymentId) {
      this.$nuxt.error({
        statusCode: 400,
        message: 'MISSING_PAYMENT_ID',
      });
    }
    this.pollForStatusUpdate();
  },
  methods: {
    async pollForStatusUpdate() {
      do {
        /* eslint-disable no-await-in-loop */
        const res = await this.$axios.$get(
          getStripeFiatPaymentStatus({ paymentId: this.paymentId })
        );
        const { status } = res;
        this.status = status;
        if (this.isPolling) {
          await sleep(3000);
        } else {
          this.result = res;
        }
        /* eslint-enable no-await-in-loop */
      } while (this.isPolling);
    },
  },
};
</script>
