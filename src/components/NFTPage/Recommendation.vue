<template>
  <section class="bg-like-green rounded-[24px] overflow-hidden py-[2rem]">
    <div
      v-if="recommendedList.length && !shouldShowDefaultRecommendation"
      class="flex items-center justify-between px-[2rem]"
    >
      <NFTMessageIdentity
        :type="hasPublisher ? 'publisher' : 'creator'"
        class="flex-shrink-0"
        :wallet-address="productOwner"
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
    <h2 v-else class="px-[2rem] text-like-cyan-light text-[1rem] font-[600]">
      {{ $t('nft_recommendation_list_other_title') }}
    </h2>

    <div
      v-if="recommendedList.length === 0"
      class="flex items-center justify-center min-h-[450px]"
    >
      <ProgressIndicator />
    </div>
    <div v-else class="relative mt-[1.5rem]">
      <client-only>
        <Swiper
          ref="recommendationSwiper"
          :options="swiperOptions"
          @slider-move="handleSliderMove"
        >
          <SwiperSlide
            v-for="nft in recommendedList"
            :key="nft.classId"
            style="width: 310px;"
          >
            <NFTBookCollectionItemCard
              v-if="nft.classId.startsWith('col')"
              :collection-id="nft.classId"
              @click-collect="$emit('item-collect', nft.classId)"
            />
            <NFTPortfolioItem
              v-else
              class="shadow-lg mb-[12px] mx-auto"
              :class-id="nft.classId"
              :portfolio-wallet="productOwner"
              :should-fetch-when-visible="true"
              ll-medium="recommend"
              :ll-source="classId"
              @click.native="handleItemClick(nft.classId)"
              @collect="handleItemCollect(nft.classId)"
            />
          </SwiperSlide>
        </Swiper>
      </client-only>
      <div
        class="absolute inset-0 pointer-events-none flex justify-between items-center z-10 px-[1rem]"
      >
        <div
          class="absolute inset-y-0 left-0 w-[32px] bg-gradient-to-r from-like-green/25 to-like-green/0"
        />
        <div
          class="absolute inset-y-0 right-0 w-[32px] bg-gradient-to-l from-like-green/25 to-like-green/0"
        />
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

import { DEFAULT_RECOMMENDATIONS_LIST } from '~/constant';

import bookstoreMixin from '~/mixins/bookstore';
import nftOrCollection from '~/mixins/nft-or-collection';
import walletMixin from '~/mixins/wallet';
import crossSellMixin from '~/mixins/cross-sell';
import { mapActions, mapGetters } from 'vuex';

const DISPLAY_ITEM_COUNT = 5;
const NFT_TYPE = {
  WRITING_NFT: 'writingNFT',
  BOOK: 'book',
  COLLECTION: 'collection',
};

export default {
  name: 'NFTPageRecommendation',
  components: {
    Swiper,
    SwiperSlide,
  },
  mixins: [bookstoreMixin, nftOrCollection, walletMixin, crossSellMixin],
  props: {
    classId: {
      type: String,
      default: '',
    },
    collectionId: {
      type: String,
      default: '',
    },
    overrideClassIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(['walletHasLoggedIn', 'walletFollowees']),
    type() {
      if (this.nftIsWritingNFT) {
        return NFT_TYPE.WRITING_NFT;
      }
      if (this.classId) {
        return NFT_TYPE.BOOK;
      }
      if (this.collectionId) {
        return NFT_TYPE.COLLECTION;
      }
      return '';
    },
    isFollowed() {
      return this.walletFollowees?.includes(this.productOwner) || false;
    },
    shouldShowFollowButton() {
      return (
        this.wallet !== this.getAddress &&
        this.walletHasLoggedIn &&
        !this.isFollowed
      );
    },
    hasPublisher() {
      if (this.type === NFT_TYPE.COLLECTION) {
        return true;
      }
      return !!this.classAuthorName;
    },
    defaultFeaturedWNFT() {
      return DEFAULT_RECOMMENDATIONS_LIST.WNFT.map(nft => ({
        classId: nft,
      }));
    },
    defaultFeaturedBooks() {
      return this.bookstoreListItemForLandingPage?.length
        ? this.bookstoreListItemForLandingPage
        : DEFAULT_RECOMMENDATIONS_LIST.BOOK.map(nft => ({ classId: nft }));
    },
    defaultFeaturedList() {
      if (this.type === NFT_TYPE.WRITING_NFT) {
        return this.defaultFeaturedWNFT;
      }
      return this.defaultFeaturedBooks;
    },
    recommendedList() {
      if (this.overrideClassIds.length) {
        return this.overrideClassIds.map(classId => ({ classId }));
      }

      if (this.shouldShowDefaultRecommendation) {
        return this.defaultFeaturedBooks;
      }
      const createdList =
        this.getCreatedNFTClassesByAddress(this.productOwner) || [];
      const createdClassIds = new Set(createdList.map(item => item.classId));

      let recommendedList = [
        ...createdList,
        ...this.defaultFeaturedList.filter(
          item =>
            item.classId !== this.classId && !createdClassIds.has(item.classId)
        ),
      ];
      const featuredSet =
        this.getNFTClassFeaturedSetByAddress(this.productOwner) || new Set();
      const hiddenSet =
        this.getNFTClassHiddenSetByAddress(this.productOwner) || new Set();

      recommendedList = recommendedList.filter(item => {
        const isNotHidden = !hiddenSet.has(item.classId);
        const isNotCurrentClass = item.classId !== this.classId;

        const isNotCurrentCollection =
          this.type === NFT_TYPE.COLLECTION
            ? item.classId !== this.collectionId
            : true;

        return isNotHidden && isNotCurrentClass && isNotCurrentCollection;
      });

      recommendedList = recommendedList.sort((a, b) => {
        const aIsFeatured = featuredSet.has(a.classId);
        const bIsFeatured = featuredSet.has(b.classId);
        if (aIsFeatured && !bIsFeatured) {
          return -1;
        }
        if (!aIsFeatured && bIsFeatured) {
          return 1;
        }
        return 0;
      });

      if (this.nftIsNFTBook) {
        recommendedList = recommendedList.sort((a, b) => {
          if (a.type === 'nft_book' && b.type !== 'nft_book') {
            return -1;
          }
          if (a.type !== 'nft_book' && b.type === 'nft_book') {
            return 1;
          }
          return 0;
        });
      }

      recommendedList = [
        ...this.crossSellProductIds?.map(classId => ({ classId })),
        ...recommendedList,
      ];

      recommendedList = Array.from(
        new Map(recommendedList.map(item => [item.classId, item])).values()
      );

      const userCollected = this.getAddress
        ? this.getCollectedNFTClassesByAddress(this.getAddress)
        : [];

      if (userCollected?.length) {
        recommendedList = recommendedList.filter(
          item =>
            !userCollected.some(
              collectedItem => collectedItem.classId === item.classId
            )
        );
      }

      return recommendedList.slice(0, DISPLAY_ITEM_COUNT);
    },
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
    shouldShowDefaultRecommendation() {
      return !this.classId && !this.collectionId && !this.productOwner;
    },
  },
  mounted() {
    if (!this.shouldShowDefaultRecommendation) {
      this.lazyFetchCreatedNFTClassesByAddress(this.productOwner);
    }
    if (
      this.shouldShowDefaultRecommendation ||
      this.type !== NFT_TYPE.WRITING_NFT
    ) {
      if (!this.bookstoreListItemForLandingPage?.length) {
        this.fetchBookstoreCMSProductsForLandingPage({
          t: this.$route.query.t,
        });
      }
    }
  },
  methods: {
    ...mapActions(['lazyFetchCreatedNFTClassesByAddress']),
    handleHeaderAvatarClick() {
      this.$emit('header-avatar-click');
    },
    handleFollowButtonClick() {
      this.$emit('follow-button-click', this.productOwner);
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
