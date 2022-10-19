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

    <template #top>
      <NFTPageOwning
        v-if="hasConnectedWallet"
        :collected-count="userCollectedCount"
      />
    </template>

    <template
      v-if="isCompleted"
      #message
    >
      <Label
        class="text-medium-gray mt-[12px]"
        preset="h6"
        align="center"
        :text="$t(
          hasConnectedWallet
            ? 'tx_modal_status_complete_text_collect'
            : 'tx_modal_status_complete_text_collect_without_wallet'
        )"
      />
    </template>

    <template v-if="isCompleted && !hasConnectedWallet && paymentId">
      <Label
        class="text-like-green mt-[24px]"
        preset="h5"
        align="center"
        :text="$t('tx_modal_status_complete_reference_code')"
      />
      <Label
        class="text-like-green mt-[8px] p-[12px] border-[2px] border-shade-gray rounded-[8px]"
        preset="p5"
        align="center"
        :text="paymentId"
      />
    </template>

    <!-- Button for complete of collecting -->
    <template
      v-if="isCompleted && hasConnectedWallet"
      #button
    >
      <ButtonV2
        preset="secondary"
        :text="$t('nft_details_page_button_share')"
        class="mr-[12px]"
        @click="$emit('handle-share')"
      >
        <template #prepend>
          <IconShare />
        </template>
      </ButtonV2>
      <ButtonV2
        preset="outline"
        :text="$t('nft_details_page_button_portfolio')"
        @click="$emit('go-portfolio')"
      />
    </template>

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
              :class="{ 'rounded-b-[0]': hasConnectedWallet }"
              :title="$t('nft_collect_modal_method_like')"
              type="crypto"
              :is-disabled="isDisabledPayByLIKE"
              :price="formattedNFTPriceInLIKE"
              @click="handleSelectPaymentMethod"
            />
            <i18n
              v-if="hasConnectedWallet"
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
    developerMode() {
      return !!this.$route.query.debug;
    },
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
    isCompleted() {
      return this.uiTxNFTStatus === 'completed';
    },
    isInsufficientLIKE() {
      return this.walletLIKEBalance < this.NFTPrice;
    },
    canPayByLIKE() {
      if (this.developerMode) return true;
      const notSupportedPlatforms = ['keplr-mobile'];
      return !notSupportedPlatforms.includes(this.walletMethodType);
    },
    isDisabledPayByLIKE() {
      return this.hasConnectedWallet
        ? this.isInsufficientLIKE || !this.canPayByLIKE
        : !this.canCollectWithoutWallet;
    },
    paymentId() {
      return this.$route.query.payment_id;
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
    getAddress() {
      if (this.hasConnectedWallet) {
        // Fetch user collected count when wallet change
        this.userCollectedCount = undefined;
        this.fetchUserCollectedCount();
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
    async handleSelectPaymentMethod(method) {
      switch (method) {
        case 'crypto':
          if (!this.getAddress) {
            const isConnected = await this.connectWallet();
            if (!isConnected) return;
          }
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
      this.shareURLPath({
        title: this.NFTName,
        text: this.NFTDescription,
        path: this.nftDetailsPageURL,
      });
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
