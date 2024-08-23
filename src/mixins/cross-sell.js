import { mapGetters } from 'vuex';

import { CROSS_SELL_PRODUCT_IDS_MAP } from '~/constant';

export default {
  data() {
    return {
      isCrossSellDialogOpen: false,
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
    crossSellProductId() {
      const productIds =
        CROSS_SELL_PRODUCT_IDS_MAP[this.collectionId || this.classId] || [];
      return productIds.length ? productIds[0] : undefined;
    },
    shouldCrossSell() {
      return (
        this.crossSellProductId &&
        !this.getShoppingCartBookProductQuantity(this.crossSellProductId)
      );
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
