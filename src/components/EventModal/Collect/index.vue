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
    <NFTPageOwning />
    <section v-if="uiCollectMethodCallback">
      <Label
        class="text-like-green"
        preset="h5"
        align="center"
        :text="$t('nft_collect_modal_subtitle_select_collect_method')"
      />
      <ul class="mt-[16px] flex flex-col gap-[16px]">
        <li>
          <EventModalCollectMethodButton
            :title="$t('nft_collect_modal_method_crypto')"
            :description="$t('nft_collect_modal_method_crypto_description')"
            type="crypto"
            :price="formattedLIKEPrice"
            @click="uiCollectMethodCallback"
          />
        </li>
        <li>
          <EventModalCollectMethodButton
            :title="$t('nft_collect_modal_method_stripe')"
            :description="$t('nft_collect_modal_method_stripe_description')"
            type="stripe"
            :price="formattedFiatPrice"
            @click="uiCollectMethodCallback"
          />
        </li>
      </ul>
    </section>
  </TxModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getStripeFiatPrice } from '~/util/api';

import clipboardMixin from '~/mixins/clipboard';

export default {
  mixins: [clipboardMixin],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      LIKEPrice: undefined,
      fiatPrice: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'getAddress',
      'uiTxTargetClassId',
      'uiTxNFTStatus',
      'uiCollectMethodCallback',
    ]),
    headerText() {
      return this.uiCollectMethodCallback
        ? this.$t('nft_collect_modal_title_collect')
        : this.$t('nft_collect_modal_title_collecting');
    },
    isShowCloseButton() {
      return (
        !!this.uiCollectMethodCallback || this.uiTxNFTStatus === 'completed'
      );
    },
    formattedLIKEPrice() {
      return this.LIKEPrice !== undefined
        ? `${this.LIKEPrice.toLocaleString('en')} LIKE`
        : '-';
    },
    formattedFiatPrice() {
      return this.fiatPrice !== undefined
        ? `${this.fiatPrice.toLocaleString('en')} USD`
        : '-';
    },
  },
  watch: {
    uiTxTargetClassId(nftClassId) {
      if (nftClassId) {
        this.fetchItemPrices();
      }
    },
  },
  mounted() {
    if (this.uiTxTargetClassId) {
      this.fetchItemPrices();
    }
  },
  methods: {
    ...mapActions(['uiCloseTxModal']),
    async fetchItemPrices() {
      try {
        const { LIKEPrice, fiatPrice } = await this.$axios.$get(
          getStripeFiatPrice({ classId: this.uiTxTargetClassId })
        );
        this.LIKEPrice = LIKEPrice;
        this.fiatPrice = fiatPrice;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    handleShare() {
      this.copyURLPath(
        `/nft/class/${this.uiTxTargetClassId}?referrer=${this.getAddress}`
      );
    },
    goToPortfolio() {
      this.$router.push({ name: 'id', params: { id: this.getAddress } });
      this.uiCloseTxModal();
    },
  },
};
</script>
