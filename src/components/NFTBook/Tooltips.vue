<template>
  <div
    :class="[
      'absolute',
      'top-[24px]',
      'z-50',

      'flex',
      'flex-col',
      'items-start',
      'px-[16px]',
      'py-[8px]',

      'border border-[#E3E3E3]',
      'rounded-[12px]',
      'bg-white',
      'w-[230px]',

      'text-[14px]',
      'shadow-md',
    ]"
  >
    <h4 class="font-600 text-dark-gray">{{ tooltipTitle }}</h4>
    <p>{{ tooltipText }}</p>
  </div>
</template>

<script>
export default {
  name: 'NFTBookTooltips',
  props: {
    tooltipText: {
      type: String,
      default: undefined,
    },
    tooltipTitle: {
      type: String,
      default: undefined,
    },
  },
};
</script>
