<template>
  <section class="bg-like-green rounded-[24px] overflow-hidden py-[32px]">
    <div class="flex items-center justify-between px-[32px]">
      <NFTMessageIdentity
        type="creator"
        class="flex-shrink-0"
        :wallet-address="iscnOwner"
        :avatar-size="40"
      />
      <ButtonV2
        :preset="isFollowed ? 'tertiary' : 'secondary'"
        size="mini"
        @click="handleFollowButtonClick"
      >
        {{ isFollowed ? $t('unfollow') : $t('follow') }}
      </ButtonV2>
    </div>

    <div
      v-if="recommendedList.length > 0"
      class="relative mt-[24px]"
    >
      <Swiper
        ref="recommendationSwiper"
        :options="swiperOptions"
        @slider-move="handleSliderMove"
      >
        <SwiperSlide
          v-for="nft in recommendedList"
          :key="nft.classId"
          style="width: 310px; /* NOTE: Set width in style for auto slide per view calculation */"
        >
          <NFTPortfolioItem
            class="shadow-lg mb-[12px] mx-auto"
            :class-id="nft.classId"
            :portfolio-wallet="iscnOwner"
            :should-fetch-when-visible="true"
            @click="handleItemClick"
          />
        </SwiperSlide>
      </Swiper>

      <div class="absolute inset-0 pointer-events-none flex justify-between items-center z-10 px-[16px]">
        <div class="absolute inset-y-0 left-0 w-[32px] bg-gradient-to-r from-like-green/25 to-like-green/0" />
        <div class="absolute inset-y-0 right-0 w-[32px] bg-gradient-to-l from-like-green/25 to-like-green/0" />
        <ButtonV2
          class="relative pointer-events-auto shadow-lg"
          preset="tertiary"
          :circle="true"
          @click="handleClickPrev"
        >
          <IconArrowLeft class="w-[20px]" />
        </ButtonV2>
        <ButtonV2
          class="relative pointer-events-auto shadow-lg"
          preset="tertiary"
          :circle="true"
          @click="handleClickNext"
        >
          <IconArrowLeft class="w-[20px] rotate-180" />
        </ButtonV2>
      </div>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  name: 'NFTPageRecommendation',
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    iscnOwner: {
      type: String,
      default: undefined,
    },
    isFollowed: {
      type: Boolean,
      default: false,
    },
    recommendedList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    swiperOptions() {
      return {
        slidesPerView: 'auto',
        slidesOffsetAfter: 32,
        slidesOffsetBefore: 32,
        spaceBetween: 24,
      };
    },
    swiper() {
      return this.$refs.recommendationSwiper.$swiper;
    },
  },
  methods: {
    handleFollowButtonClick() {
      this.$emit('on-follow-button-click');
    },
    handleItemClick() {
      this.$emit('on-nft-item-click');
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
