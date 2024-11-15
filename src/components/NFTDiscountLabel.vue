<template>
  <span
    v-if="discountInfo"
    :class="[
      'whitespace-nowrap',
      'px-[8px]',
      'py-[2px]',
      'rounded-[4px]',
      'text-[12px]',
      'font-500',
      'bg-[#AAF1E7]',
      'text-like-green',
    ]"
    v-text="discountPercentage"
  />
</template>

<script>
export default {
  name: 'NFTDiscountLabel',
  props: {
    discountInfo: {
      type: Object,
      default: null,
    },
  },
  computed: {
    discountPercentage() {
      return this.$t('nft_edition_select_discount_label', {
        percentage: this.discountInfo?.discountPercentage,
      });
    },
  },
};
</script>
