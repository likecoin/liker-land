<template>
  <TxModal
    :is-open="isOpen"
    :has-close-button="uiTxNFTStatus === 'completed'"
    :header-text="$t('nft_details_page_title_collect')"
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
  </TxModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import clipboardMixin from '~/mixins/clipboard';

export default {
  mixins: [clipboardMixin],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['getAddress', 'uiTxTargetClassId', 'uiTxNFTStatus']),
  },
  methods: {
    ...mapActions(['uiCloseTxModal']),
    handleShare() {
      this.copyURLPath(
        `nft/class/${this.uiTxTargetClassId}?referrer=${this.getAddress}`
      );
    },
    goToPortfolio() {
      this.$router.push({ name: 'id', params: { id: this.getAddress } });
      this.uiCloseTxModal();
    },
  },
};
</script>
