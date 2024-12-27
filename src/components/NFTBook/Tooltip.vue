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
    <p
      class="block text-[14px] font-600 text-dark-gray"
      v-text="tooltipTitle"
    />
    <p v-text="tooltipText" />
  </div>
</template>

<script>
export default {
  name: 'NFTBookTooltip',
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
