<template>
  <CollapsibleCard
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
        :collected-count="collectedCount"
        :visible-batches-ahead="7"
        @collect="handleClickCollect"
      />
    </template>
  </CollapsibleCard>
</template>
<script>
export default {
  name: 'NFTPageSupplySection',
  props: {
    collectedCount: {
      type: Number,
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
