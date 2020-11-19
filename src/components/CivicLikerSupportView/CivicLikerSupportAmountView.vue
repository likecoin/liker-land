<template>
  <div class="civic-liker-support-amount-view">
    <div class="relative flex items-center justify-center px-32 text-like-green">
      <div>
        <span class="text-40 font-500"><span
          v-if="prefix"
          class="font-emoji mr-8"
        >{{ prefix }}</span>{{ `${price} ${currency}` }}</span><span class="ml-8 text-16">/{{ period }}</span>
      </div>
      <button
        class="absolute pin-r w-24 h-24 flex justify-center items-center rounded-full border-like-cyan border-1 text-like-green"
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
  },
};
</script>
