<template>
  <div
    :class="[
      'flex',
      'justify-center',
      'items-center',
      'w-full',
      'py-[16px] phone:py-[8px]',
      'my-[32px]',
      'border-[2px]',
      'border-shade-gray',
      {'border-like-cyan-darker': uiTxNFTStatus === 'completed'},
      'rounded-[16px]',
    ]"
  >
    <Label
      preset="h5"
      :text="$t('nft_details_page_label_owning')"
      class="text-like-green font-600"
    >
      <template #prepend>
        <LazyIconCreativeWork />
      </template>
      <template #default>
        <div class="flex items-center">
          <Label preset="h5" :text="$t('nft_details_page_label_owning')" />
          <Label
            preset="h4"
            :text="formattedCollectedCount"
            class="font-[900] ml-[20px]"
          />
        </div>
      </template>
    </Label>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    collectedCount: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    ...mapGetters(['uiTxNFTStatus']),
    formattedCollectedCount() {
      return this.collectedCount?.toString() || '-';
    },
  },
};
</script>
