<template>
  <TxModal
    :is-open="isOpen"
    :has-close-button="isShowCloseButton"
    :header-text="headerText"
    preset="collect"
    @close="handleClose"
  >
    <template #header-prepend>
      <IconPrice />
    </template>

    <template #top>
      <NFTPageOwning
        v-if="hasConnectedWallet"
        class="mb-[10px]"
        :collected-count="userCollectedCount"
      />
    </template>

    <template
      v-if="isCompleted"
      #message
    >
      <client-only>
        <model-viewer
          v-if="nftModelURL"
          :alt="nftClassCollectionName"
          :src="nftModelURL"
          class="mt-[12px]"
          auto-rotate
          auto-rotate-delay="500"
          xr-environment
          shadow-intensity="1"
          camera-controls
          camera-orbit="225deg 55deg 100m"
          @click.once="onClickModelViewer"
        />
      </client-only>
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
        :text="$t('nft_details_page_button_view_details')"
        class="mr-[12px]"
        @click="goToNFTDetails"
      />
      <ButtonV2
        preset="outline"
        :text="$t('nft_details_page_button_portfolio')"
        @click="goToPortfolio"
      />
    </template>

    <template v-if="!uiTxNFTStatus">
      <div class="flex flex-col items-start mb-[28px]">
        <Separator class="h-[2px] bg-shade-gray self-center" />
        <Label
          preset="p6"
          align="left"
          class="text-medium-gray mt-[12px] mb-[6px]"
          :text="$t('nft_collect_modal_leave_message')"
        />
        <div class="flex w-full py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]">
          <IconMessage class="text-dark-gray" />
          <input
            id="name"
            ref="input"
            type="input"
            class="w-full bg-transparent border-0 focus-visible:outline-none"
            :placeholder="$t('nft_collect_modal_leave_message_to_name', { name: creatorDisplayName })"
            name="name"
            @input="onInputCollectMessage"
          >
        </div>
      </div>
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
            <div
              v-if="hasConnectedWallet"
              :class="[
                'flex',
                'justify-end',
                'items-center',
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
            >
              <i18n path="nft_collect_modal_method_like_available_amount">
                <span
                  v-if="!walletLIKEBalanceFetchPromise"
                  class="font-[400]"
                  place="amount"
                >
                  {{ walletLIKEBalance | formatNumberWithLIKE }}
                </span>
              </i18n>
              <ProgressIndicator
                v-if="walletLIKEBalanceFetchPromise"
                class="ml-[8px] w-[48px] h-[16px]"
              />
            </div>
          </li>
          <li>
            <EventModalCollectMethodButton
              :title="$t('nft_collect_modal_method_stripe')"
              type="stripe"
              :is-disabled="!canPayByFiat"
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
  head() {
    return {
      link: [
        {
          rel: 'modulepreload',
          href:
            'https://unpkg.com/@google/model-viewer@3.0.2/dist/model-viewer.min.js',
          as: 'script',
        },
        {
          rel: 'prefetch',
          crossorigin: 'anonymous',
          href: this.nftModelURL,
        },
      ],
      script: [
        {
          type: 'module',
          src:
            'https://unpkg.com/@google/model-viewer@3.0.2/dist/model-viewer.min.js',
          asyc: 'true',
        },
      ],
    };
  },
  data() {
    return {
      paymentMethod: undefined,
      justCollectedNFTId: undefined,
      shouldShowMessageInput: false,
      memo: '',
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
    canPayByFiat() {
      return this.formattedNFTPriceInUSD && this.formattedNFTPriceInUSD !== '-';
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
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.iscnOwner)?.displayName || 'creator'
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
      this.justCollectedNFTId = undefined;
      this.memo = '';

      // Mixin
      this.nftPriceInUSD = undefined;
      this.userCollectedCount = undefined;
      this.fetchNFTPrices(this.classId);
      this.fetchUserCollectedCount();
    },
    async handleSelectPaymentMethod(method) {
      this.paymentMethod = method;
      if (this.memo) {
        logTrackerEvent(this, 'NFT', 'NFTCollectorMessage', this.classId, 1);
      }
      switch (method) {
        case 'crypto': {
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
          const result = await this.collectNFTWithLIKE({ memo: this.memo });
          if (result) {
            this.justCollectedNFTId = result.nftId;
          }
          break;
        }
        case 'stripe':
          logTrackerEvent(
            this,
            'NFT',
            'NFTCollectPaymentMethod(Stripe)',
            this.classId,
            1
          );
          await this.collectNFTWithStripe({ memo: this.memo });
          break;
        default:
          break;
      }
    },
    goToNFTDetails() {
      this.$router.push(
        this.localeLocation({
          name: 'nft-class-classId-nftId',
          params: { classId: this.classId, nftId: this.justCollectedNFTId },
        })
      );
      this.uiCloseTxModal();
    },
    goToPortfolio() {
      this.$router.push(
        this.localeLocation({
          name: 'id',
          params: { id: this.getAddress },
          query: { tab: 'collected' },
        })
      );
      this.uiCloseTxModal();
    },
    onClickModelViewer() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collect_modal_click_model_viewer',
        this.classId,
        1
      );
    },
    handleClose() {
      this.$emit('close');
      this.shouldShowMessageInput = false;
    },
    handleShowInput() {
      this.shouldShowMessageInput = true;
    },
    onInputCollectMessage(e) {
      this.memo = e.target.value;
    },
  },
};
</script>
