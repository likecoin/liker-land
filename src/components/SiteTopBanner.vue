<template>
  <div
    v-if="showBanner"
    class="z-[500] w-full h-[40px] overflow-hidden flex items-center justify-center text-white bg-like-green relative"
  >
    <div class="h-[24px] overflow-hidden relative">
      <div class="scrolling-content">
        <div
          v-for="(message, index) in repeatedMessages"
          :key="index"
          class="h-[24px] text-[14px] flex items-center justify-center"
        >
          {{ message }}
        </div>
      </div>
    </div>

    <ButtonV2
      preset="plain"
      size="small"
      class="absolute translate-y-[-50%] right-[12px] top-1/2"
      @click="closeBanner"
    >
      <IconClose class="transform scale-75 laptop:scale-100" />
    </ButtonV2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        this.$t('christmas_campaign_text_1'),
        this.$t('christmas_campaign_text_2'),
        this.$t('christmas_campaign_text_3'),
      ],
      showBanner: true,
    };
  },
  computed: {
    repeatedMessages() {
      return this.messages.concat(this.messages);
    },
  },
  created() {
    this.checkBannerStatus();
  },
  methods: {
    closeBanner() {
      this.showBanner = false;
      try {
        window.localStorage.setItem('bannerClosedTime', Date.now());
      } catch (error) {}
    },
    checkBannerStatus() {
      try {
        const lastClosedTime = window.localStorage.getItem('bannerClosedTime');
        const oneDay = 24 * 60 * 60 * 1000;
        if (lastClosedTime && Date.now() - lastClosedTime < oneDay) {
          this.showBanner = false;
        }
      } catch (error) {}
    },
  },
};
</script>

<style scoped>
.scrolling-content {
  display: flex;
  flex-direction: column;
  animation: scrollUp 12s cubic-bezier(0.7, 0, 0.25, 1) infinite;
}

@keyframes scrollUp {
  0%,
  16.666% {
    transform: translateY(0%);
  }
  33.333%,
  50% {
    transform: translateY(-16.666%);
  }
  66.666%,
  83.333% {
    transform: translateY(-33.333%);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
