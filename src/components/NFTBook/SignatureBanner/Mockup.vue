<template>
  <div class="flex justify-center w-full px-[16px]">
    <svg
      class="w-full max-w-[300px]"
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
      <foreignObject x="28" y="172" width="86" height="52">
        <client-only>
          <LottieAnimation
            :animation-data="animationData"
            :auto-play="true"
            :loop="true"
            :speed="1"
          />
        </client-only>
      </foreignObject>
    </svg>
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
