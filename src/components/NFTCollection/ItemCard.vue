<template>
  <div :class="['flex', 'flex-col', 'justify-center']">
    <component
      :is="componentTag"
      :class="[
        'relative',
        'flex',
        isDetailsPreset ? 'laptop:items-start' : 'laptop:items-end',
        'flex-col',
        { 'laptop:flex-row': !isCompactPreset },
        { '!items-center': isCompactPreset },
        { 'laptop:gap-[36px]': !isCompactPreset },
        'w-full',
        'rounded-[32px]',
        'px-[16px] sm:px-[32px]',
        { 'laptop:px-[48px]': !isCompactPreset },
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
      <client-only v-if="!isDetailsPreset">
        <lazy-component
          class="absolute inset-0 pointer-events-none -top-full"
          @show.once="fetchInfo"
        />
      </client-only>
      <div class="flex flex-col items-center shrink-0">
        <NFTCover
          :class="['mt-[-48px]', coverClasses]"
          :is-nft-book="true"
          :src="imageSrc || collectionImageUrl"
          :should-resize-src="shouldResizeSrc"
          :video-src="videoSrc"
          :size="300"
          :is-collection="true"
          :alt="collectionName"
        />
        <Label
          class="mt-[24px] !text-[12px] text-medium-gray"
          :text="$t('nft_collection_num_of_books', { num: classIds.length })"
        />

        <div class="hidden laptop:block">
          <slot name="column-left" />
        </div>
      </div>
      <!-- Info column -->
      <div
        :class="[
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
        <Label
          v-if="isNew"
          class="text-like-cyan"
          :text="$t('campaign_nft_book_just_arrived')"
        />
        <Label
          class="text-like-collection"
          :text="$t('nft_collection_label')"
        />
        <Label preset="h4" :class="titleStyle" :text="collectionName" />
        <Markdown :md-string="collectionDescription" />
        <ul class="flex flex-wrap mt-[12px] gap-[1.5rem] w-full">
          <client-only>
            <li>
              <NuxtLink
                class="flex items-center text-like-green group my-[8px]"
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
                  :avatar-url="creatorAvatar"
                  :avatar-size="42"
                  :is-avatar-disabled="true"
                  :is-lazy-loaded="true"
                />
                <div class="flex flex-col justify-start ml-[8px] min-w-0">
                  <span
                    class="text-like-cyan-gray text-10 group-hover:underline"
                    >{{ $t('identity_type_distributor') }}</span
                  >
                  <span
                    :class="[
                      'group-hover:underline',
                      'font-[600]',
                      'truncate',
                      displayNameStyle,
                    ]"
                    >{{ creatorDisplayName }}</span
                  >
                </div>
              </NuxtLink>
            </li>
          </client-only>
        </ul>

        <slot name="column-right" />
      </div>
      <div class="flex flex-col items-center laptop:hidden">
        <slot name="column-left" />
      </div>
    </component>

    <!-- Footer -->
    <div
      v-if="!isCompactPreset"
      class="flex justify-between px-[8px] sm:px-[24px] mt-[20px]"
    >
      <NFTBookTypeTags :content-types="contentTypes" />
      <template v-if="!isDetailsPreset">
        <div v-if="collectionAvailablePriceLabel">
          <Label
            preset="p5"
            class="text-like-green-dark"
            :text="collectionAvailablePriceLabel"
          />
        </div>
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
  computed: {
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
        new Date().getTime() - new Date(this.iscnData?.recordTimestamp) <
        1000 * 60 * 60 * 24 * 30
      );
    },
    contentTypes() {
      const types = [];
      types.push('nft');
      types.push('collection');
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
      await this.lazyFetchNFTCollectionInfo();
    },
    onClickAvatar() {
      this.$emit('click-avatar', this.collectionOwner);
    },
  },
};
</script>
