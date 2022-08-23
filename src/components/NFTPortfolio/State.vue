<template>
  <component :is="tag">
    <slot
      :collected-count="collectedCount"
      :collected-amount="collectedAmount"
      :created-count="createdCount"
      :created-collected-count="createdCollectedCount"
    />
  </component>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    collectedItems: {
      type: Array,
      default: () => [],
    },
    createdClassIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(['getNFTClassPurchaseInfoById', 'getNFTClassMintedCount']),
    collectedCount() {
      return this.collectedItems.length;
    },
    collectedAmount() {
      return this.collectedItems.reduce(
        (total, nft) =>
          total + (this.getNFTClassPurchaseInfoById(nft.classId)?.price || 0),
        0
      );
    },
    createdCount() {
      return this.createdClassIds.length;
    },
    createdCollectedCount() {
      return this.createdClassIds.reduce(
        (total, classId) => total + (this.getNFTClassMintedCount(classId) || 0),
        0
      );
    },
  },
};
</script>
