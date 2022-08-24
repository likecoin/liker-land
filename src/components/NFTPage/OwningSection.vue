<template>
  <div
    class="
      w-full
      py-[12px]
      px-[24px]
      rounded-[24px]
      bg-white
      border-[2px] border-like-cyan-light
    "
  >
    <Label preset="h5" :text="$t('nft_details_page_label_owning')" class="text-like-green font-600">
      <template #prepend>
        <IconCreativeWork />
      </template>
      <template #default>
        <ProgressIndicator v-if="isLoading" preset="thin" />
        <div v-else class="flex items-center">
          <Label preset="h5" :text="$t('nft_details_page_label_owning')" />
          <Label
            v-if="isLogIn && ownedCount !== null"
            preset="h4"
            :text="`${ownedCount}`"
            class="font-[900] ml-[20px]"
          />
          <Label
            v-if="!isLogIn || ownedCount === null"
            preset="h4"
            text="-"
            class="font-[900] ml-[20px]"
          />
        </div>
      </template>
      <template #append>
        <ProgressIndicator v-if="isTransferring" />
        <ToolTips v-else :show-tool-tip="isTransferDisabled" :tool-tip-text="getToolTipsText">
          <ButtonV2
            preset="secondary"
            class="-z-1"
            size="mini"
            :text="$t('nft_details_page_button_transfer')"
            :is-disabled="isTransferDisabled"
            @click="onOpen"
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
    isLogIn: {
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
    isLoading: {
      type: Boolean,
      default: false,
    },
    isTransferring: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getToolTipsText() {
      if (this.isLogIn && !this.ownedCount) {
        return this.$t('tooltip_no_nft');
      }
      if (!this.isLogIn) {
        return this.$t('tooltip_signin');
      }
      return undefined;
    },
  },
  methods: {
    onOpen() {
      this.$emit('openTransfer');
    },
  },
};
</script>
