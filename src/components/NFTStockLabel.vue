<template>
  <span :class="stockLabelClasses">{{ stockLabel }}</span>
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
    isDark: {
      type: Boolean,
      default: true,
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
      return this.$t('nft_in_stock');
    },
    stockLabelClasses() {
      const classes = ['whitespace-nowrap'];
      if (this.isSoldOut || this.isLimitedStock) {
        if (this.isDark) {
          classes.push(
            'inline-block',
            'px-[16px]',
            'py-[4px]',
            'rounded-full',
            'text-[12px]'
          );
        } else {
          classes.push('text-[16px]');
        }
        if (this.isSoldOut) {
          if (this.isDark) {
            classes.push('text-white', 'bg-danger');
          } else {
            classes.push('text-danger');
          }
        } else {
          classes.push('text-danger', 'bg-white');
        }
      } else {
        classes.push('text-[16px]', 'text-like-cyan');
      }
      return classes;
    },
  },
};
</script>
