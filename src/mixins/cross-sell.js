import { mapGetters } from 'vuex';

import { CROSS_SELL_PRODUCT_IDS_MAP } from '~/constant';

export default {
  data() {
    return {
      isCrossSellDialogOpen: false,
      crossSellProductIndex: 0,
    };
  },
  computed: {
    ...mapGetters(['getShoppingCartBookProductQuantity']),
    crossSellCollectionId() {
      return this.crossSellProductId?.startsWith('col_')
        ? this.crossSellProductId
        : undefined;
    },
    crossSellClassId() {
      return this.crossSellProductId?.startsWith('likenft')
        ? this.crossSellProductId
        : undefined;
    },
    crossSellProductIds() {
      return (
        CROSS_SELL_PRODUCT_IDS_MAP[this.collectionId || this.classId] || []
      );
    },
    crossSellProductId() {
      return this.crossSellProductIds?.length
        ? this.crossSellProductIds[this.crossSellProductIndex]
        : undefined;
    },
    shouldCrossSell() {
      return (
        this.crossSellProductId &&
        !this.getShoppingCartBookProductQuantity(this.crossSellProductId)
      );
    },
  },
  watch: {
    isCrossSellDialogOpen: {
      handler(open) {
        if (open) {
          this.crossSellProductIndex = Math.floor(
            Math.random() * this.crossSellProductIds.length
          );
        }
      },
      immediate: true,
    },
  },
  methods: {
    closeCrossSellDialog() {
      this.isCrossSellDialogOpen = false;
    },
    openCrossSellDialog() {
      this.isCrossSellDialogOpen = true;
    },
  },
};
