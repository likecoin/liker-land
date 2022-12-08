<template>
  <div
    class="relative bg-gray-9b"
    :style="rootStyle"
  >
    <img
      v-if="isShowImage"
      v-bind="imgProps"
      :src="resizedSrc"
      @load="handleImageLoad"
      @error="handleImageError"
    >
    <img
      v-if="!isShowImage || !isLoaded"
      v-bind="imgPropsForPlaceholder"
      src="~/assets/images/nft/primitive-nft.jpg"
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
  data() {
    return {
      isError: false,
      isLoaded: false,
    };
  },
  computed: {
    rootStyle() {
      return {
        backgroundColor: this.imgBgColor,
      };
    },
    imgProps() {
      const { imgPropsForPlaceholder: props, isLoaded } = this;
      return {
        ...props,
        class: [
          ...props.class,
          {
            'absolute inset-x-0 top-0 opacity-0 pointer-events-none': !isLoaded,
          },
        ],
      };
    },
    imgPropsForPlaceholder() {
      return {
        class: [
          'object-contain w-full',
          {
            'animate-pulse': !this.isLoaded,
          },
        ],
        loading: 'lazy',
        ...this.$attrs,
      };
    },
    resizedSrc() {
      return getLikeCoResizedImageUrl(this.src, this.size);
    },
    isShowImage() {
      return this.src && !this.isError;
    },
  },
  watch: {
    src() {
      this.isError = false;
      this.isLoaded = false;
    },
  },
  methods: {
    handleImageLoad(e) {
      this.isLoaded = true;
      this.emitLoadEvent(e);
    },
    handleImageError(e) {
      this.isError = true;
      this.isLoaded = true;
      this.emitLoadEvent(e);
    },
    emitLoadEvent(e) {
      this.$nextTick(() => {
        this.$emit('load', e);
      });
    },
  },
};
</script>
