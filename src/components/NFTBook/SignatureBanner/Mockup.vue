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
        <path
          opacity="0.5"
          d="M56.8808 95.4708C59.4748 96.1452 61.2388 97.1828 61.2388 99.5693C61.2388 101.229 59.9936 102.578 57.9703 102.578C55.6876 102.578 54.2868 100.814 54.2868 97.9091C54.2868 94.7444 55.8951 90.179 61.135 88L61.9651 89.297C58.4372 91.0091 57.0883 93.6031 56.8808 95.4708ZM46.1935 95.4708C48.7875 96.1452 50.5514 97.1828 50.5514 99.5693C50.5514 101.229 49.3063 102.578 47.283 102.578C45.0003 102.578 43.6514 100.814 43.6514 97.9091C43.6514 94.7444 45.2597 90.179 50.4477 88L51.2778 89.297C47.7499 91.0091 46.4529 93.6031 46.1935 95.4708Z"
          fill="#CECECE"
        />
      </svg>
      <client-only>
        <div
          ref="nameText"
          :class="[
            textClasses,
            'top-[42px] desktop:top-[52px]',
            'text-[12px] desktop:text-[16px]',
          ]"
        />
        <div
          ref="messageText"
          :class="[
            textClasses,
            'top-[96px] desktop:top-[120px]',
            'text-[16px] desktop:text-[20px]',
            'whitespace-pre-line',
          ]"
        />
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

const deviceFrame = require('./device-frame.png');

const NAMES = [
  'Aurora',
  'Bob',
  'Carol',
  'David',
  'Edmond',
  'Phoebe',
  'William',
  '一心',
  '有容',
  '允行',
  '修端',
  '念慈',
];
const MESSAGES = [
  '不怕，我們有彼此。',
  'Thank you for your support.',
  '感謝支持！',
  '真理在胸筆在手\n無私無畏即自由',
  '錦瑟無端五十弦\n一弦一柱思華年',
  '去留肝膽兩崑崙',
  '杜絕文青！',
  '天涼好個秋',
  'My pen is blue, \nMy friend is you.',
  '見書如見人',
  '臨表涕零\n不知所言',
];

export default {
  name: 'NFTBookSignatureBanner',
  components: {
    LottieAnimation,
  },
  computed: {
    deviceFrameImage() {
      return deviceFrame;
    },
    animationData() {
      return SignatureAnimation;
    },
    textClasses() {
      return [
        'absolute',
        'left-[40px] desktop:left-[50px]',
        'text-[#333]',
        'font-serif',
        'w-[160px] desktop:w-[200px]',
      ];
    },
  },
  mounted() {
    this.animateText();
  },
  methods: {
    animateText() {
      const timeline = this.$gsap.gsap.timeline({ repeat: -1 });

      NAMES.map(name => `${name},`).forEach((str, index) => {
        const chars = str.split('');

        // Add char by char
        chars.forEach(char => {
          timeline.to(
            {},
            {
              duration: 0.1,
              onComplete: () => {
                this.$refs.nameText.textContent += char;
              },
            }
          );
        });

        MESSAGES[index % MESSAGES.length].split('').forEach(char => {
          timeline.to(
            {},
            {
              duration: 0.1,
              onComplete: () => {
                this.$refs.messageText.textContent += char;
              },
            }
          );
        });

        // Clear text
        timeline.to(
          {},
          {
            duration: 1,
            onComplete: () => {
              this.$refs.nameText.textContent = '';
              this.$refs.messageText.textContent = '';
            },
          }
        );
      });
    },
  },
};
</script>
