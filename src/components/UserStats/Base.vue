<template>
  <component :is="tag">
    <slot
      :collected-count="collectedCount"
      :collected-amount="collectedAmount"
      :created-count="createdCount"
      :created-collector-count="createdCollectorCount"
    />
  </component>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { formatNumber } from '~/util/ui';

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
    ...mapGetters(['getNFTClassPurchaseInfoById', 'getNFTClassOwnerInfoById']),
    collectedCount() {
      return this.collectedItems.length;
    },
    collectedAmount() {
      const amount = this.collectedItems.reduce(
        (total, nft) =>
          total + (this.getNFTClassPurchaseInfoById(nft.classId)?.price || 0),
        0
      );
      return formatNumber(amount);
    },
    createdCount() {
      return this.createdClassIds.length;
    },
    createdCollectorCount() {
      const ownerSet = new Set();
      this.createdClassIds.forEach(classId => {
        const ownerInfo = this.getNFTClassOwnerInfoById(classId);
        if (ownerInfo) {
          Object.keys(ownerInfo).forEach(owner => ownerSet.add(owner));
        }
      });
      return ownerSet.size;
    },
  },
  watch: {
    collectedItems() {
      this.lazyGetAllCollectedPurchaseInfo();
    },
    createdClassIds() {
      this.lazyGetAllCreatedOwners();
    },
  },
  methods: {
    ...mapActions(['lazyGetNFTPurchaseInfo', 'lazyGetNFTOwners']),
    lazyGetAllCollectedPurchaseInfo() {
      const classIdSet = new Set(this.collectedItems.map(n => n.classId));
      classIdSet.forEach(classId => this.lazyGetNFTPurchaseInfo(classId));
    },
    lazyGetAllCreatedOwners() {
      this.createdClassIds.forEach(classId => this.lazyGetNFTOwners(classId));
    },
  },
};
</script>
