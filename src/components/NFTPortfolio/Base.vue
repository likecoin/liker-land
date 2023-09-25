<template>
  <NFTGemWrapper :is-nft-book="isNftBook" :class-id="classId">
    <template #default="gem">
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

          <div v-if="(!isPrimitive && price !== undefined) || price > 0" class="z-[48] flex justify-center mt-[16px]">
            <ProgressIndicator v-if="isCollecting" />
            <CollectButton
              v-else-if="!isCollectedTab"
              class="text-medium-gray"
              :button-text="collectButtonText"
              :is-collectable="isCollectable"
              :collect-expiry-time="collectExpiryTime"
              @click-collect-button="handleClickCollect"
            />
            <NFTViewOptionList
              v-else
              :url="externalUrl"
              :iscn-url="iscnUrl"
              :is-nft-book="isNftBook"
              @view-content="handleClickViewContent"
            />
          </div>

          <div class="grid grid-flow-col gap-[16px] items-center justify-center mt-[16px] text-[12px]">
            <div class="flex items-center text-medium-gray">
              <IconMint />
              <div class="ml-[4px]">{{ collectedCount }}</div>
            </div>
            <div class="flex items-center text-medium-gray">
              <IconOwner />
              <div class="ml-[4px]">{{ collectorCount }}</div>
            </div>
            <div v-if="isCollectedTab && isCollectable" class="flex items-center text-like-green">
              <IconPrice />
              <div class="ml-[4px]">{{ price | formatNumberWithLIKE }}</div>
            </div>
            <div v-if="ownCount" class="flex items-center text-like-green">
              <span>{{ $t('nft_details_page_label_owning') }}</span>&nbsp;
              <span>{{ ownCount }}</span>
            </div>
          </div>
          <Label
            v-if="classCollectionName"
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
    isNftBook: {
      type: Boolean,
      default: false,
    },
    isCollectedTab: {
      type: Boolean,
      default: false,
    },
    externalUrl: {
      type: String,
      default: '',
    },
    iscnUrl: {
      type: String,
      default: '',
    },
    collectExpiryTime: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    collectButtonText() {
      return this.isCollectable
        ? formatNumberWithLIKE(this.price)
        : this.$t('nft_class_uncollectible');
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
