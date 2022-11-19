<template>
  <Label
    class="px-[24px] py-[16px] text-[0.8rem] text-medium-gray border-[2px] border-shade-gray rounded-[24px]"
    preset="p6"
    prepend-class="!flex-shrink-0"
    :text="$t(
      isPortfolio
        ? 'nft_primitive_disclaimer_portfolio'
        : 'nft_primitive_disclaimer'
    )"
  >
    <template #prepend>
      <img class="w-[20px] h-[20px]" src="~assets/images/nft/primitive-nft-icon.svg">
    </template>
  </Label>
</template>

<script>
export default {
  name: 'NFTPagePrimitiveDisclamer',
  props: {
    isPortfolio: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
