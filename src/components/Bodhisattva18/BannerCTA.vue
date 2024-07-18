<template>
  <aside
    :class="[
      { sticky: isFlowing },
      'bottom-0',
      'z-10',
      'bg-[#E5DFD3]',
      'shadow-sm',
    ]"
    :style="
      `background-image: linear-gradient(to right, #E5DFD3 50%, #E5DFD355 80%), url('${bannerBg}')`
    "
  >
    <ButtonV2
      class="absolute bottom-full right-0 m-[8px] shadow-md"
      size="tiny"
      :circle="true"
      @click="close"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.8383 3.74744C15.2289 3.35691 15.862 3.35691 16.2525 3.74744C16.6431 4.13796 16.6431 4.77113 16.2525 5.16165L11.4142 10L16.2525 14.8383C16.6431 15.2289 16.6431 15.862 16.2525 16.2526C15.862 16.6431 15.2289 16.6431 14.8383 16.2526L9.99998 11.4142L5.16164 16.2526C4.77111 16.6431 4.13795 16.6431 3.74742 16.2526C3.3569 15.862 3.3569 15.2289 3.74742 14.8383L8.58577 10L3.74742 5.16165C3.3569 4.77113 3.3569 4.13796 3.74742 3.74744C4.13795 3.35691 4.77111 3.35691 5.16164 3.74744L9.99998 8.58578L14.8383 3.74744Z"
          fill="currentColor"
        />
      </svg>
    </ButtonV2>

    <div
      :class="[
        'flex',
        'justify-between',
        'items-center',

        'w-full',
        'max-w-[768px]',
        'mx-auto',

        'text-[#573f16]',
        'font-serif',
        'font-[600]',

        'bg-center',
      ]"
    >
      <div
        :class="[
          'flex',
          'justify-start',
          'items-center',
          'gap-[24px]',
          'flex-grow',

          'px-[16px]',
          'py-[16px]',
        ]"
      >
        <div>
          <div class="text-[12px] desktop:text-[20px] desktop:inline">
            {{ $t('bodhisattva18_flowing_cta_text_line1') }}
          </div>
          <div class="text-[14px] desktop:text-[20px] desktop:inline">
            {{ $t('bodhisattva18_flowing_cta_text_line2') }}
          </div>
        </div>

        <ButtonV2
          class="text-[14px]"
          :text="$t('bodhisattva18_flowing_cta_button_text')"
          href="https://books.liker.land/bodhisattva18/?utm_source=likerlandweb"
          preset="outline"
          theme="glow"
          size="small"
          target="_blank"
          @click="$emit('click-button')"
        />
      </div>

      <img
        class="relative w-[96px] desktop:w-[120px] -mt-[32px]"
        :src="src"
        :alt="$t('bodhisattva18_flowing_cta_alt')"
      />
    </div>
  </aside>
</template>

<script>
import bannerBg from '~/assets/images/bodhisattva18/banner-bg.jpg';

const getImageFrameSrc = require.context(
  '~/assets/images/bodhisattva18/3d-book-img-sequence',
  false,
  /\.png$/
);

export default {
  name: 'Bodhisattva18FlowingCTA',
  data() {
    return {
      index: 1,
      isFlowing: true,
    };
  },
  computed: {
    src() {
      return getImageFrameSrc(
        `./${this.index.toString().padStart(3, '0')}.png`
      );
    },
    bannerBg() {
      return bannerBg;
    },
  },
  mounted() {
    this.startRotation();
  },
  beforeDestroy() {
    this.stopRotation();
  },
  methods: {
    stopRotation() {
      clearInterval(this.interval);
      this.index = 1;
    },
    startRotation() {
      this.interval = setInterval(() => {
        this.index = ((this.index + 6) % 167) + 1;
      }, 200);
    },
    close() {
      this.isFlowing = false;
    },
  },
};
</script>
