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
  mixins: [nftMixin],
  layout: 'default',
  asyncData({ error, query }) {
    const {
      class_id: classId,
      payment_id: paymentId,
      claiming_token: claimToken,
    } = query;
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
      claimToken,
    };
  },
  data() {
    return {
      result: {},
      status: 'new',
    };
  },
  computed: {
    isPolling() {
      return ['new', 'processing', 'processing_non_blocking'].includes(
        this.status
      );
    },
    isCompleted() {
      return ['pendingClaim', 'done'].includes(this.status);
    },
  },
  watch: {
    uiIsOpenCollectModal(isOpen) {
      if (isOpen) return;

      if (!this.classId) {
        this.$router.replace(this.localeLocation({ name: 'index' }));
        return;
      }

      if (!this.isCompleted) return;

      if (this.claimToken) {
        this.$router.replace(
          this.localeLocation({
            name: 'nft-claim',
            query: {
              class_id: this.classId,
              payment_id: this.paymentId,
              claiming_token: this.claimToken,
            },
          })
        );
        return;
      }

      this.$router.replace(
        this.localeLocation({
          name: 'nft-class-classId',
          params: { classId: this.classId },
        })
      );
    },
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
          if (this.isCompleted) {
            if (this.claimToken) {
              // NOTE: Close modal to trigger redirect to claim page
              this.uiCloseTxModal();
            } else {
              this.uiSetTxStatus(TX_STATUS.COMPLETED);
            }
            logTrackerEvent(
              this,
              'NFT',
              'NFTCollectPaymentMethod(Stripe)Completed',
              this.classId,
              1
            );
            logPurchaseFlowEvent(this, 'purchase', {
              txHash: this.result.transactionHash,
              items: [
                {
                  name: this.nftName,
                  price: this.result.fiatPrice,
                  classId: this.classId,
                  priceIndex: this.editionPriceIndex,
                },
              ],
              price: this.result.fiatPrice,
              currency: 'USD',
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
