<template>
  <TxModal
    :is-open="isOpen"
    :has-close-button="isShowCloseButton"
    :header-text="headerText"
    preset="collect"
    @close="$emit('close')"
    @handle-share="handleShare"
    @go-portfolio="goToPortfolio"
  >
    <template #header-prepend>
      <IconPrice />
    </template>
    <div
      v-if="uiTxNFTStatus === 'completed'"
      class="flex flex-col items-center justify-center mb-[12px]"
    >
      <Label
        class="text-like-green font-600"
        preset="h4"
        :text="this.$t('tx_modal_status_complete_title')"
      />
      <Label
        class="text-medium-gray mt-[12px]"
        preset="h6"
        :text="$t('tx_modal_status_complete_text_collect')"
      />
    </div>
    <NFTPageOwning :collected-count="userCollectedCount" />
    <template v-if="!uiTxNFTStatus">
      <section v-if="paymentMethod === undefined">
        <Label
          class="text-like-green"
          preset="h5"
          align="center"
          :text="$t('nft_collect_modal_subtitle_select_collect_method')"
        />
        <ul class="mt-[16px] flex flex-col gap-[16px] mx-auto max-w-[320px] w-full">
          <li>
            <EventModalCollectMethodButton
              class="rounded-b-[0]"
              :title="$t('nft_collect_modal_method_like')"
              type="crypto"
              :is-disabled="isInsufficientLIKE || !canPayByLIKE"
              :price="formattedNFTPriceInLIKE"
              @click="handleSelectPaymentMethod"
            />
            <i18n
              :class="[
                isInsufficientLIKE || !canPayByLIKE
                  ? 'bg-light-gray border-shade-gray'
                  : 'bg-like-cyan-pale border-medium-gray',
                'border-2',
                'border-t-0',
                'rounded-b-[8px]',
                'px-[16px]',
                'py-[4px]',
                isInsufficientLIKE ? 'text-danger' : 'text-like-green',
                'text-[12px]',
                'text-right',
                'font-[600]',
              ]"
              tag="div"
              path="nft_collect_modal_method_like_available_amount"
            >
              <span
                class="font-[400]"
                place="amount"
              >{{ walletLIKEBalance | formatNumberWithLIKE }}</span>
            </i18n>
          </li>
          <li>
            <EventModalCollectMethodButton
              :title="$t('nft_collect_modal_method_stripe')"
              type="stripe"
              :price="formattedNFTPriceInUSD"
              @click="handleSelectPaymentMethod"
            />
          </li>
        </ul>
      </section>
      <section v-else>
        <ProgressIndicator class="mx-auto" />
      </section>
    </template>
  </TxModal>
</template>

<script>
import { mapActions } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';
import { formatNumberWithLIKE } from '~/util/ui';

import clipboardMixin from '~/mixins/clipboard';
import nftMixin from '~/mixins/nft';

export default {
  filters: {
    formatNumberWithLIKE,
  },
  mixins: [clipboardMixin, nftMixin],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      paymentMethod: undefined,
    };
  },
  computed: {
    classId() {
      // Alias for NFT mixin
      return this.uiTxTargetClassId;
    },
    headerText() {
      return this.isShowCloseButton
        ? this.$t('nft_collect_modal_title_collect')
        : this.$t('nft_collect_modal_title_collecting');
    },
    isShowCloseButton() {
      return (
        this.paymentMethod === undefined || this.uiTxNFTStatus === 'completed'
      );
    },
    isInsufficientLIKE() {
      return this.walletLIKEBalance < this.NFTPrice;
    },
    canPayByLIKE() {
      return !['cosmostation-mobile', 'keplr-mobile'].includes(
        this.walletMethodType
      );
    },
  },
  watch: {
    isOpen(isOpen) {
      if (isOpen && this.classId) {
        // Reset state when open modal
        this.resetState();
      }
    },
    classId(nftClassId) {
      if (nftClassId) {
        // Reset state when NFT Class change
        this.resetState();
      }
    },
  },
  mounted() {
    if (this.classId) {
      this.resetState();
    }
  },
  methods: {
    ...mapActions(['uiCloseTxModal']),
    resetState() {
      this.paymentMethod = undefined;

      // Mixin
      this.nftPriceInUSD = undefined;
      this.userCollectedCount = undefined;
      this.fetchNFTPrices(this.classId);
      this.fetchUserCollectedCount();
    },
    handleSelectPaymentMethod(method) {
      switch (method) {
        case 'crypto':
          logTrackerEvent(
            this,
            'NFT',
            'NFTCollectPaymentMethod(LIKE)',
            this.classId,
            1
          );
          this.collectNFTWithLIKE();
          break;
        case 'stripe':
          logTrackerEvent(
            this,
            'NFT',
            'NFTCollectPaymentMethod(Stripe)',
            this.classId,
            1
          );
          this.collectNFTWithStripe();
          break;
        default:
          break;
      }
      this.paymentMethod = method;
    },
    handleShare() {
      this.copyURLPath(this.nftDetailsPageURL);
      logTrackerEvent(
        this,
        'NFT',
        'CopyShareURL(CollectModal)',
        this.classId,
        1
      );
    },
    goToPortfolio() {
      this.$router.push({ name: 'id', params: { id: this.getAddress } });
      this.uiCloseTxModal();
    },
  },
};
</script>
