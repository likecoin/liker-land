<template>
  <div :class="wrapperClasses">
    <img
      ref="img"
      :class="coverClass"
      :src="resizedSrc"
      :alt="isLoaded ? alt : ''"
      @load="handleMediaLoad"
      @error="handleImageError"
    />

    <!-- Book highlight effect -->
    <div
      v-show="isLoaded"
      class="absolute inset-0 pointer-events-none"
      style="background: linear-gradient(90deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.00) 2.31%), linear-gradient(180deg, rgba(136, 136, 136, 0.00) 98.62%, rgba(136, 136, 136, 0.12) 98.95%, rgba(39, 37, 34, 0.15) 99.43%, rgba(0, 0, 0, 0.06) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.00) 17.98%);"
    />
  </div>
</template>

<script>
import { getImageResizeAPI } from '~/util/api';

const coverPlaceholderSrc = require('~/assets/images/nft/primitive-nft.jpg');

export default {
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: 'Cover',
    },
    imgClass: {
      type: String,
      default: '',
    },
    resize: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      isPortrait: true,
      isError: false,
      isLoaded: false,
    };
  },
  computed: {
    isShowPlaceholder() {
      return !this.src || !this.isLoaded || this.isError;
    },
    wrapperClasses() {
      return [
        'relative',
        'rounded-[4px]',
        'overflow-hidden',
        this.isPortrait ? 'h-full' : 'w-full',
        {
          '[box-shadow:-8px_42px_64px_0px_rgba(0,_0,_0,_0.12)]': this.isLoaded,
        },
      ];
    },
    coverClass() {
      return [
        this.isPortrait ? 'h-full' : 'w-full',
        this.imgClass,
        'object-cover',
        'transition-opacity transition-transform',
        {
          'opacity-0 scale-2': !this.isLoaded,
        },
      ];
    },
    resizedSrc() {
      return this.isError
        ? coverPlaceholderSrc
        : getImageResizeAPI(this.src, { width: this.resize });
    },
  },
  watch: {
    src() {
      this.isPortrait = true;
      this.isError = false;
      this.isLoaded = false;
    },
  },
  methods: {
    handleMediaLoad() {
      const imgEl = this.$refs.img;
      if (imgEl) {
        this.isPortrait = imgEl.naturalHeight > imgEl.naturalWidth;
      }
      this.isLoaded = true;
    },
    handleImageError() {
      this.isError = true;
      this.isLoaded = true;
    },
  },
};
</script>
