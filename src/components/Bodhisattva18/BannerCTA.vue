<template>
  <aside
    class="sticky bottom-0 z-10 bg-[#E5DFD3] shadow-sm"
    :style="
      `background-image: linear-gradient(to right, #E5DFD3 50%, #E5DFD355 80%), url('${bannerBg}')`
    "
  >
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
        class="w-[96px] desktop:w-[120px] -mt-[32px]"
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
  },
};
</script>
