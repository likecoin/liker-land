<template>
  <NFTPortfolioCard :display-state="displayState">
    <NFTBookCoverWithFrame
      class="w-full rounded-t-[inherit] !rounded-b-[0]"
      :src="imageSrc"
      :alt="title"
      :cover-resize="350"
      class-aspect-ratio="aspect-[1]"
      :background-color="imageBgColor"
      @load="handleCoverLoaded"
    />

    <div
      :class="[
        'flex',
        'flex-col',
        'text-center',
        'whitespace-pre-line',
        'px-[24px]',
        'pt-[48px]',
        'py-[24px]',
        'bg-white',
        'relative',
        'rounded-b-[inherit] !rounded-t-[0]',
      ]"
    >
      <div class="flex flex-col items-center justify-center mt-[-70px]">
        <Identity
          :avatar-url="userAvatarSrc"
          :avatar-size="40"
          :is-avatar-outlined="isUserCivicLiker"
          :is-lazy-loaded="true"
        />
        <Label
          class="w-full mt-[8px] text-like-green font-[600]"
          content-class="min-w-0"
          align="center"
        >
          <span class="text-medium-gray">by</span>&nbsp;
          <span class="truncate">{{ userDisplayName }}</span>
        </Label>
      </div>
      <Label preset="h5" class="mt-[12px] break-normal" align="center">{{
        title
      }}</Label>

      <div class="z-[48] flex justify-center mt-[16px]">
        <ProgressIndicator v-if="isCollecting" />

        <div
          v-else-if="portfolioTab === 'created' || ownCount"
          class="flex w-full gap-[8px]"
        >
          <NFTViewOptionList
            class="flex-grow"
            :class-id="classId"
            :url="externalUrl"
            :content-urls="contentUrls"
            :iscn-url="iscnUrl"
            :is-nft-book="isNftBook"
            :is-content-viewable="isContentViewable"
            :is-content-downloadable="isContentDownloadable"
            @view-content="handleClickViewContent"
          />
        </div>
        <CollectButton
          v-else-if="portfolioTab !== 'collected'"
          class="text-medium-gray"
          :button-text="collectButtonText"
          :is-collectable="isCollectable"
          :collect-expiry-time="collectExpiryTime"
          @click-collect-button="handleClickCollect"
        />
      </div>
    </div>
  </NFTPortfolioCard>
</template>

<script>
import { NFT_DISPLAY_STATE } from '~/constant';

import { ellipsis, formatNumberWithUSD } from '~/util/ui';

import nftClassCollectionMixin from '~/mixins/nft-class-collection';

export default {
  filters: {
    ellipsis,
    formatNumberWithUSD,
  },
  mixins: [nftClassCollectionMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: undefined,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isCollecting: {
      type: Boolean,
      default: false,
    },
    imageSrc: {
      type: String,
      default: '',
    },
    imageBgColor: {
      type: String,
      default: undefined,
    },
    userAvatarSrc: {
      type: String,
      default: '',
    },
    userDisplayName: {
      type: String,
      default: '',
    },
    isUserCivicLiker: {
      type: Boolean,
      default: false,
    },
    ownCount: {
      type: Number,
      default: 0,
    },
    isCollectable: {
      type: Boolean,
      default: false,
    },
    displayState: {
      type: String,
      default: NFT_DISPLAY_STATE.DEFAULT,
    },
    isNftBook: {
      type: Boolean,
      default: false,
    },
    portfolioTab: {
      type: String,
      default: undefined,
    },
    externalUrl: {
      type: String,
      default: '',
    },
    iscnUrl: {
      type: String,
      default: '',
    },
    contentUrls: {
      type: Array,
      default: () => [],
    },
    collectExpiryTime: {
      type: Number,
      default: 0,
    },
    isContentViewable: {
      type: Boolean,
      default: false,
    },
    isContentDownloadable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    collectButtonText() {
      if (this.isFree && this.ownCount > 0) {
        return this.$t('nft_class_claimed');
      }

      if (this.isCollectable) {
        return formatNumberWithUSD(this.price);
      }

      if (this.ownCount > 0) {
        return this.$t('nft_class_collected');
      }

      return this.$t('nft_class_uncollectible');
    },
  },
  methods: {
    handleClickCollect(event) {
      this.$emit('collect', event);
    },
    handleCoverLoaded(event) {
      this.$emit('load-cover', event);
    },
    handleClickViewContent() {
      this.$emit('view-content');
    },
  },
};
</script>
