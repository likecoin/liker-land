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
    </svg>
  </div>
</template>

<script>
const signaturePage = require('./signature-page.png');
const deviceFrame = require('./device-frame.png');

export default {
  name: 'NFTBookSignatureBanner',
  computed: {
    signaturePageImage() {
      return signaturePage;
    },
    deviceFrameImage() {
      return deviceFrame;
    },
  },
};
</script>
