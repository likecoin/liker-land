<template>
  <TxModal
    :is-open="isOpen"
    :has-close-button="!isTransferring"
    :header-text="$t('nft_details_page_title_transfer')"
    :complete-text="$t('tx_modal_status_complete_text_transfer')"
    @close="$emit('close')"
  >
    <template #header-prepend>
      <IconTransfer />
    </template>
    <div>
      <NFTPageOwning />
      <div v-if="!isTransferring">
        <Label
          preset="p6"
          class="text-medium-gray"
          :text="$t('nft_details_page_label_transfer')"
        />
        <TextField
          :placeholder="$t('nft_details_page_placeholder_transfer')"
          :error-message="errorMsg"
          @input="(value) => $emit('handle-input-addr', value)"
        />
        <div class="flex justify-center mt-[24px]">
          <ButtonV2
            preset="secondary"
            :is-disabled="!isReadyToTransfer"
            :text="$t('nft_details_page_button_transfer')"
            @click="$emit('on-transfer')"
          />
        </div>
      </div>
      <div
        v-else
        class="
          flex
          justify-center
          w-ful
          mb-[12px]
          border-0 border-dashed border-b-[2px] border-b-shade-gray
        "
      >
        <FormField :label="$t('tx_modal_label_send')">{{
          toAddress
        }}</FormField>
      </div>
    </div>
  </TxModal>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    isTransferring: {
      type: Boolean,
      default: false,
    },
    isReadyToTransfer: {
      type: Boolean,
      default: false,
    },
    errorMsg: {
      type: String,
      default: undefined,
    },
    toAddress: {
      type: String,
      default: undefined,
    },
  },
};
</script>
