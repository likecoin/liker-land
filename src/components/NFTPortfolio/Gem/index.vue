<template>
  <div class="relative flex items-center justify-center mx-auto">
    <NFTPortfolioGemType :active-batch="activeBatch" />
    <div :class="gemLineClasses" />
  </div>
</template>



<script>
export default {
  props: {
    activeBatch: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    gemLineClasses() {
      return [
        'absolute',
        'top-[50%]',
        'translate-y-[-50%]',
        'w-full',
        'h-[3px]',
        'z-[-1]',
        'bg-gradient-to-r',
        'from-transparent',
        'to-transparent',
      ].concat(this.gemColor);
    },
    gemColor() {
      switch (true) {
        case this.activeBatch <= 3:
          return ['hidden'];

        case this.activeBatch <= 5:
          return ['via-[#D0D0D0]'];

        case this.activeBatch <= 7:
          return ['via-[#50E3C2]'];

        case this.activeBatch <= 9:
          return ['via-[#6CCAFF]'];

        case this.activeBatch <= 11:
          return ['via-[#FDAFFF]'];

        case this.activeBatch <= 13:
          return ['via-[#FFD748]'];

        case this.activeBatch <= 16:
          return ['via-[#FF6464]'];

        case this.activeBatch >= 17:
          return ['via-[#C0E1FF]'];

        default:
          return undefined;
      }
    },
  },
};
</script>
