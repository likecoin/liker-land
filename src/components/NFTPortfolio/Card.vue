<template>
  <div
    :class="[
      'rounded-[24px]',
      'w-full',
      'overflow-hidden',
      'bg-white',
      {'bg-gradient-to-tr from-[#D2F0F0] to-[#F0E6B4]': displayState === 'featured'},
      {'hover:bg-like-cyan-light': displayState !== 'hidden'},
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
        { 'blur-md opacity-75': displayState === 'hidden' },
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { NFT_DISPLAY_STATE } from '~/constant';

export default {
  props: {
    displayState: {
      type: String,
      default: NFT_DISPLAY_STATE.DEFAULT,
    },
  },
};
</script>
