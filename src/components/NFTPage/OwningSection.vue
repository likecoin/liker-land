<template>
  <div
    class="
      w-full
      py-[12px]
      px-[24px]
      mb-[16px]
      rounded-[24px]
      bg-white
      border-[2px] border-like-cyan-dark
    "
  >
    <Label preset="h5" :text="$t('nft_details_page_label_owning')" class="text-like-green font-600">
      <template #prepend>
        <IconCreativeWork />
      </template>
      <template #default>
        <div class="flex items-center">
          <Label preset="h5" :text="$t('nft_details_page_label_owning')" />
          <Label
            v-if="!isSettingAccount && ownedCount !== null"
            preset="h4"
            :text="`${ownedCount}`"
            class="font-[900] ml-[20px]"
          />
          <Label
            v-if="isSettingAccount || ownedCount === null"
            preset="h4"
            text="-"
            class="font-[900] ml-[20px]"
          />
        </div>
      </template>
      <template #append>
        <ToolTips :tool-tip-text="$t('tooltip_comming_soon')">
          <ButtonV2
            preset="secondary"
            class="-z-1"
            size="mini"
            :text="$t('nft_details_page_button_transfer')"
            :is-disabled="isTransferDisabled"
            @click="onTransfer"
          />
        </ToolTips>
      </template>
    </Label>
  </div>
</template>

<script>
export default {
  name: 'OwningSection',
  props: {
    isSettingAccount: {
      type: Boolean,
      default: false,
    },
    ownedCount: {
      type: Number,
      default: null,
    },
    isTransferDisabled: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onTransfer() {
      this.$emit('transfer');
    },
  },
};
</script>
