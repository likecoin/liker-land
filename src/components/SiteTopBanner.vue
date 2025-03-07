<template>
  <Transition @enter="handleBannerEnter" @leave="handleBannerLeave">
    <div
      v-if="isShowBanner"
      :class="[
        'relative',
        'top-0',
        'z-[500]',

        'flex',
        'items-center',
        'justify-center',

        'overflow-hidden',

        'w-full',
        'h-[40px]',

        'text-white',
        'bg-like-green',
      ]"
    >
      <Transition name="scroll-up">
        <div
          :key="activeMessage"
          :class="[
            'absolute',
            'inset-0',

            'flex',
            'justify-center',
            'items-center',

            'text-[14px]',
            'text-center',
          ]"
          v-text="activeMessage"
        />
      </Transition>

      <ButtonV2
        preset="plain"
        size="small"
        class="absolute translate-y-[-50%] right-[12px] top-1/2"
        @click="closeBanner"
      >
        <IconClose class="transform scale-75 laptop:scale-100" />
      </ButtonV2>
    </div>
  </Transition>
</template>

<script>
const LAST_CLOSED_AT_KEY = 'site-top-banner-last-closed-at';

export default {
  name: 'SiteTopBanner',
  props: {
    bannerKey: {
      type: String,
      default: 'global',
    },
    messages: {
      type: Array,
      default: () => [],
    },
    interval: {
      type: Number,
      default: 4000,
    },
  },
  data() {
    return {
      isShowBanner: false,
      activeMessageIndex: 0,
    };
  },
  computed: {
    activeMessage() {
      return this.messages[this.activeMessageIndex];
    },
    localStorageKey() {
      return this.bannerKey
        ? `${LAST_CLOSED_AT_KEY}-${this.bannerKey}`
        : LAST_CLOSED_AT_KEY;
    },
  },
  mounted() {
    this.showBannerIfPossible();
  },
  beforeDestroy() {
    this.clearInterval();
  },
  methods: {
    handleBannerEnter(el, done) {
      this.$gsap.gsap.from(el, {
        height: 0,
        duration: 0.5,
        onComplete: done,
      });
    },
    handleBannerLeave(el, done) {
      this.$gsap.gsap.to(el, {
        height: 0,
        duration: 0.5,
        onComplete: done,
      });
    },
    nextMessage() {
      this.activeMessageIndex =
        (this.activeMessageIndex + 1) % this.messages.length;
    },
    clearInterval() {
      if (this.messageInterval) {
        clearInterval(this.messageInterval);
        this.messageInterval = null;
      }
    },
    closeBanner() {
      this.isShowBanner = false;
      try {
        window.localStorage.setItem(this.localStorageKey, Date.now());
      } finally {
        this.clearInterval();
      }
    },
    showBannerIfPossible() {
      try {
        const lastClosedTime = window.localStorage.getItem(
          this.localStorageKey
        );
        const oneDay = 24 * 60 * 60 * 1000;
        if (!lastClosedTime || Date.now() - lastClosedTime >= oneDay) {
          this.isShowBanner = true;
          this.messageInterval = setInterval(this.nextMessage, this.interval);
        }
      } catch {}
    },
  },
};
</script>
