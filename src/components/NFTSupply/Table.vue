<template>
  <div
    v-if="!shouldHideTable"
    :class="[
      'overflow-y-hidden',
      shouldCollapseInMobile ? 'laptop:border-y-[2px]' : 'border-y-[2px]',
      'border-shade-gray',
      {
        'pointer-events-none': isDisabled,
        'laptop:border-b-0': shouldHideLowerBound,
      },
    ]"
  >
    <table
      :class="[
        'w-full',
        shouldCollapseInMobile ? 'laptop:-my-[21px]' : '-my-[21px]',
        {
          'laptop:mb-[0]': shouldHideLowerBound
        },
      ]"
    >
      <NFTSupplyRow
        v-for="(d, n) in data"
        :key="n"
        v-bind="d"
        :should-collapse-in-mobile="shouldCollapseInMobile"
        :should-show-indicator="shouldShowIndicator"
        :is-disabled="isDisabled"
        @collect="handleCollect"
      />
    </table>
  </div>
</template>

<script>
import {
  getBatch,
  getBatchStart,
  getAvailable,
  getPrice,
} from '../../util/writing-nft';

import NFTSupplyRow from './Row';

export default {
  components: {
    NFTSupplyRow,
  },
  props: {
    soldCount: {
      type: Number,
      default: 0,
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
    visibleBatchesAhead: {
      type: Number,
      default: 3,
    },
    visibleBatchesBehind: {
      type: Number,
      default: 3,
    },
    shouldShowIndicator: {
      type: Boolean,
      default: undefined,
    },
    shouldCollapseInMobile: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // TODO: calculate batch according to batch/current price...
    shouldHideTable() {
      return (
        this.currentPrice &&
        this.currentPrice > getPrice(getBatchStart(this.activeBatch))
      );
    },
    activeBatch() {
      return getBatch(this.soldCount);
    },
    shouldHideLowerBound() {
      return this.activeBatch < this.visibleBatchesBehind;
    },
    visibleBatches() {
      return this.visibleBatchesBehind + 1 + this.visibleBatchesAhead;
    },
    data() {
      const start = Math.max(
        getBatch(this.soldCount) - this.visibleBatchesBehind,
        0
      );
      const end = start + this.visibleBatches;
      const data = [];
      for (let batch = start; batch < end; batch += 1) {
        const batchStart = getBatchStart(batch);
        data.push({
          total: batch + 1,
          available:
            this.activeBatch === batch
              ? getAvailable(this.soldCount, batch)
              : 0,
          price: getPrice(batchStart),
          type: this.getRowType(batch),
        });
      }
      return data.reverse();
    },
  },
  methods: {
    getRowType(batch) {
      if (batch < this.activeBatch) return 'past';
      if (batch > this.activeBatch) return 'future';
      return 'active';
    },
    handleCollect() {
      this.$emit('collect');
    },
  },
};
</script>
