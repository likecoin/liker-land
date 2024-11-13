<template>
  <span v-if="stockLabel" :class="stockLabelClasses">{{ stockLabel }}</span>
</template>

<script>
const LIMITED_STOCK = 10;

export default {
  name: 'NFTStockLabel',
  props: {
    stock: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    isSoldOut() {
      return this.stock <= 0;
    },
    isLimitedStock() {
      return !this.isSoldOut && this.stock <= LIMITED_STOCK;
    },
    stockLabel() {
      if (this.isSoldOut) {
        return this.$t('nft_sold_out');
      }
      if (this.isLimitedStock) {
        return this.$tc('nft_stock_left', this.stock, { stock: this.stock });
      }
      return '';
    },
    stockLabelClasses() {
      const classes = [
        'whitespace-nowrap',
        'px-[8px]',
        'py-[4px]',
        'rounded-[4px]',
        'text-[12px]',
        'font-500',
      ];
      if (this.isLimitedStock) {
        classes.push('text-[#E35050]', 'bg-[#E35050] bg-opacity-[20%]');
      } else if (this.isSoldOut) {
        classes.push('text-white', 'bg-[#E35050]');
      }
      return classes;
    },
  },
};
</script>
