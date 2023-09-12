<template>
  <div
    v-if="!classIds.length"
    class="px-[32px] min-h-[425px]"
  >
    <ul
      :class="[
        'grid',
        'laptop:grid-cols-2 desktop:grid-cols-3',
        'gap-[40px]',
        'w-full',
        'max-w-[1024px]',
        'min-h-[inherit]',
        'mx-auto',
      ]"
    >
      <li
        v-for="index in 3"
        :key="`placeholder-${index}`"
        :class="[
          { 'hidden': index !== 1 },
          { 'laptop:block': index === 2 },
          { 'desktop:block': index === 3 },
          'bg-shade-gray',
          'rounded-[14px]',
          'animate-pulse',
        ]"
      />
    </ul>
  </div>
  <div v-else ref="root" class="relative">
    <Swiper
      ref="swiper"
      :options="swiperOptions"
      @ready="handleSwiperReady"
      @slider-move="handleSliderMove"
    >
      <SwiperSlide
        v-for="classId in classIds"
        :key="classId"
        style="
          width: 360px; /* NOTE: Set width in style for auto slide per view calculation */
        "
      >
        <NFTCampaignItem
          :class-id="classId"
          :is-single-column="true"
        />
      </SwiperSlide>
    </Swiper>

    <div class="sm:absolute inset-0 pointer-events-none z-10">
      <div class="flex justify-between sm:items-center w-full max-w-[1024px] h-full mx-auto p-[0.5rem]">
        <ButtonV2
          class="relative shadow-lg pointer-events-auto scale-75 sm:scale-100"
          preset="tertiary"
          :circle="true"
          @click="handleClickPrev"
        >
          <IconArrowLeft class="w-[20px]" />
        </ButtonV2>
        <ButtonV2
          class="relative shadow-lg pointer-events-auto scale-75 sm:scale-100"
          preset="tertiary"
          :circle="true"
          @click="handleClickNext"
        >
          <IconArrowLeft class="w-[20px] rotate-180" />
        </ButtonV2>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'IndexPageTrendingNFTList',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    classIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    swiperOptions() {
      return {
        slidesPerView: 'auto',
        slidesOffsetAfter: 8,
        slidesOffsetBefore: 8,
        spaceBetween: 40,
        centeredSlides: true,
        breakpoints: {
          1024: {
            centeredSlides: false,
          },
        },
      };
    },
    swiper() {
      return this.$refs.swiper?.$swiper;
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleSwiperReady() {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    },
    handleResize() {
      window.requestAnimationFrame(() => {
        const width = this.$refs.root.offsetWidth;
        const slidesOffset = Math.max(
          this.swiperOptions.slidesOffsetAfter,
          (width - 1024) / 2
        );
        this.swiper.params.slidesOffsetBefore = slidesOffset + 64;
        this.swiper.params.slidesOffsetAfter =
          slidesOffset -
          this.swiperOptions.spaceBetween * (this.classIds.length - 1);
        this.swiper.update();
      });
    },
    handleClickPrev() {
      this.$emit('slide-prev');
      this.swiper.slidePrev();
    },
    handleClickNext() {
      this.$emit('slide-next');
      this.swiper.slideNext();
    },
    handleSliderMove() {
      this.$emit('slider-move');
    },
  },
};
</script>
<style lang="scss">
@import 'swiper/swiper.scss';
</style>
