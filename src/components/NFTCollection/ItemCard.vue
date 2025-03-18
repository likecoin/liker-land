<template>
  <div :class="['flex', 'flex-col', 'justify-center']">
    <NFTPageChannelBlock
      v-if="isDetailsPreset"
      class="laptop:hidden mb-[24px] self-start mt-[12px]"
      :is-collection="true"
    />
    <component
      :is="componentTag"
      :class="[
        'relative',
        'flex',
        'flex-col',
        'w-full',
        'rounded-[32px]',
        'px-[16px] sm:px-[32px]',
        { 'laptop:px-[20px]': !isCompactPreset },
        'transition-all',
        'duration-200',
        bgStyle,
        componentClass,
        'mt-[48px]',
        { group: !isDetailsPreset },
        'border-like-collection',
        'border-[2px]',
      ]"
      v-bind="componentProps"
    >
      <div
        :class="[
          isDetailsPreset ? 'laptop:items-start' : 'laptop:items-end',
          'flex',
          'flex-col',
          { 'laptop:flex-row': !isCompactPreset },
          { '!items-center': isCompactPreset },
          { 'laptop:gap-[36px]': !isCompactPreset },
        ]"
      >
        <client-only v-if="!isDetailsPreset">
          <lazy-component
            class="absolute inset-0 pointer-events-none -top-full"
            @show.once="fetchInfo"
          />
        </client-only>
        <div
          :class="[
            'flex',
            'flex-col',
            'items-center',
            'gap-[24px]',
            'shrink-0',

            'w-full',
            'laptop:max-w-[200px]',
          ]"
        >
          <NFTCover
            v-if="videoSrc"
            :class="['mt-[-48px]', coverClasses]"
            :is-nft-book="true"
            :src="imageSrc || collectionImageUrl"
            :should-resize-src="shouldResizeSrc"
            :video-src="videoSrc"
            :size="200"
            :is-collection="true"
            :alt="collectionName"
          />
          <NFTBookCover
            v-else
            :class="['mt-[-48px]', coverClasses]"
            :src="imageSrc || collectionImageUrl"
            :alt="collectionName"
            :resize="200"
          />
          <Label
            class="!text-[12px] text-medium-gray"
            :text="$t('nft_collection_num_of_books', { num: classIds.length })"
          />

          <div class="hidden w-full laptop:block">
            <slot name="column-left" />
          </div>
        </div>
        <!-- Info column -->
        <div
          :class="[
            'relative',
            'flex',
            'flex-col',
            'items-center',
            { 'laptop:items-start': !isCompactPreset },
            'justify-start',
            'py-[32px]',
            'gap-[12px]',
            'grow',
          ]"
        >
          <NFTPageChannelBlock
            v-if="isDetailsPreset"
            class="hidden laptop:flex absolute top-[-24px] left-0"
            :is-collection="true"
          />
          <Label
            v-if="isNew"
            class="text-like-cyan"
            :text="$t('campaign_nft_book_just_arrived')"
          />
          <Label
            class="text-like-collection"
            :text="$t('nft_collection_label')"
          />
          <h1
            :class="['text-[24px]', 'font-600', titleStyle]"
            v-text="collectionName"
          />
          <Markdown :md-string="collectionDescription" />
          <NFTBookSpecTable class="mt-[12px]">
            <client-only>
              <li>
                <NuxtLink
                  class="flex items-center text-like-green group"
                  :to="
                    collectionOwner
                      ? localeLocation({
                          name: 'id',
                          params: { id: collectionOwner },
                          query: { tab: 'created' },
                        })
                      : ''
                  "
                  @click.native.stop="onClickAvatar"
                >
                  <Identity
                    class="shrink-0"
                    :avatar-url="collectionCreatorAvatar"
                    :avatar-size="42"
                    :is-avatar-disabled="true"
                    :is-lazy-loaded="true"
                  />
                  <div class="flex flex-col justify-start ml-[8px] min-w-0">
                    <NFTBookSpecTableLabel
                      :text="$t('identity_type_distributor')"
                    />
                    <span
                      :class="[
                        'group-hover:underline',
                        'font-[600]',
                        'truncate',
                        displayNameStyle,
                      ]"
                      >{{ collectionCreatorDisplayName }}</span
                    >
                  </div>
                </NuxtLink>
              </li>
            </client-only>
          </NFTBookSpecTable>
          <NFTBookSpecTable class="mt-[12px]">
            <NFTBookSpecTableItemDateReleased
              :is-published-date="false"
              :date="collection.timestamp"
              :is-campaign="preset === 'campaign'"
            />
            <NFTBookSpecTableItemAvailableFormat
              :content-types="contentTypes"
            />
            <NFTBookSpecTableItemAccessMethod
              :is-downloadable="isDownloadable"
              @clickTooltip="$emit('clickTooltip')"
            />
          </NFTBookSpecTable>
          <div
            class="relative pt-[36px] flex flex-col items-center w-full laptop:hidden"
          >
            <div
              class="absolute top-0 left-0 right-0 mx-[-16px] border-b-[1px] border-[#EBEBEB]"
            />
            <slot name="column-edition-select" />
          </div>
          <div class="flex-col hidden w-full laptop:flex">
            <slot name="column-edition-select" />
          </div>
        </div>
        <div
          :class="[
            'relative',

            'flex laptop:hidden',
            'flex-col',
            'items-center',
            'gap-[24px]',

            'pt-[36px]',
            'pb-[48px]',
          ]"
        >
          <div
            class="absolute top-0 left-0 right-0 mx-[-16px] border-b-[1px] border-[#EBEBEB]"
          />
          <slot name="column-left" />
        </div>
      </div>
    </component>

    <!-- Footer -->
    <div
      v-if="!isCompactPreset"
      class="flex justify-between px-[8px] sm:px-[24px] mt-[20px]"
    >
      <template v-if="!isDetailsPreset">
        <Label
          v-if="isLoading"
          preset="p5"
          class="text-medium-gray"
          :text="$t('nft_details_page_label_item_loading')"
        />
        <Label
          v-else-if="collectionAvailablePriceLabel"
          preset="p5"
          class="text-like-green-dark"
          :text="collectionAvailablePriceLabel"
        />
        <Label
          v-else
          preset="p5"
          class="text-medium-gray"
          :text="$t('nft_details_page_label_sold_out')"
        />
      </template>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

import { getContentUrlType } from '~/util/misc';
import { ellipsis } from '~/util/ui';

import collectionMixin from '~/mixins/nft-collection';

const PRESET_TYPE = {
  SHELF: 'shelf', // (Landing page) shelf style
  CAMPAIGN: 'campaign', // (Landing page) like-green bg
  COMPACT: 'compact', // (Landing page) compact style
  DEFAULT: 'default', // (All books page) white bg
  DETAILS: 'details', // (Class details page) Expand all information
};

export default {
  filters: {
    ellipsis,
  },
  mixins: [collectionMixin],
  props: {
    collectionId: {
      type: String,
      required: true,
    },
    preset: {
      type: String,
      default: PRESET_TYPE.DEFAULT,
    },
    shelfClass: {
      type: [Array, String],
      default: () => [],
    },
    imageSrc: {
      type: String,
      default: '',
    },
    videoSrc: {
      type: String,
      default: '',
    },
    shouldResizeSrc: {
      type: Boolean,
      default: true,
    },
    isLinkDisabled: {
      type: Boolean,
      default: false,
    },
    componentClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(['getIsHideNFTBookDownload']),
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.collectionOwner)?.displayName ||
        this.collectionOwner
      );
    },
    isShelfPreset() {
      return this.preset === PRESET_TYPE.SHELF;
    },
    isDetailsPreset() {
      return this.preset === PRESET_TYPE.DETAILS;
    },
    isCompactPreset() {
      return this.preset === PRESET_TYPE.COMPACT;
    },
    isNew() {
      // True if within 30 days
      return (
        new Date().getTime() - new Date(this.collection?.timestamp) <
        1000 * 60 * 60 * 24 * 30
      );
    },
    isDownloadable() {
      return this.classIds.every(
        classId => !this.getIsHideNFTBookDownload(classId)
      );
    },
    contentTypes() {
      const contentURLs = this.classIds
        .map(classId => {
          const { parent } = this.getNFTClassMetadataById(classId) || {};
          const iscnId = parent?.iscnIdPrefix || parent?.iscn_id_prefix;
          const data = this.getISCNMetadataById(iscnId);
          if (!data || data instanceof Promise) return undefined;
          return data.contentMetadata?.sameAs || [];
        })
        .flat();
      const types = [];
      contentURLs.forEach(url => {
        types.push(getContentUrlType(url));
      });
      return [...new Set(types.filter(type => type !== 'unknown'))];
    },
    isLinkComponent() {
      return !this.isLinkDisabled && !this.isDetailsPreset;
    },
    componentTag() {
      if (!this.isLinkComponent) return 'div';
      return 'NuxtLink';
    },
    componentProps() {
      if (!this.isLinkComponent) return {};
      return {
        to: this.collectionRoute,
      };
    },
    bgStyle() {
      switch (this.preset) {
        case PRESET_TYPE.CAMPAIGN:
          return 'bg-like-green hover:shadow-lg';
        case PRESET_TYPE.COMPACT:
        case PRESET_TYPE.DEFAULT:
          return 'bg-white hover:shadow-md';
        case PRESET_TYPE.DETAILS:
          return 'bg-white';
        default:
          return '';
      }
    },
    coverClasses() {
      const classes = ['shadow-lg'];
      if (!this.isDetailsPreset) {
        classes.push(
          this.isShelfPreset ? 'hover:shadow-2xl' : 'group-hover:shadow-2xl',
          this.isShelfPreset ? 'hover:scale-105' : 'group-hover:scale-105',
          'active:scale-100',
          'transition-all'
        );
      }
      return classes;
    },
    titleStyle() {
      if (this.preset === PRESET_TYPE.CAMPAIGN) return 'text-white';
      return 'text-dark-gray';
    },
    descriptionStyle() {
      switch (this.preset) {
        case PRESET_TYPE.CAMPAIGN:
          return 'text-like-cyan-pale line-clamp-2';
        case PRESET_TYPE.COMPACT:
        case PRESET_TYPE.DEFAULT:
          return 'text-dark-gray line-clamp-2';
        case PRESET_TYPE.DETAILS:
          return 'text-dark-gray';
        default:
          return '';
      }
    },
    displayNameStyle() {
      if (this.preset === PRESET_TYPE.CAMPAIGN) return 'text-white';
      return 'text-dark-gray';
    },
  },
  methods: {
    async fetchInfo() {
      try {
        this.isLoading = true;
        await this.lazyFetchNFTCollectionInfo();
      } finally {
        this.isLoading = false;
      }
    },
    onClickAvatar() {
      this.$emit('click-avatar', this.collectionOwner);
    },
  },
};
</script>
