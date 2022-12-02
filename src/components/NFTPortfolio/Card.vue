<template>
  <div
    :class="[
      hoverClass,
      'flex',
      'flex-col',
      'rounded-[24px]',
      'w-full',
      'overflow-hidden',
      'bg-white',
      'box-border',
      'border-[2px]',
      'border-transparent',
      'transition',
      'ease-in',
      'duration-200',
    ]"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    hoverClass: {
      type: String,
      default: 'hover:border-like-cyan-light',
    },
  },
};
</script>
