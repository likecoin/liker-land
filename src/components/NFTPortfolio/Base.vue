<template>
  <NFTGemWrapper
    :collected-count="collectedCount"
    :is-writing-nft="isWritingNFT"
  >
    <template v-slot="gem">
      <NFTPortfolioCard
        :gem-level="gem.level"
        :hover-class="gem.hoverClass"
        :display-state="displayState"
      >
        <NFTCover
          :src="imageSrc"
          :size="350"
          :bg-color="imageBgColor"
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
          ]"
        >
          <div class="flex flex-col items-center justify-center mt-[-70px]">
            <Identity
              :avatar-url="userAvatarSrc"
              :avatar-size="40"
              :is-avatar-outlined="isUserCivicLiker"
              :is-lazy-loaded="true"
            />
            <div class="flex mt-[8px]">
              <Label class="text-medium-gray">by</Label>
              <Label
                class="text-like-green ml-[4px] font-[600]"
              >{{ userDisplayName | ellipsis }}</Label>
            </div>
          </div>
          <Label preset="h5" class="mt-[12px] break-normal" align="center">{{ title }}</Label>

          <div v-if="!isPrimitive && price !== undefined" class="z-[500] flex justify-center mt-[16px]">
            <ProgressIndicator v-if="isCollecting" />
            <ButtonV2
              v-else
              preset="secondary"
              :is-disabled="!isCollectable"
              @click.stop.prevent="handleClickCollect"
            >
              <template v-if="isCollectable">{{ price | formatNumberWithLIKE }}</template>
              <template v-else>{{ $t('nft_class_uncollectible') }}</template>
              <template v-if="isCollectable" #prepend>
                <IconPrice />
              </template>
            </ButtonV2>
          </div>

          <div v-if="isWritingNFT" class="grid grid-flow-col gap-[16px] items-center justify-center mt-[16px] text-[12px]">
            <div class="flex items-center text-medium-gray">
              <IconMint />
              <div class="ml-[4px]">{{ collectedCount }}</div>
            </div>
            <div class="flex items-center text-medium-gray">
              <IconOwner />
              <div class="ml-[4px]">{{ collectorCount }}</div>
            </div>
            <div v-if="ownCount" class="flex items-center text-like-green">
              <span>{{ $t('nft_details_page_label_owning') }}</span>&nbsp;
              <span>{{ ownCount }}</span>
            </div>
          </div>
          <Label
            v-else-if="classCollectionName"
            class="mt-[16px] mx-auto rounded-full bg-shade-gray text-dark-gray font-[600] w-min px-[12px] py-[2px]"
            preset="p6"
          >{{ classCollectionName }}</Label>
        </div>
      </NFTPortfolioCard>
    </template>
  </NFTGemWrapper>
</template>

<script>
import { NFT_DISPLAY_STATE } from '~/constant';

import { ellipsis, formatNumberWithLIKE } from '~/util/ui';

import nftClassCollectionMixin from '~/mixins/nft-class-collection';

export default {
  filters: {
    ellipsis,
    formatNumberWithLIKE,
  },
  mixins: [nftClassCollectionMixin],
  props: {
    title: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: undefined,
    },
    collectedCount: {
      type: Number,
      default: 0,
    },
    collectorCount: {
      type: Number,
      default: 0,
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
      default: '#f7f7f7',
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
    classCollectionType: {
      type: String,
      default: '',
    },
    classCollectionName: {
      type: String,
      default: '',
    },
    displayState: {
      type: String,
      default: NFT_DISPLAY_STATE.DEFAULT,
    },
  },
  methods: {
    handleClickCollect(event) {
      this.$emit('collect', event);
    },
    handleCoverLoaded(event) {
      this.$emit('load-cover', event);
    },
  },
};
</script>
