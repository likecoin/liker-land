<template>
  <component
    :is="tag"
    :class="[
      'group',
      'relative',
      classAspectRatio,
      'max-h-[70vh]',
      'bg-gray-e6',
      'rounded-[8px]',
      'overflow-hidden',
    ]"
    :to="to"
    v-bind="$attrs"
  >
    <div
      class="absolute inset-0 bg-no-repeat bg-cover opacity-25 pointer-events-none brightness-150"
      :style="backgroundStyle"
    />

    <div
      :class="[
        'absolute',
        'inset-[8%]',
        'flex',
        'justify-center',
        'items-center',
      ]"
    >
      <NFTBookCover
        :class="coverClass"
        :src="src"
        :alt="alt"
        :resize="coverResize"
        @load="$emit('load', $event)"
      />
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
    coverClass: {
      type: String,
      default: '',
    },
    coverResize: {
      type: Number,
      default: 300,
    },
    to: {
      type: Object,
      default: null,
    },
    classAspectRatio: {
      type: String,
      default: 'aspect-[4/5]',
    },
    backgroundColor: {
      type: String,
      default: '',
    },
  },
  computed: {
    bgImageSrc() {
      return getImageResizeAPI(this.src, { width: 4 });
    },
    backgroundStyle() {
      const style = {};
      if (this.backgroundColor) {
        style.backgroundColor = this.backgroundColor;
      } else {
        style.backgroundImage = `url(${this.bgImageSrc})`;
      }
      return style;
    },
  },
};
</script>
