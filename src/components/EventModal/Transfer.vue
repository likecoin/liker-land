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
    <template #top>
      <NFTPageOwning v-if="!nftId" :collected-count="userCollectedCount" />
      <div v-else class="flex-col justify-center p-[16px] my-[24px] border-[2px] border-shade-gray rounded-[16px]">
        <div class="text-[10px] text-medium-gray">{{ $t('tx_modal_label_nft_id') }}</div>
        <Label
          preset="h5"
          class="text-like-green font-600"
          content-class="min-w-0"
        ><div class="truncate">{{ selectedNFTId }}</div></Label>
      </div>
    </template>
    <template v-if="!isTransferring">
      <template v-if="userCollectedNftIds && userCollectedNftIds.length">
        <Label
          preset="p6"
          class="text-medium-gray"
          :text="$t('nft_details_page_label_transfer_nft_id_select')"
        />
        <div class="flex items-center gap-[8px] mb-[24px] mt-[4px]">
          <div class="flex items-center gap-[8px] relative overflow-hidden">
            <select
              v-model="selectedNFTId"
              class="absolute opacity-0"
            >
              <option
                v-for="id in userCollectedNftIds"
                :key="id"
                :value="id"
              >{{ id }}</option>
            </select>
            <div class="truncate">{{ selectedNFTId }}</div>
            <IconArrowDown class="w-[12px] h-[12px] shrink-0" />
          </div>
          <ButtonV2
            class="shrink-0"
            preset="outline"
            :text="$t('nft_details_page_button_view_details')"
            :to="{
              name: 'nft-class-classId-nftId',
              params: { classId, nftId: selectedNFTId }
            }"
            size="mini"
            target="_blank"
            rel="noopener"
          />
        </div>
      </template>
      <Label
        preset="p6"
        class="text-medium-gray"
        :text="$t('nft_details_page_label_transfer')"
      />
      <TextField
        class="mt-[4px]"
        :placeholder="$t('nft_details_page_placeholder_transfer')"
        :error-message="errorMsg"
        @input="(value) => $emit('handle-input-addr', value)"
      />
    </template>
    <div
      v-else
      key="transferring"
      class="
        flex
        flex-col
        justify-center
        w-full
        mt-[24px]
        mb-[12px]
        border-0 border-dashed border-b-[2px] border-b-shade-gray
      "
    >
      <FormField class="mx-[8px]" :label="$t('tx_modal_label_nft_id')">{{
        selectedNFTId
      }}</FormField>
      <FormField class="mx-[8px]" :label="$t('tx_modal_label_receiver')">{{
        toAddress
      }}</FormField>
    </div>
    <template
      v-if="!isTransferring"
      #button
    >
      <ButtonV2
        preset="secondary"
        :is-disabled="!isReadyToTransfer"
        :text="$t('nft_details_page_button_transfer')"
        @click="handleClickTransfer"
      />
    </template>
  </TxModal>
</template>

<script>
export default {
  props: {
    classId: {
      type: String,
      default: undefined,
    },
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
    userCollectedCount: {
      type: Number,
      default: undefined,
    },
    userCollectedNftIds: {
      type: Array,
      default: () => [],
    },
    nftId: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      selectedNFTId: this.userCollectedNftIds[0] || this.nftId,
    };
  },
  watch: {
    userCollectedNftIds(ids) {
      [this.selectedNFTId] = ids;
    },
    nftId(id) {
      this.selectedNFTId = id;
    },
  },
  methods: {
    handleClickTransfer() {
      this.$emit('on-transfer', this.selectedNFTId);
    },
  },
};
</script>
