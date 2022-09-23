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

export default {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    collectedClassIds: {
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
      return this.collectedClassIds.length;
    },
    collectedAmount() {
      return this.collectedClassIds.reduce(
        (total, id) =>
          total + (this.getNFTClassPurchaseInfoById(id)?.price || 0),
        0
      );
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
    collectedClassIds() {
      this.lazyGetAllCollectedPurchaseInfo();
    },
    createdClassIds() {
      this.lazyGetAllCreatedOwners();
    },
  },
  methods: {
    ...mapActions(['lazyGetNFTPurchaseInfo', 'lazyGetNFTOwners']),
    lazyGetAllCollectedPurchaseInfo() {
      const classIdSet = new Set(this.collectedClassIds);
      classIdSet.forEach(classId => this.lazyGetNFTPurchaseInfo(classId));
    },
    lazyGetAllCreatedOwners() {
      this.createdClassIds.forEach(classId => this.lazyGetNFTOwners(classId));
    },
  },
};
</script>
