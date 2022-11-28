<template>
  <div
    class="bg-gray-9b"
    :style="rootStyle"
  >
    <img
      v-if="src"
      v-bind="imgProps"
      :src="resizedSrc"
    >
    <img
      v-else
      v-bind="imgProps"
      src="~/assets/images/nft/primitive-nft.png"
    >
  </div>
</template>

<script>
import { getLikeCoResizedImageUrl } from '~/util/ui';

export default {
  name: 'NFTCover',
  props: {
    src: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 720,
    },
    bgColor: {
      type: String,
      default: '',
    },
  },
  computed: {
    rootStyle() {
      return {
        backgroundColor: this.imgBgColor,
      };
    },
    imgProps() {
      return {
        class: 'object-contain w-full',
        loading: 'lazy',
        ...this.$attrs,
      };
    },
    resizedSrc() {
      return getLikeCoResizedImageUrl(this.src, this.size);
    },
  },
};
</script>
