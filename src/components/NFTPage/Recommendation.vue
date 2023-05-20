<template>
  <div class="bg-like-green rounded-[24px] overflow-hidden">
    <div class="flex items-center justify-between pt-[32px] px-[32px] pb-[12px]">
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
    <ul class="relative flex justify-start items-start gap-[24px] w-full p-[32px] pt-[12px] overflow-x-scroll overflow-y-auto scrollbar-custom">
      <li v-for="(nft, index) in recommendedList" :key="index" @click="handleItemClick">
        <NFTPortfolioItem
          :class-id="nft.classId"
          :portfolio-wallet="iscnOwner"
          :should-fetch-when-visible="true"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NFTPageRecommendation',
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
  methods: {
    handleFollowButtonClick() {
      this.$emit('on-follow-button-click');
    },
    handleItemClick() {
      this.$emit('on-nft-item-click');
    },
  },
};
</script>
