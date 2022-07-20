<template>
  <div class="civic-liker-support-amount-view">
    <div :class="mainRootClass">
      <div class="text-center">
        <span class="text-40 font-500 phone:text-32"><span
          v-if="!isClassic && prefix"
          class="font-emoji mr-8"
        >{{ prefix }}</span>{{ `${price} ${currency}` }}</span><span class="ml-8 text-16">/{{ period }}</span>
      </div>
      <button
        v-if="!isClassic"
        class="absolute right-0 w-24 h-24 flex justify-center items-center rounded-full border-like-cyan border-1 text-like-green"
        @click="$emit('click-add')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
            <line y2="14" transform="translate(8 1)" />
            <line x2="14" transform="translate(1 8)" />
          </g>
        </svg>
      </button>
    </div>
    <div class="mt-8 text-14 text-gray-9b text-center font-500">{{ hintText }}</div>
  </div>
</template>

<script>
export default {
  name: 'CivicLikerSupportAmountView',
  props: {
    hintText: {
      type: String,
      default: '',
    },
    pricePrefix: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    period: {
      type: String,
      default: 'mo',
    },
    prefix: {
      type: String,
      default: '',
    },
    isClassic: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    mainRootClass() {
      return [
        'relative flex items-center justify-center px-32',
        this.isClassic ? 'text-gray-4a' : 'text-like-green',
      ];
    },
  },
};
</script>
