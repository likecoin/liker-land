<template>
  <div v-if="isShelfPreset" class="relative flex flex-col items-start">
    <client-only v-if="isLazyLoaded">
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>
    <div :class="['flex', 'relative', { 'mt-[48px]': !isCoverPreset }]">
      <div
        v-if="!isFutureTheme"
        :class="[
          'absolute',
          'z-[0]',
          'inset-x-[-38px] sm:inset-x-[-48px]',
          'inset-y-0',
          'bg-like-cyan-pale',
          'rounded-[32px]',
          shelfClass,
        ]"
      />
      <component
        :is="componentTag"
        :class="[coverClasses, 'mt-[-48px]', 'z-[1]']"
        :to="nftCollectRoute"
      >
        <NFTCover
          v-if="videoSrc"
          :is-nft-book="true"
          :src="imageSrc || NFTImageUrl"
          :video-src="videoSrc"
          :should-resize-src="shouldResizeSrc"
          :size="200"
          :theme="theme"
          :alt="NFTName"
        />
        <NFTBookCover
          v-else
          :class="['mt-[-48px]', coverClasses]"
          :src="imageSrc || NFTImageUrl"
          :alt="NFTName"
          :resize="200"
        />
      </component>
    </div>
    <template v-if="!isCoverPreset">
      <Label :class="[titleStyle, 'mt-[20px]']" preset="p5" :text="NFTName" />
      <Label
        class="text-medium-gray mt-[6px] mb-[12px]"
        preset="p6"
        :text="(iscnWorkAuthor || creatorDisplayName) | ellipsis"
      />
      <Label
        v-if="nftBookAvailablePriceLabel"
        class="text-like-green-dark"
        preset="p5"
        :text="nftBookAvailablePriceLabel"
      />
      <Label
        v-else
        class="text-medium-gray"
        preset="p5"
        :text="$t('nft_details_page_label_sold_out')"
      />
    </template>
  </div>
  <div v-else :class="['flex', 'flex-col', 'justify-center']">
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
      ]"
      v-bind="componentProps"
    >
      <client-only v-if="!isDetailsPreset && isLazyLoaded">
        <lazy-component
          class="absolute inset-0 pointer-events-none -top-full"
          @show.once="fetchInfo"
        />
      </client-only>
      <div class="flex flex-col items-center shrink-0">
        <NFTCover
          v-if="videoSrc"
          :class="['mt-[-48px]', coverClasses]"
          :is-nft-book="true"
          :src="imageSrc || NFTImageUrl"
          :should-resize-src="shouldResizeSrc"
          :video-src="videoSrc"
          :size="200"
          :theme="theme"
          :alt="NFTName"
        />
        <NFTBookCover
          v-else
          :class="['mt-[-48px]', coverClasses]"
          :src="imageSrc || NFTImageUrl"
          :alt="NFTName"
          :resize="200"
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
        <Label preset="h4" :class="titleStyle" :text="NFTName" />
        <p :class="['text-14', 'whitespace-pre-line', descriptionStyle]">
          {{ bookDescriptionTrimmed }}
        </p>
        <ul class="flex flex-wrap mt-[12px] gap-[1.5rem] w-full">
          <li
            v-if="iscnWorkAuthor"
            class="flex flex-col justify-center min-w-0 ml-[8px]"
          >
            <span class="text-like-cyan-gray text-10">{{
              $t('identity_type_author')
            }}</span>
            <span :class="['font-[600]', displayNameStyle]">{{
              iscnWorkAuthor
            }}</span>
          </li>
          <client-only>
            <li>
              <NuxtLink
                class="flex items-center text-like-green group my-[8px]"
                :to="
                  iscnOwner
                    ? localeLocation({
                        name: 'id',
                        params: { id: iscnOwner },
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
                    >{{
                      $t(
                        iscnWorkAuthor
                          ? 'identity_type_publisher'
                          : 'identity_type_creator'
                      )
                    }}</span
                  >
                  <span
                    :class="[
                      'group-hover:underline',
                      'font-[600]',
                      'truncate',
                      displayNameStyle,
                    ]"
                    >{{ creatorDisplayNameFull }}</span
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
        <div v-if="nftBookAvailablePriceLabel">
          <Label
            preset="p5"
            class="text-like-green-dark"
            :text="nftBookAvailablePriceLabel"
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

import nftMixin from '~/mixins/nft';

const PRESET_TYPE = {
  SHELF: 'shelf', // (Landing page) shelf style
  CAMPAIGN: 'campaign', // (Landing page) like-green bg
  COMPACT: 'compact', // (Landing page) compact style
  COVER: 'cover', // Cover style
  DEFAULT: 'default', // (All books page) white bg
  DETAILS: 'details', // (Class details page) Expand all information
};

const THEME_TYPE = {
  DEFAULT: 'default',
  FUTURE: 'future',
};

export default {
  filters: {
    ellipsis,
  },
  mixins: [nftMixin],
  props: {
    isLazyLoaded: {
      type: Boolean,
      default: true,
    },
    classId: {
      type: String,
      required: true,
    },
    preset: {
      type: String,
      default: PRESET_TYPE.DEFAULT,
    },
    theme: {
      type: String,
      default: THEME_TYPE.DEFAULT,
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
        this.getUserInfoByAddress(this.iscnOwner)?.displayName || this.iscnOwner
      );
    },
    isShelfPreset() {
      return (
        this.preset === PRESET_TYPE.SHELF || this.preset === PRESET_TYPE.COVER
      );
    },
    isDetailsPreset() {
      return this.preset === PRESET_TYPE.DETAILS;
    },
    isCompactPreset() {
      return this.preset === PRESET_TYPE.COMPACT;
    },
    isCoverPreset() {
      return this.preset === PRESET_TYPE.COVER;
    },
    isFutureTheme() {
      return this.theme === THEME_TYPE.FUTURE;
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
      this.iscnContentUrls.forEach(url => {
        types.push(this.getContentUrlType(url));
      });
      types.push('nft');
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
        to: this.nftCollectRoute,
      };
    },
    bgStyle() {
      if (this.isFutureTheme) {
        return '';
      }
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
      if (this.isFutureTheme) {
        return [];
      }
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
    bookDescription() {
      const overrideKey = `nft_override_${this.classId}_description`;
      const hasOverride = this.$te(overrideKey);
      if (hasOverride) return this.$t(overrideKey);
      return this.iscnDescription || this.NFTDescription || '';
    },
    bookDescriptionTrimmed() {
      if (this.preset === PRESET_TYPE.CAMPAIGN) {
        return this.bookDescription
          .replaceAll('\n', '')
          .trim()
          .substring(0, 100);
      }
      return this.bookDescription.trim();
    },
  },
  mounted() {
    if (!this.isLazyLoaded) this.fetchInfo();
  },
  methods: {
    async fetchInfo() {
      await this.lazyFetchNFTClassAggregatedData();
    },
    getContentUrlType(url) {
      if (url.includes('epub')) return 'epub';
      if (url.includes('pdf')) return 'pdf';
      return 'unknown';
    },
    onClickAvatar() {
      this.$emit('click-avatar', this.iscnOwner);
    },
  },
};
</script>
