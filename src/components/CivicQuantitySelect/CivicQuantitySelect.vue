<template>
  <div>
    <ul
      class="flex list-disc w-full mt-4"
      :style="{ minHeight: 144 }"
    >
      <li
        v-for="option in quantityOptions"
        :key="option.value"
        class="flex-1 p-8"
      >
        <CivicQuantitySelectItem
          class="block w-full h-full"
          :price="option.value * dollar"
          :price-emoji="getPriceEmoji(option.value * dollar)"
          :is-selected="value === option.value"
          @click="$emit('input', option.value)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { getPriceEmoji } from '~/util/civic';
import {
  CIVIC_LIKER_UNIT_PRICE,
  CIVIC_LIKER_QUANTITY_OPTIONS,
} from '~/constant';

import CivicQuantitySelectItem from './CivicQuantitySelectItem';

export default {
  components: {
    CivicQuantitySelectItem,
  },
  props: {
    dollar: {
      type: Number,
      default: CIVIC_LIKER_UNIT_PRICE,
    },
    currency: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    normalizedCurrency() {
      return this.currency || this.$t('Currency.USD');
    },
    quantityOptions() {
      return CIVIC_LIKER_QUANTITY_OPTIONS.map(quantity => ({
        text: `${quantity * this.dollar} ${this.normalizedCurrency}/${this.$t(
          'SubscriptionPeriod.Month'
        )}`,
        value: quantity,
      }));
    },
  },
  methods: {
    getPriceEmoji,
  },
};
</script>
