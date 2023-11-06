<template>
  <CardV2
    :class="[
      'flex',
      'flex-col',

      'border-[1px]',
      'border-shade-gray',
    ]"
    :has-padding="false"
  >
    <a
      class="rounded-t-[inherit] overflow-hidden"
      :href="url || iscnUrl"
      target="_blank"
      rel="noopener"
    >
      <NFTCover
        :src="imageUrl"
        :video-src="animationUrl"
        :bg-color="imageBgColor"
      />
    </a>
    <div
      :class="[
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'whitespace-pre-line',
        'break-normal',
        'px-[24px]',
        'pt-[48px]',
        'py-[24px]',
        'relative',
      ]"
    >
      <div class="flex flex-col items-center justify-center mt-[-70px] w-full">
        <Identity
          :avatar-url="avatarUrl"
          :avatar-size="avatarSize"
          :is-avatar-outlined="isAvatarOutlined"
        />
        <NuxtLink
          class="flex mt-[8px] w-full"
          :to="iscnOwner ? localeLocation({
            name: 'id',
            params: { id: iscnOwner },
            query: { tab: 'created' },
          }) : ''"
          @click.native="onClickAvatar"
        >
          <Label
            class="w-full text-like-green font-[600]"
            content-class="min-w-0"
            align="center"
          >
            <span class="text-medium-gray">by</span>&nbsp;
            <span class="truncate">{{ displayName }}</span>
          </Label>
        </NuxtLink>

        <div v-if="iscnWorkAuthor" class="my-[1rem] flex flex-col items-center text-center min-w-0 w-full">
          <span class="text-like-cyan-gray text-10">{{ $t('identity_type_author') }}</span>
          <span class="text-dark-gray truncate w-full">{{ iscnWorkAuthor }}</span>
        </div>
      </div>
      <Label
        class="mt-[12px]"
        content-class="line-clamp-2"
        preset="h5"
        align="center"
        :text="nftName"
      />
      <Label
        class="mt-[12px]"
        content-class="line-clamp-4"
        preset="p5"
        :text="nftDescription | ellipsisDescription"
      />

      <Separator v-if="isPrimitive || url" class="my-[16px]" />

      <NFTViewOptionList
        :url="url"
        :content-urls="contentUrls"
        :iscn-url="iscnUrl"
        :is-nft-book="isNftBook"
        :is-content-viewable="isContentViewable"
        @view-content="handleClickViewContent"
        @view-content-url="handleClickViewContentURL"
      />

      <div
        v-if="isWritingNFT"
        class="grid grid-flow-col gap-[16px] items-center justify-center mt-[18px] text-[12px]"
      >
        <div class="flex items-center text-medium-gray">
          <IconMint />
          <div class="ml-[4px]">{{ collectedCount }}</div>
        </div>
        <div class="flex items-center text-medium-gray">
          <IconOwner />
          <div class="ml-[4px]">{{ collectorCount }}</div>
        </div>
        <div v-if="nftPrice > 0" class="flex items-center text-like-green">
          <IconPrice />
          <div class="ml-[4px]">{{ nftPrice | formatNumberWithUSD }}</div>
        </div>
      </div>
      <Label
        v-else-if="classCollectionName"
        class="mt-[16px] mx-auto rounded-full bg-shade-gray text-dark-gray font-[600] w-min px-[12px] py-[2px]"
        preset="p6"
      >{{ classCollectionName }}</Label>

    </div>
  </CardV2>
</template>

<script>
import { ellipsis, ellipsisDescription, formatNumberWithUSD } from '~/util/ui';

import nftClassCollectionMixin from '~/mixins/nft-class-collection';

export default {
  name: 'NFTPagePreviewCard',
  filters: {
    ellipsis,
    ellipsisDescription,
    formatNumberWithUSD,
  },
  mixins: [nftClassCollectionMixin],
  props: {
    url: {
      type: String,
      default: undefined,
    },
    contentUrls: {
      type: Array,
      default: () => [],
    },

    // BackgroundImg
    imageBgColor: {
      type: String,
      default: undefined,
    },
    imageUrl: {
      type: String,
      default: undefined,
    },
    animationUrl: {
      type: String,
      default: undefined,
    },

    // Identity
    avatarUrl: {
      type: String,
      default: undefined,
    },
    avatarSize: {
      type: Number,
      default: 40,
    },
    isAvatarOutlined: {
      type: Boolean,
      default: false,
    },

    // Creater Info
    iscnOwner: {
      type: String,
      default: undefined,
    },
    iscnWorkAuthor: {
      type: String,
      default: undefined,
    },
    iscnUrl: {
      type: String,
      default: undefined,
    },
    displayName: {
      type: String,
      default: undefined,
    },

    // NFT Info
    nftName: {
      type: String,
      default: undefined,
    },
    nftDescription: {
      type: String,
      default: undefined,
    },
    nftPrice: {
      type: Number,
      default: undefined,
    },
    classCollectionType: {
      type: String,
      default: '',
    },
    classCollectionName: {
      type: String,
      default: '',
    },

    // Mint Info
    collectedCount: {
      type: Number,
      default: 0,
    },
    collectorCount: {
      type: Number,
      default: 0,
    },

    isContentViewable: {
      type: Boolean,
      default: true,
    },
    isNftBook: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClickViewContent() {
      this.$emit('view-content');
    },
    handleClickViewContentURL(e, contentUrl, type) {
      if (type === 'pdf') {
        e.preventDefault();
        this.$router.push(
          this.localeLocation({ name: 'reader', query: { src: contentUrl } })
        );
      }
      this.$emit('view-content-url', type);
    },
    onClickAvatar(e) {
      this.$emit('click-avatar', e);
    },
  },
};
</script>
