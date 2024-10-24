<template>
  <div class="flex justify-center items-end w-full px-[16px]">
    <div class="relative w-[240px] desktop:w-[300px]">
      <svg
        class="w-full"
        viewBox="0 0 260 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <image
          x="0"
          y="0"
          width="260"
          height="241"
          :xlink:href="deviceFrameImage"
        />
        <image
          x="22"
          y="23"
          width="217"
          height="218"
          :xlink:href="signaturePageImage"
        />
      </svg>
      <client-only>
        <LottieAnimation
          :class="[
            'absolute',
            'top-[158px] desktop:top-[196px]',
            'left-[25px] desktop:left-[32px]',
            'w-[80px] desktop:w-[100px]',
          ]"
          :animation-data="animationData"
          :auto-play="true"
          :loop="true"
          :speed="1"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
import LottieAnimation from 'lottie-web-vue';

import SignatureAnimation from './signature-animation.json';

const signaturePage = require('./signature-page.png');
const deviceFrame = require('./device-frame.png');

export default {
  name: 'NFTBookSignatureBanner',
  components: {
    LottieAnimation,
  },
  computed: {
    signaturePageImage() {
      return signaturePage;
    },
    deviceFrameImage() {
      return deviceFrame;
    },
    animationData() {
      return SignatureAnimation;
    },
  },
};
</script>
