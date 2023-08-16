<template>
  <div class="flex items-stretch shrink-0 w-min">
    <div
      class="relative bg-gray-9b w-full"
      :style="rootStyle"
    >
      <video
        v-if="isShowVideo"
        autoplay
        muted
        loop
        playsinline
        v-bind="imgProps"
        :class="imgClassName"
        :poster="resizedSrc"
        :src="videoSrc"
        @play="handleMediaLoad"
        @error="handleVideoError"
      />
      <img
        v-else-if="isShowImage"
        v-bind="imgProps"
        :class="imgClassName"
        :src="resizedSrc"
        @load="handleMediaLoad"
        @error="handleImageError"
      >
      <img
        v-if="!isShowVideo && (!isShowImage || !isLoaded)"
        v-bind="imgProps"
        :class="imgClassNameForPlaceholder"
        src="~/assets/images/nft/primitive-nft.jpg"
      >
    </div>
    <div
      v-if="isNftBook"
      :class="['h-auto', 'w-[16px]', 'shrink-0']"
      :style="`background: linear-gradient(to bottom, ${color1}, ${color2});`"
    />
  </div>
</template>

<script>
import { getImageResizeAPI } from '~/util/api';

export default {
  name: 'NFTCover',
  props: {
    src: {
      type: String,
      default: '',
    },
    videoSrc: {
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
    isNftBook: {
      type: Boolean,
      default: false,
    },
    spineColor1: {
      type: String,
      default: '',
    },
    spineColor2: {
      type: String,
      default: '',
    },
    shouldResizeSrc: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isError: false,
      isLoaded: false,
      isVideoError: false,
    };
  },
  computed: {
    rootStyle() {
      return {
        backgroundColor: this.imgBgColor,
      };
    },
    imgProps() {
      return {
        loading: 'lazy',
        // NOTE: Mitigate image deform before Tailwind CSS is loaded
        style: 'object-fit: cover;',
        ...this.$attrs,
      };
    },
    imgClassName() {
      return [
        ...this.imgClassNameForPlaceholder,
        {
          'pointer-events-none': !this.isLoaded,
          'absolute inset-x-0 top-0 opacity-0':
            !this.isLoaded && !this.isShowVideo,
        },
      ];
    },
    imgClassNameForPlaceholder() {
      return [
        'w-full',
        {
          'animate-pulse': !this.isLoaded,
          'h-[290px] w-[204px]': this.isNftBook,
        },
      ];
    },
    resizedSrc() {
      return this.shouldResizeSrc
        ? getImageResizeAPI(this.src, { width: this.size })
        : this.src;
    },
    isShowVideo() {
      return this.videoSrc && !this.isVideoError && !this.isError;
    },
    isShowImage() {
      return this.src && !this.isError;
    },
    color1() {
      if (this.spineColor1 && this.spineColor2) return this.spineColor1;
      return '#EBEBEB';
    },
    color2() {
      if (this.spineColor1 && this.spineColor2) return this.spineColor2;
      return '#9B9B9B';
    },
  },
  watch: {
    src() {
      this.isError = false;
      this.isLoaded = false;
    },
  },
  methods: {
    handleMediaLoad(e) {
      this.isLoaded = true;
      this.emitLoadEvent(e);
    },
    handleVideoError() {
      this.isVideoError = true;
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
