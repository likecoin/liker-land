<template>
  <div
    :class="[
      'overflow-y-hidden',
      shouldCollapseInMobile ? 'laptop:border-y-[2px]' : 'border-y-[2px]',
      'border-shade-gray',
      {
        'pointer-events-none': isDisabled,
        'border-b-0 laptop:border-b-0': shouldHideLowerBound,
      },
    ]"
  >
    <table
      :class="[
        'w-full',
        shouldCollapseInMobile ? 'laptop:-my-[21px]' : '-my-[21px]',
        {
          'mb-[0] laptop:mb-[0]': shouldHideLowerBound
        },
      ]"
    >
      <tbody>
        <NFTSupplyRow
          v-for="(d, n) in data"
          :key="n"
          v-bind="d"
          :should-collapse-in-mobile="shouldCollapseInMobile"
          :should-show-indicator="shouldShowIndicator"
          :is-disabled="isDisabled"
          @collect="handleCollect"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  getBatch,
  getBatchStart,
  getAvailable,
  getPrice,
  getSoldCountByPrice,
  STARTING_PRICE,
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
    basePrice: {
      type: Number,
      default: STARTING_PRICE,
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
    baseSoldCount() {
      return getSoldCountByPrice(this.basePrice);
    },
    baseBatch() {
      return getBatch(this.baseSoldCount);
    },
    offsetSoldCount() {
      return this.soldCount + this.baseSoldCount;
    },
    activeBatch() {
      return getBatch(this.offsetSoldCount);
    },
    shouldHideLowerBound() {
      return this.activeBatch - this.baseBatch < this.visibleBatchesBehind;
    },
    visibleBatches() {
      return this.visibleBatchesBehind + 1 + this.visibleBatchesAhead;
    },
    data() {
      const start = Math.max(
        this.activeBatch - this.visibleBatchesBehind,
        this.baseBatch
      );
      const end = start + this.visibleBatches;
      const data = [];
      for (let batch = start; batch < end; batch += 1) {
        const batchStart = getBatchStart(batch);
        data.push({
          total: batch + 1,
          available:
            this.activeBatch === batch
              ? getAvailable(this.offsetSoldCount, batch)
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
