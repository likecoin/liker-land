<template>
  <section class="bg-like-green rounded-[24px] overflow-hidden py-[32px]">
    <div v-if="recommendedList.length" class="flex items-center justify-between px-[32px]">
      <NFTMessageIdentity
        type="creator"
        class="flex-shrink-0"
        :wallet-address="iscnOwner"
        :avatar-size="40"
        @click.native="handleHeaderAvatarClick"
      />
      <ButtonV2
        v-if="shouldShowFollowButton"
        :preset="isFollowed ? 'tertiary' : 'secondary'"
        size="mini"
        @click="handleFollowButtonClick"
      >
        {{ isFollowed ? $t('unfollow') : $t('follow') }}
      </ButtonV2>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center my-auto min-h-[450px]">
      <ProgressIndicator />
    </div>
    <div v-else class="relative mt-[24px]">
      <Swiper
        ref="recommendationSwiper"
        :options="swiperOptions"
        @slider-move="handleSliderMove"
      >
        <SwiperSlide
          v-for="nft in displayRecommendationList"
          :key="nft.classId"
          style="width: 310px;"
        >
          <NFTPortfolioItem
            class="shadow-lg mb-[12px] mx-auto"
            :class-id="nft.classId"
            :portfolio-wallet="iscnOwner"
            :should-fetch-when-visible="true"
            @click.native="handleItemClick(nft.classId)"
            @collect="handleItemCollect(nft.classId)"
          />
        </SwiperSlide>
      </Swiper>

      <div class="absolute inset-0 pointer-events-none flex justify-between items-center z-10 px-[16px]">
        <div class="absolute inset-y-0 left-0 w-[32px] bg-gradient-to-r from-like-green/25 to-like-green/0" />
        <div class="absolute inset-y-0 right-0 w-[32px] bg-gradient-to-l from-like-green/25 to-like-green/0" />
        <ButtonV2
          class="relative shadow-lg pointer-events-auto"
          preset="tertiary"
          :circle="true"
          @click="handleClickPrev"
        >
          <IconArrowLeft class="w-[20px]" />
        </ButtonV2>
        <ButtonV2
          class="relative shadow-lg pointer-events-auto"
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
import { LIKECOIN_NFT_CAMPAIGN_ITEMS } from '~/constant';

const DEFAULT_LIST = LIKECOIN_NFT_CAMPAIGN_ITEMS.slice(0, 5);

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
    isLoading: {
      type: Boolean,
      default: false,
    },
    shouldShowFollowButton: {
      type: Boolean,
      default: false,
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
    displayRecommendationList() {
      if (this.recommendedList.length) {
        return this.recommendedList;
      }
      return DEFAULT_LIST.map(nft => ({ classId: nft }));
    },
  },
  methods: {
    handleHeaderAvatarClick() {
      this.$emit('header-avatar-click');
    },
    handleFollowButtonClick() {
      this.$emit('follow-button-click');
    },
    handleItemClick(classId) {
      this.$emit('item-click', classId);
    },
    handleItemCollect(classId) {
      this.$emit('item-collect', classId);
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
