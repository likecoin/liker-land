<template>
  <component :is="tag">
    <slot
      :collected-count="collectedCount"
      :collected-amount="collectedAmount"
      :created-count="createdCount"
      :created-collector-count="createdCollectorCount"
      :created-total-sales="createdTotalSales"
      :is-loading-stats="isLoadingStats"
    />
  </component>
</template>
<script>
import portfolio from '~/mixins/portfolio';
import { getUserNFTStats } from '~/util/api';
import { formatNumber } from '~/util/ui';

export default {
  mixins: [portfolio],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    statWallet: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      userStats: null,
    };
  },
  computed: {
    collectedCount() {
      return this.userStats?.collectedClassCount || 0;
    },
    collectedAmount() {
      return formatNumber(this.userStats?.collectedValue || 0);
    },
    createdCount() {
      return this.userStats?.createdClassCount || 0;
    },
    createdCollectorCount() {
      return this.userStats?.createdCollectorCount || 0;
    },
    createdTotalSales() {
      return formatNumber(Math.floor(this.userStats?.createdTotalSales) || 0);
    },
    isLoadingStats() {
      return !this.userStats;
    },
  },
  watch: {
    statWallet(statWallet) {
      if (statWallet) {
        this.updateUserStats(statWallet);
      } else {
        this.userStats = null;
      }
    },
  },
  mounted() {
    this.updateUserStats(this.statWallet);
  },
  methods: {
    async updateUserStats(address) {
      const { data } = await this.$api.get(getUserNFTStats(address));
      this.userStats = data;
    },
  },
};
</script>
