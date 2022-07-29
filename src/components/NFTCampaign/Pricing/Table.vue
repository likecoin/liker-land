<template>
  <div
    :class="[
      'overflow-y-clip',
      'laptop:pr-[8px]',
      'laptop:border-y-[2px]',
      'border-shade-gray',
      {
        'laptop:border-b-0': shouldHideLowerBound,
      },
    ]"
  >
    <table
      :class="[
        'w-full',
        'laptop:-my-[21px]',
        {
          'laptop:mb-[0]': shouldHideLowerBound
        },
      ]"
    >
      <NFTCampaignPricingRow
        v-for="(d, n) in data"
        :key="n"
        v-bind="d"
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
} from '../../../util/writing-nft';

export default {
  props: {
    soldCount: {
      type: Number,
      default: 0,
    },
    visableBatch: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    activeBatch() {
      return getBatch(this.soldCount);
    },
    shouldHideLowerBound() {
      return this.activeBatch < this.visableBatch;
    },
    data() {
      const start = Math.max(getBatch(this.soldCount) - this.visableBatch, 0);
      const end = start + this.visableBatch * 2 + 1;
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
