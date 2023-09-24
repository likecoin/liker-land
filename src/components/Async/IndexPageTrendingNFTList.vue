<template>
  <IndexPageTrendingNFTListPlaceholder v-if="!classIds.length" />
  <div
    v-else
    class="index-page-trending-nft-list"
  >
    <Swiper
      ref="swiper"
      :options="swiperOptions"
      @slider-move="handleSliderMove"
    >
      <SwiperSlide
        v-for="classId in classIds"
        :key="classId"
        class="px-[40px] sm:px-0"
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

    <div class="sm:absolute inset-0 pointer-events-none z-10 flex justify-between sm:items-center p-[0.5rem] laptop:px-[48px]">
      <ButtonV2
        class="relative shadow-lg pointer-events-auto scale-75 sm:scale-100"
        preset="tertiary"
        :circle="true"
        size="small"
        @click="handleClickPrev"
      >
        <IconArrowLeft class="w-[20px]" />
      </ButtonV2>
      <ButtonV2
        class="relative shadow-lg pointer-events-auto scale-75 sm:scale-100"
        preset="tertiary"
        :circle="true"
        size="small"
        @click="handleClickNext"
      >
        <IconArrowLeft class="w-[20px] rotate-180" />
      </ButtonV2>
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
  methods: {
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

/* Override swiper styles for this component */
.index-page-trending-nft-list .swiper-container {
  overflow: unset;
}
</style>
