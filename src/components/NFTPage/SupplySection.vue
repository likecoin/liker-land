<template>
  <CollapsibleCard
    v-if="!shouldHideSupplySection"
    class="w-full"
    :title="$t('nft_supply_section_title')"
    :is-show-separator="false"
  >
    <template #titleIcon>
      <IconSupply />
    </template>
    <template #content>
      <NFTSupplyTable
        class="laptop:px-[32px]"
        :current-price="currentPrice"
        :sold-count="soldCount"
        :visible-batches-ahead="4"
        @collect="handleClickCollect"
      />
    </template>
  </CollapsibleCard>
</template>
<script>
import { getBatch, getBatchStart, getPrice } from '../../util/writing-nft';

export default {
  name: 'NFTPageSupplySection',
  props: {
    soldCount: {
      type: Number,
      default: 0,
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    // TODO: calculate batch according to batch/current price...
    shouldHideSupplySection() {
      const activeBatch = getBatch(this.soldCount);
      return (
        this.currentPrice &&
        this.currentPrice > getPrice(getBatchStart(activeBatch))
      );
    },
  },
  methods: {
    handleClickCollect() {
      this.$emit('collect');
    },
  },
};
</script>
