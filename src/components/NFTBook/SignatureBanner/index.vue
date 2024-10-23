<template>
  <component
    :is="tag"
    :class="[
      'relative',
      'desktop:mt-[30px]',
      'rounded-[24px]',
      { 'cursor-pointer': $listeners.click },
    ]"
    @click="$emit('click')"
  >
    <video
      :class="[
        'absolute',
        'left-1/2',
        'top-1/2',

        'w-full',
        'h-full',

        'rounded-[inherit]',
        'object-cover',
        'object-center',

        '-translate-x-1/2',
        '-translate-y-1/2',

        'pointer-events-none',
      ]"
      autoplay
      loop
      muted
      playsinline
      :style="bgVideoStyle"
    >
      <source v-for="src in bgVideoSources" :key="src" :src="src" />
    </video>

    <div
      :class="[
        'relative',

        'flex',
        'flex-col-reverse desktop:flex-row',
        'items-stretch',

        'min-h-[248px]',

        'text-like-green',

        'rounded-[inherit]',

        'bg-gradient-to-t desktop:bg-gradient-to-r',
        'from-[rgba(232,252,255,0.70)]',
        'to-[rgba(232,252,255,0.90)]',
        'to-60%',

        'overflow-hidden desktop:overflow-visible',
      ]"
    >
      <svg
        class="absolute top-[64px] desktop:top-auto desktop:bottom-0 right-0 pointer-events-none"
        width="341"
        height="204"
        viewBox="0 0 341 204"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 205.98C81.5047 189.285 158.164 169.23 229.878 126.019C245.25 116.757 420.431 3 305.458 3C255.104 3 183.33 44.7765 173.69 107.168C165.158 162.387 221.074 160.829 253.425 157.334C299.394 152.368 341.965 130.12 385.183 112.945C444.728 89.2811 540.595 57.2426 505.835 134.76"
          stroke="#FBF9DD"
          stroke-width="5.5"
          stroke-linecap="round"
        />
      </svg>

      <svg
        class="hidden desktop:block absolute bottom-0 left-0 pointer-events-none"
        width="242"
        height="182"
        viewBox="0 0 242 182"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-72.3261 3C-81.7475 3 -91.5897 8.07559 -100.114 11.4292C-123.096 20.4717 -150.782 36.3323 -159.758 60.842C-168.933 85.8973 -124.753 88.1046 -110.345 88.5713C-65.8881 90.0112 -21.8517 78.2798 22.4301 76.4797C35.0163 75.9681 42.0411 77.1606 50.0432 85.1415C61.4349 96.503 16.8554 118.845 50.0432 128.396C83.2309 137.948 122.643 128.662 156.019 124.381C182.41 120.996 209.05 119.165 235.312 114.964"
          stroke="#FBF9DD"
          stroke-width="5.5"
          stroke-linecap="round"
        />
      </svg>

      <NFTBookSignatureBannerMockup
        class="relative desktop:mt-[-30px] desktop:max-w-[435px]"
      />

      <div
        :class="[
          'relative',
          'flex',
          'flex-col',
          'justify-center',

          'px-[24px]',
          'py-[32px]',
          'desktop:pl-[0]',
          'desktop:p-[48px]',
        ]"
      >
        <i18n
          :class="[
            'text-[32px] desktop:text-[40px]',
            'font-serif',
            'font-bold',
            'leading-1_25',
          ]"
          path="nft_book_signature_banner_title"
          tag="h2"
        >
          <span class="px-[8px] bg-white" place="name">
            <Transition mode="out-in" name="author-with-signature">
              <span
                :key="activeName"
                class="inline-block"
                v-text="activeName"
              />
            </Transition>
          </span>
        </i18n>

        <p class="mt-[16px]" v-text="$t('nft_book_signature_banner_content')" />
      </div>
    </div>
    <client-only>
      <lazy-component @show.once="$emit('scroll-to-bottom')" />
    </client-only>
  </component>
</template>

<script>
const videoThumbnail = require('./video-thumbnail.jpg');

export default {
  name: 'NFTBookSignatureBanner',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    name: {
      type: [String, Array],
      default: '',
    },
  },
  data() {
    return {
      activeNameIndex: 0,
    };
  },
  computed: {
    nameList() {
      const { name } = this;

      let names = [];
      if (Array.isArray(name)) {
        names = name.filter(n => typeof n === 'string');
      } else if (typeof name === 'string') {
        names = name.split(/[\s,，、/]/);
      }

      return names.map(n => n.trim()).filter(Boolean);
    },
    activeName() {
      return (
        this.nameList[this.activeNameIndex] ||
        this.$t('nft_book_signature_banner_author')
      );
    },
    bgVideoStyle() {
      return {
        backgroundImage: `url(${videoThumbnail})`,
      };
    },
    bgVideoSources() {
      return ['/videos/signature-banner.mp4'];
    },
  },
  watch: {
    name() {
      this.activeNameIndex = 0;
    },
  },
  mounted() {
    if (this.nameList.length > 1) {
      this.$nextTick(() => {
        this.nameAnimationInterval = setInterval(() => {
          this.activeNameIndex =
            (this.activeNameIndex + 1) % this.nameList.length;
        }, 3000);
      });
    }
  },
  beforeDestroy() {
    if (this.nameAnimationInterval) {
      clearInterval(this.nameAnimationInterval);
      this.nameAnimationInterval = undefined;
    }
  },
};
</script>

<style lang="scss">
.author-with-signature- {
  &enter {
    opacity: 0;
    transform: translateY(-50%);
  }
  &leave-to {
    opacity: 0;
    transform: translateY(50%);
  }

  &enter-active,
  &leave-active {
    transition-property: transform, opacity;
    transition-duration: 200ms;
  }
  &enter-active {
    transition-timing-function: ease-out;
  }
  &leave-active {
    transition-timing-function: ease-in;
  }
}
</style>
