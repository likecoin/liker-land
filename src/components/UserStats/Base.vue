<template>
  <component :is="tag">
    <slot
      :collected-count="collectedCount"
      :collected-amount="collectedAmount"
      :created-count="createdCount"
      :created-collector-count="createdCollectorCount"
      :is-loading-stats="isLoadingStats"
    />
  </component>
</template>
<script>
import portfolio from '~/mixins/portfolio';

export default {
  mixins: [portfolio],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    statWallet: {
      type: String,
      default: '',
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
    isLoadingStats() {
      return this.userStats === null;
    },
  },
  mounted() {
    this.updateUserStats(this.statWallet);
  },
};
</script>
