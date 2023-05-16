<template>
  <component :is="tag">
    <slot
      :collected-count="collectedCount"
      :collected-amount="collectedAmount"
      :created-count="createdCount"
      :created-collector-count="createdCollectorCount"
      :created-total-sales="createdTotalSales"
      :stakeholder-income="stakeholderIncome"
      :is-loading-stats="isLoadingStats"
    />
  </component>
</template>
<script>
import portfolio from '~/mixins/portfolio';
import { getUserNFTStats, getStakeholderIncome } from '~/util/api';
import { formatNumber } from '~/util/ui';

const nanolike = 0.000000001;

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
      stakeholderDetails: null,
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
    stakeholderIncome() {
      return formatNumber(
        Math.floor(this.stakeholderDetails?.total_amount * nanolike) || 0
      );
    },
    isLoadingStats() {
      return !this.userStats;
    },
  },
  watch: {
    statWallet(statWallet) {
      if (statWallet) {
        this.updateUserStats(statWallet);
        this.fetchStakeholderIncome(statWallet);
      } else {
        this.userStats = null;
      }
    },
  },
  mounted() {
    this.updateUserStats(this.statWallet);
    this.fetchStakeholderIncome(this.statWallet);
  },
  methods: {
    async updateUserStats(address) {
      const { data } = await this.$api.get(getUserNFTStats(address));
      this.userStats = data;
    },
    async fetchStakeholderIncome(address) {
      const { data } = await this.$api.get(getStakeholderIncome(address));
      this.stakeholderDetails = data;
    },
  },
};
</script>
