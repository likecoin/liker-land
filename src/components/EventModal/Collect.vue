<template>
  <TxModal
    :is-open="isOpen"
    :has-close-button="false"
    :header-text="$t('nft_details_page_title_collect')"
    :complete-text="$t('tx_modal_status_complete_text_collect')"
    @close="$emit('close')"
  >
    <template #header-prepend>
      <IconPrice />
    </template>
    <NFTPageOwning
      :class="[{ '!border-like-green': uiTxNFTStatus === 'complete' }]"
    />
    <NFTPortfolioBase
      class="!w-full !border-shade-gray !cursor-default mt-[-24px]"
      preset="viewOnly"
      :class-id="uiTargetClassId"
    />
  </TxModal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['uiTargetClassId', 'uiTxNFTStatus']),
  },
};
</script>
