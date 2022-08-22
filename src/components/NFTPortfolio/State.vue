<template>
  <div>
    <slot 
      :collected-n-f-t-count="collectedNFTCount" 
      :collected-n-f-t-total-value="collectedNFTTotalValue"
      :created-n-f-t-class-id-count="createdNFTClassIdCount"
      :created-n-f-t-minted-count="createdNFTMintedCount"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    collectedNFTs: {
      type: Array,
      default: () => [],
    },
    createdNFTClassIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(['getNFTClassPurchaseInfoById', 'getNFTClassMintedCount']),
    collectedNFTCount() {
      return this.collectedNFTs.length;
    },
    collectedNFTTotalValue() {
      return this.collectedNFTs.reduce(
        (total, nft) =>
          total + (this.getNFTClassPurchaseInfoById(nft.classId)?.price || 0),
        0
      );
    },
    createdNFTClassIdCount() {
      return this.createdNFTClassIds.length;
    },
    createdNFTMintedCount() {
      return this.createdNFTClassIds.reduce(
        (total, classId) => total + (this.getNFTClassMintedCount(classId) || 0),
        0
      );
    },
  },
};
</script>
