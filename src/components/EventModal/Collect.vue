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
    <NFTPageOwning />
  </TxModal>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
