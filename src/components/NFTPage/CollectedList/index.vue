<template>
  <CardV2 class="flex gap-[24px] w-full">
    <div>
      <Label
        class="text-medium-gray text-[12px]"
        preset="h6"
        :text="$t('nft_details_page_label_owning')"
      />
      <div class="mt-[4px] text-[600]">{{ nftCollectorCollectedCount }}</div>
    </div>
    <hr class="w-[2px] bg-shade-gray h-[48px] border-none shrink-0">
    <div class="min-w-0">
      <Label
        class="text-medium-gray text-[12px]"
        preset="h6"
        :text="$t('nft_details_page_label_nft_id')"
      />
      <div class="mt-[4px] flex items-center relative gap-[8px]">
        <select
          v-model="selectedNftId"
          class="absolute opacity-0"
          @change="onSelectNFT"
        >
          <option
            v-for="id in nftCollectorCollectedNFTList"
            :key="id"
            :value="id"
          >{{ id }}</option>
        </select>
        <div class="truncate">{{ selectedNftId }}</div>
        <IconArrowDown class="w-[12px] h-[12px] shrink-0" />
      </div>
    </div>
  </CardV2>
</template>
<script>
export default {
  props: {
    nftCollectorCollectedCount: {
      type: Number,
      default: undefined,
    },
    selectedNftId: {
      type: String,
      default: undefined,
    },
    nftCollectorCollectedNFTList: {
      type: Array,
      default: undefined,
    },
  },
  methods: {
    onSelectNFT() {
      this.$emit('onSelectNFT');
    },
  },
};
</script>
