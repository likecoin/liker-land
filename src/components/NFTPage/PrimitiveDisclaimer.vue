<template>
  <Label
    class="px-[24px] py-[16px] text-[0.8rem] text-medium-gray border-[2px] border-shade-gray rounded-[24px]"
    preset="p6"
    prepend-class="!flex-shrink-0"
    :text="disclaimerText"
  >
    <template #prepend>
      <img
        class="w-[20px] h-[20px]"
        :src="imageUrl"
      >
    </template>
  </Label>
</template>

<script>
import nftBookImage from '~/assets/images/nft/nft-book.png';
import primitiveNftIcon from '~/assets/images/nft/primitive-nft-icon.svg';

export default {
  name: 'NFTPagePrimitiveDisclaimer',
  props: {
    isPortfolio: {
      type: Boolean,
      default: false,
    },
    isNftBook: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    disclaimerText() {
      if (this.isNftBook) {
        return this.$t('nft_primitive_nft_book');
      }
      if (this.isPortfolio) {
        return this.$t('nft_primitive_disclaimer_portfolio');
      }
      return this.$t('nft_primitive_disclaimer');
    },
    imageUrl() {
      return this.isNftBook ? nftBookImage : primitiveNftIcon;
    },
  },
};
</script>
