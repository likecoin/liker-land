<template>
  <component
    :is="tag"
    :class="[
      'group',
      'relative',
      classAspectRatio,
      'bg-gray-e6',
      'rounded-[8px]',
      'overflow-hidden',
    ]"
    :to="to"
  >
    <div
      class="absolute inset-0 bg-cover bg-no-repeat opacity-25 brightness-150 pointer-events-none"
      :style="`background-image: url(${bgImageSrc})`"
    />

    <div
      :class="[
        'absolute',
        'inset-[24px] desktop:inset-[40px]',
        'flex',
        'justify-center',
        'items-center',
      ]"
    >
      <NFTBookCover :src="src" :alt="alt" :img-class="imgClass" />
    </div>
  </component>
</template>

<script>
import { getImageResizeAPI } from '~/util/api';

export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'div',
    },
    imgClass: {
      type: String,
      default: '',
    },
    to: {
      type: Object,
      default: null,
    },
    classAspectRatio: {
      type: String,
      default: 'aspect-[4/5]',
    },
  },
  computed: {
    bgImageSrc() {
      return getImageResizeAPI(this.src, { width: 4 });
    },
  },
};
</script>
