<template>
  <svg
    class="app-screenshots-viewer"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="232"
    height="477"
    viewBox="0 0 232 477"
  >
    <defs>
      <clipPath id="clip-path">
        <rect width="213" height="462" rx="16" />
      </clipPath>
    </defs>
    <path d="M24.417,477a22,22,0,0,1-22-22V187.653H2a2,2,0,0,1-2-2v-29.9a2,2,0,0,1,2-2h.417v-10.9H2a2,2,0,0,1-2-2v-29.9a2,2,0,0,1,2-2h.417V90.8H2a2,2,0,0,1-2-2V75.85a2,2,0,0,1,2-2h.417V22a22,22,0,0,1,22-22H207.583a22,22,0,0,1,22,22v97.856H230a2,2,0,0,1,2,2v51.691a2,2,0,0,1-2,2h-.417V455a22,22,0,0,1-22,22Z" />
    <g transform="translate(10 7)">
      <g clip-path="url(#clip-path)">
        <transition name="fade">
          <image
            :key="currentIndex"
            width="213"
            height="461.637"
            transform="translate(0 0)"
            :xlink:href="getScreenshot(currentIndex)"
          />
        </transition>
      </g>
    </g>
  </svg>
</template>

<script>
const getScreenshot = require.context('./screenshots');

export default {
  name: 'AppScreenshotsViewer',
  data() {
    return {
      currentIndex: 0,
    };
  },
  computed: {
    screenshotsCount() {
      return 6;
    },
  },
  mounted() {
    this.timer = setInterval(this.nextScreenshot, 3000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getScreenshot(index) {
      return getScreenshot(`./${index}.jpg`);
    },
    nextScreenshot() {
      this.currentIndex = (this.currentIndex + 1) % this.screenshotsCount;
    },
  },
};
</script>
