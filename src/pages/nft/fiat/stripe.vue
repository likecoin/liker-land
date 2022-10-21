<template>
  <Page />
</template>

<script>
import { TX_STATUS } from '~/constant';

import { getStripeFiatPaymentStatus } from '~/util/api';
import { sleep } from '~/util/misc';
import { logPurchaseFlowEvent, logTrackerEvent } from '~/util/EventLogger';

import nftMixin from '~/mixins/nft';

export default {
  layout: 'default',
  mixins: [nftMixin],
  data() {
    return {
      result: {},
      status: 'new',
    };
  },
  computed: {
    isPolling() {
      return ['new', 'processing'].includes(this.status);
    },
  },
  watch: {
    uiIsOpenCollectModal(isOpen) {
      if (!isOpen) {
        if (this.classId) {
          this.$router.replace({
            name: 'nft-class-classId',
            params: { classId: this.classId },
          });
        } else {
          this.$router.replace('/');
        }
      }
    },
  },
  asyncData({ error, query }) {
    const { class_id: classId, payment_id: paymentId } = query;
    if (!paymentId) {
      error({
        statusCode: 400,
        message: 'MISSING_PAYMENT_ID',
      });
      return undefined;
    }
    if (!classId) {
      error({
        statusCode: 400,
        message: 'MISSING_NFT_CLASS_ID',
      });
      return undefined;
    }
    return {
      classId,
      paymentId,
    };
  },
  mounted() {
    this.uiToggleCollectModal({
      classId: this.classId,
      status: TX_STATUS.PROCESSING,
    });
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
          if (this.status === 'done') {
            this.uiSetTxStatus(TX_STATUS.COMPLETED);
            logTrackerEvent(
              this,
              'NFT',
              'NFTCollectPaymentMethod(Stripe)Completed',
              this.classId,
              1
            );
            logPurchaseFlowEvent(this, 'purchase', {
              txHash: this.result.transactionHash,
              name: this.NFTName,
              price: this.result.fiatPrice,
              currency: 'USD',
              classId: this.classId,
            });
          } else if (this.status === 'error') {
            this.uiSetTxStatus(TX_STATUS.FAILED);
            logTrackerEvent(
              this,
              'NFT',
              'NFTCollectPaymentMethod(Stripe)Error',
              this.classId,
              1
            );
            this.uiSetTxError(
              `${this.result.errorMessage ||
                'STRIPE_PAYMENT_UNKNOWN_ERROR'}, Your payment authorization would be automatically refunded`
            );
          }
        }
        /* eslint-enable no-await-in-loop */
      } while (this.isPolling);
    },
  },
};
</script>
