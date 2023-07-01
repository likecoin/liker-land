<template>
  <CollapsibleCard
    class="w-full"
    :title="$t('nft_supply_section_title')"
    :is-show-separator="false"
  >
    <template #titleIcon>
      <LazyIconSupply />
    </template>
    <template #content>
      <NFTSupplyTable
        class="laptop:px-[32px]"
        :base-price="basePrice"
        :sold-count="soldCount"
        :visible-batches-ahead="4"
        @collect="handleClickCollect"
      />
    </template>
  </CollapsibleCard>
</template>
<script>
export default {
  name: 'NFTPageSupplySection',
  props: {
    soldCount: {
      type: Number,
      default: 0,
    },
    basePrice: {
      type: Number,
      // NOTE: Let SupplyTable handle default value
      default: undefined,
    },
  },
  methods: {
    handleClickCollect() {
      this.$emit('collect');
    },
  },
};
</script>
