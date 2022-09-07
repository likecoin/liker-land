<template>
  <Page />
</template>

<script>
import { TX_STATUS } from '~/constant';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import { getStripeFiatPaymentStatus } from '~/util/api';
import { sleep } from '~/util/misc';

export default {
  layout: 'default',
  mixins: [nftMixin, walletMixin],
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
    userOwnedCount(count) {
      this.uiSetCollectedCount(count);
    },
    getAddress(address) {
      if (address) {
        this.updateUserCollectedCount(this.classId, address);
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
    if (this.getAddress) {
      this.updateUserCollectedCount(this.classId, this.getAddress);
    }
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
            await this.updateUserCollectedCount(this.classId, this.getAddress);
            this.updateNFTOwners();
            this.updateNFTPurchaseInfo();
            this.updateNFTHistory();
          } else if (this.status === 'error') {
            this.uiSetTxError(
              `${result.errorMessage ||
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
