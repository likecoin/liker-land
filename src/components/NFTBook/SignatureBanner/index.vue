<template>
  <component :is="tag" class="relative rounded-[24px]">
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
        'items-center',

        'text-like-green',

        'rounded-[inherit]',
      ]"
      style="background: linear-gradient(to right, rgba(232, 252, 255, 0.70) 0%, rgba(232, 252, 255, 0.90) 60%)"
    >
      <img
        class="w-full max-w-[450px] desktop:ml-[-56px]"
        :src="signedBookImage"
      />

      <div class="px-[32px] desktop:px-[56px] py-[48px]">
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
  </component>
</template>

<script>
const signedBookImage = require('./signed-book.png');
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
    signedBookImage() {
      // TODO: Dynamically show the signed book image based on author
      return signedBookImage;
    },
    bgVideoStyle() {
      return {
        backgroundImage: `url(${videoThumbnail})`,
      };
    },
    bgVideoSources() {
      return [
        'https://books.liker.land/bodhisattva18/videos/Web-loop-promo-horizontal-transcode.mp4',
        'https://books.liker.land/bodhisattva18/videos/Web-loop-promo-horizontal-transcode.webm',
      ];
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
