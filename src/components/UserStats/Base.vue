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
export default {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    userStats: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    collectedCount() {
      return this.userStats?.collectedClassCount || 0;
    },
    collectedAmount() {
      return this.userStats?.collectedNftValue || 0;
    },
    createdCount() {
      return this.userStats?.createdClassCount || 0;
    },
    createdCollectorCount() {
      return this.userStats?.createdCollectorCount || 0;
    },
  },
};
</script>
