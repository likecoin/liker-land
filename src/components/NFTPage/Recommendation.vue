<template>
  <div class="flex flex-col gap-[8px] bg-like-green rounded-[24px] py-[32px] overflow-hidden">
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
    <ul class="relative pl-[32px] py-[12px] flex justify-start items-start gap-[24px] w-full overflow-x-scroll overflow-y-auto scrollbar-custom">
      <li v-for="(nft, index) in recommendedList" :key="index">
        <NFTPortfolioItem
          :class-id="nft.classId"
          :portfolio-wallet="iscnOwner"
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
  },
};
</script>
