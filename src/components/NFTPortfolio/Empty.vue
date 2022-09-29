<template>
  <NFTPortfolioCard
    class="!bg-shade-gray"
  >
    <div class="p-[8px] w-full h-[140px]">
      <div
        class="z-[5] h-full w-full bg-repeat-space"
        :style="{
          backgroundImage: `url(/images/NFT/background_cross.png)`,
        }"
      />
    </div>
    <div class="w-full pb-[32px] bg-shade-gray border-t-[1px] border-white">
      <div class="flex flex-col justify-center items-center mt-[-21px]">
        <div class="w-[42px] h-[42px] rounded-[50%] bg-shade-gray border-[2px] border-white" />
        <Label
          class="text-medium-gray mt-[12px]"
          :text="preset === 'collected'
            ? $t('portfolio_collected_tab_no_item')
            : $t('portfolio_created_tab_no_item')"
        />
      </div>
    </div>
  </NFTPortfolioCard>
</template>
<script>
export default {
  props: {
    // The preset of empty card, option: collected and created
    preset: {
      type: String,
      default: 'collected',
    },
  },
};
</script>
