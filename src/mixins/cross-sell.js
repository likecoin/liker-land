import { mapGetters } from 'vuex';

import {
  CROSS_SELL_PRODUCT_PROBABILITY,
  RECOMMENDATION_GROUPS,
  CROSS_SELL_WHITE_LIST,
  IS_TESTNET,
} from '~/constant';

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
      const matchedGroups = RECOMMENDATION_GROUPS.filter(
        group =>
          group.includes(this.classId) || group.includes(this.collectionId)
      );

      if (matchedGroups.length === 0) {
        return [];
      }

      const randomGroup =
        matchedGroups[Math.floor(Math.random() * matchedGroups.length)];

      return randomGroup.filter(
        id => id !== this.classId && id !== this.collectionId
      );
    },
    crossSellProductId() {
      return this.crossSellProductIds?.length
        ? this.crossSellProductIds[this.crossSellProductIndex]
        : undefined;
    },
    hasCrossSell() {
      return (
        !!this.crossSellProductId &&
        !this.getShoppingCartBookProductQuantity(this.crossSellProductId)
      );
    },
    isCrossSellEnabled() {
      const shouldAttemptCrossSell = IS_TESTNET
        ? true
        : Math.random() < CROSS_SELL_PRODUCT_PROBABILITY;

      const isCrossSellBlocked = !(
        CROSS_SELL_WHITE_LIST.includes(this.classId) ||
        CROSS_SELL_WHITE_LIST.includes(this.collectionId)
      );

      return shouldAttemptCrossSell && !isCrossSellBlocked;
    },
    shouldCrossSell() {
      return this.isCrossSellEnabled && this.hasCrossSell;
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
