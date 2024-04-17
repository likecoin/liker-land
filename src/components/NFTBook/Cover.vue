<template>
  <div
    :class="[
      'relative',
      'flex',
      'justify-center',
      'items-center',
      'w-full',
      'h-full',
      containerClasses,
    ]"
  >
    <img
      :class="[imageClassesInCommon, imgClass]"
      :src="resizedSrc"
      :alt="isLoaded ? alt : ''"
      @load="handleMediaLoad"
      @error="handleImageError"
    />

    <img
      v-if="isShowPlaceholder"
      :class="[imageClassesInCommon, 'aspect-[4/5]', 'animate-pulse']"
      src="~/assets/images/nft/primitive-nft.jpg"
    />
  </div>
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
      default: 'Cover',
    },
    imgClass: {
      type: String,
      default: '',
    },
    containerClasses: {
      type: Array,
      default: () => ['min-h-[200px]'],
    },
  },
  data() {
    return {
      isError: false,
      isLoaded: false,
    };
  },
  computed: {
    isShowPlaceholder() {
      return !this.src || !this.isLoaded || this.isError;
    },
    imageClassesInCommon() {
      return [
        'absolute',
        'inset-y-0',
        'h-full',
        'rounded-[4px]',
        'object-cover',
        '[box-shadow:-8px_42px_64px_0px_rgba(0,_0,_0,_0.12)]',
      ];
    },
    resizedSrc() {
      return getImageResizeAPI(this.src, { width: 300 });
    },
  },
  watch: {
    src() {
      this.isError = false;
      this.isLoaded = false;
    },
  },
  methods: {
    handleMediaLoad() {
      this.isLoaded = true;
    },
    handleImageError() {
      this.isError = true;
      this.isLoaded = true;
    },
  },
};
</script>
