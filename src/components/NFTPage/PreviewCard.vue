<template>
  <CardV2
    :class="[
      'flex',
      'flex-col',

      'overflow-hidden',

      'border-[1px]',
      'border-shade-gray',
    ]"
    :has-padding="false"
  >
    <NFTCover
      :src="imageUrl"
      :bg-color="imageBgColor"
    />
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
      <div class="flex flex-col items-center justify-center mt-[-70px]">
        <Identity
          :avatar-url="avatarUrl"
          :avatar-size="avatarSize"
          :is-avatar-outlined="isAvatarOutlined"
        />
        <NuxtLink
          class="flex mt-[8px]"
          :to="iscnOwner ? localeLocation({
            name: 'id',
            params: { id: iscnOwner },
            query: { tab: 'created' },
          }) : ''"
        >
          <Label class="text-medium-gray" text="by" />
          <Label class="text-like-green ml-[4px] font-600">{{
            displayName | ellipsis
          }}</Label>
        </NuxtLink>
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

      <ButtonV2
        v-if="url"
        preset="outline"
        :text="isContentViewable ? $t('nft_details_page_button_view') : $t('nft_details_page_button_collect_to_view')"
        :href="isContentViewable ? url : ''"
        target="_blank"
        :is-disabled="!isContentViewable"
        @click="handleClickViewContent"
      >
        <template #prepend>
          <IconArticle />
        </template>
        <template #append>
          <IconLinkExternal />
        </template>
      </ButtonV2>
      <ButtonV2
        v-else
        preset="outline"
        :text="$t('nft_details_page_section_metadata_iscn')"
        :href="iscnUrl"
        target="_blank"
        @click="handleClickViewContent"
      >
        <template #prepend>
          <IconISCN class="w-[20px] text-dark-gray" />
        </template>
        <template #append>
          <IconLinkExternal />
        </template>
      </ButtonV2>

      <template v-if="isContentViewable">
        <ButtonV2
          v-for="contentUrl in contentUrls"
          :key="contentUrl"
          class="mt-[12px]"
          preset="outline"
          :text="$t(`nft_details_page_button_view_${getContentUrlType(contentUrl)}`)"
          :href="contentUrl"
          target="_blank"
          @click="handleClickViewContentUrls(getContentUrlType(contentUrl))"
        >
          <template #prepend>
            <IconArticle />
          </template>
          <template #append>
            <IconLinkExternal />
          </template>
        </ButtonV2>
      </template>

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
          <div class="ml-[4px]">{{ nftPrice | formatNumberWithLIKE }}</div>
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
import { ellipsis, ellipsisDescription, formatNumberWithLIKE } from '~/util/ui';

import nftClassCollectionMixin from '~/mixins/nft-class-collection';

export default {
  name: 'ItemCard',
  filters: {
    ellipsis,
    ellipsisDescription,
    formatNumberWithLIKE,
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
  },
  computed: {
    formattedNFTPrice() {
      return `${this.nftPrice || '-'} LIKE`;
    },
  },
  methods: {
    getContentUrlType(url) {
      if (url.includes('epub')) return 'epub';
      if (url.includes('pdf')) return 'pdf';
      return 'unknown';
    },
    handleClickCollect() {
      this.$emit('collect');
    },
    handleClickViewContent() {
      // Allow viewing iscn url if no url exists
      if (!this.url || this.isContentViewable) {
        this.$emit('view-content');
      }
    },
    handleClickViewContentUrls(type) {
      this.$emit('view-content-urls', type);
    },
  },
};
</script>
