<template>
  <div
    :class="[
      'rounded-[24px]',
      'w-full',
      'overflow-hidden',
      'bg-white',
      {'bg-gradient-to-tr from-[#D2F0F0] to-[#F0E6B4]': currentState === 'featured'},
      {'hover:bg-like-cyan-light': currentState !== 'hidden'},
      'transition',
      'ease-in',
      'duration-200',
    ]"
  >
    <div
      :class="[
        'flex',
        'flex-col',
        'rounded-[24px]',
        'w-full',
        'h-auto',
        'overflow-hidden',
        'box-border',
        'border-[2px]',
        'border-transparent',
        { 'blur-md opacity-75': currentState === 'hidden' },
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentState: {
      type: String,
      default: 'viewOnly',
    },
  },
};
</script>
