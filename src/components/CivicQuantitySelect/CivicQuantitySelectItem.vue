<template>
  <button
    :class="buttonClass"
    v-on="$listeners"
  >
    <span v-if="priceEmoji" class="font-emoji text-40" place="emoji">{{ priceEmoji }}</span>
    <div class="text-24 font-600">${{ price }}</div>
    <div class="mt-4 text-14 text-gray-9b">{{ $t('Currency.USD') }}/{{ $t('SubscriptionPeriod.Month') }}</div>
  </button>
</template>

<script>
export default {
  props: {
    price: {
      type: Number,
      default: 5,
    },
    priceEmoji: {
      type: String,
      default: '',
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonClass() {
      return [
        'rounded-8 py-8',
        this.isSelected ? 'border-2' : 'border-1',
        this.isSelected ? 'border-like-cyan' : 'border-like-cyan-pale',
        this.isSelected ? 'text-like-green' : 'text-gray-4a',
        this.isSelected ? 'hover:border-like-green' : 'hover:border-like-cyan',
        {
          'bg-like-cyan-pale ': this.isSelected,
        },
      ];
    },
  },
};
</script>
