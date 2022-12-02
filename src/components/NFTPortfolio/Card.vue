<template>
  <div
    :class="[
      'flex',
      'flex-col',
      'rounded-[24px]',
      'w-full',
      'overflow-hidden',
      'bg-white',
      'box-border',
      'border-[2px]',
      'border-transparent',
      `hover:${hoverClass}`,
      'transition',
      'ease-in',
      'duration-200',
    ]"
  >
    <slot />
  </div>
</template>

<script>
import { NFT_GEM_NAME } from '~/constant';

export default {
  props: {
    gemLevel: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    hoverClass() {
      if (this.gemLevel < 0 || this.gemLevel > NFT_GEM_NAME.length) {
        return 'border-like-cyan-light';
      }
      return `border-gem-${NFT_GEM_NAME[this.gemLevel].toLowerCase()}`;
    },
  },
};
</script>
