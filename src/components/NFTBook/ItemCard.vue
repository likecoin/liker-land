<template>
  <div v-if="isShelfPreset" class="relative flex flex-col items-start">
    <client-only v-if="isLazyLoaded">
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>
    <div :class="['flex', 'relative', { 'mt-[48px]': !isCoverPreset }]">
      <component
        :is="componentTag"
        :class="[coverClasses, 'mt-[-48px]', 'z-[1]']"
        :to="nftCollectRoute"
      >
        <NFTCover
          v-if="videoSrc"
          :is-nft-book="true"
          :src="imageSrc || nftImageUrl"
          :video-src="videoSrc"
          :should-resize-src="shouldResizeSrc"
          :size="200"
          :theme="theme"
          :alt="nftName"
        />
        <NFTBookCover
          v-else
          :class="coverClasses"
          :src="imageSrc || nftImageUrl"
          :alt="nftName"
          :resize="200"
        />
      </component>
    </div>
    <template v-if="!isCoverPreset">
      <Label :class="[titleStyle, 'mt-[20px]']" preset="p5" :text="nftName" />
      <Label
        class="text-medium-gray mt-[6px] mb-[12px]"
        preset="p6"
        :text="(classAuthorName || creatorDisplayName) | ellipsis"
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
    <NFTPageChannelBlock
      v-if="isDetailsPreset"
      class="laptop:hidden mb-[24px] self-start"
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
        <client-only v-if="!isDetailsPreset && isLazyLoaded">
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
            :src="imageSrc || nftImageUrl"
            :should-resize-src="shouldResizeSrc"
            :video-src="videoSrc"
            :size="200"
            :theme="theme"
            :alt="nftName"
          />
          <NFTBookCover
            v-else
            :class="['mt-[-48px]', coverClasses]"
            :src="imageSrc || nftImageUrl"
            :alt="nftName"
            :resize="200"
          />

          <div class="hidden w-full laptop:flex flex-col gap-[24px]">
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
          />
          <Label
            v-if="isNew"
            class="text-like-cyan"
            :text="$t('campaign_nft_book_just_arrived')"
          />
          <h1
            :class="['text-[24px]', 'font-600', titleStyle]"
            v-text="nftName"
          />
          <p
            v-if="!isDetailsPreset"
            :class="['text-14', 'whitespace-pre-line', descriptionStyle]"
          >
            {{ bookDescriptionTrimmed }}
          </p>
          <template v-else>
            <div
              v-if="isDetailsPreset"
              ref="description"
              :class="[
                'relative',
                'h-full',
                { 'max-h-[320px]': !isExpanded },
                'overflow-y-hidden',
                'flex flex-col',
                'gap-[40px]',
              ]"
            >
              <p
                :class="[
                  'block',
                  'text-14',
                  'whitespace-pre-line',
                  'text-dark-gray',
                ]"
              >
                {{ bookDescriptionTrimmed }}
              </p>
              <NFTBookContentBlock
                v-if="classAuthorDescription"
                :title="$t('nft_details_page_label_author_description')"
                :content="classAuthorDescription"
              />
              <NFTBookContentBlock
                v-if="nftTableContent"
                :title="$t('nft_details_page_label_table_content')"
                :content="nftTableContent"
              />
              <div
                v-if="!isExpanded"
                class="absolute bottom-0 w-full h-[80px] bg-gradient-to-b from-transparent to-white pointer-events-none"
              />
            </div>
            <div
              v-if="!isExpanded"
              class="group flex items-center justify-start w-auto cursor-pointer gap-[12px] text-[14px]"
              @click="clickShowMore"
            >
              <div
                class="group-hover:underline"
                v-text="$t('nft_details_page_label_show_more')"
              />
              <IconArrowDown class="mt-[-2px]" />
            </div>
          </template>

          <NFTBookSpecTable class="mt-[30px]">
            <li
              v-if="classAuthorName"
              class="flex flex-col justify-center min-w-0"
            >
              <NuxtLink
                class="group"
                :to="
                  localeLocation({
                    name: 'store',
                    query: { q: authorQuery || classAuthorName },
                  })
                "
              >
                <NFTBookSpecTableLabel :text="$t('identity_type_author')" />
                <NFTBookSpecTableValue
                  class="group-hover:underline"
                  :text="classAuthorName"
                  :preset="preset"
                />
              </NuxtLink>
            </li>
            <li
              v-if="classPublisher"
              class="flex flex-col justify-center min-w-0"
            >
              <NuxtLink
                class="group"
                :to="
                  localeLocation({
                    name: 'store',
                    query: { q: classPublisher },
                  })
                "
              >
                <NFTBookSpecTableLabel :text="$t('identity_type_publisher')" />
                <NFTBookSpecTableValue
                  class="group-hover:underline"
                  :text="classPublisher"
                  :preset="preset"
                />
              </NuxtLink>
            </li>
            <client-only v-if="!isOwnerHidden">
              <li>
                <NuxtLink
                  class="flex items-center text-like-green group"
                  :to="
                    classOwner
                      ? localeLocation({
                          name: 'id',
                          params: { id: classOwner },
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
                    <NFTBookSpecTableLabel
                      :text="
                        $t(
                          classAuthorName
                            ? classPublisher
                              ? 'identity_type_distributor'
                              : 'identity_type_publisher'
                            : 'identity_type_creator'
                        )
                      "
                    />
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
          </NFTBookSpecTable>
          <NFTBookSpecTable class="mt-[12px]">
            <NFTBookSpecTableItemDateReleased
              :is-published-date="!!classPublishedDate"
              :date="classReleasedDate"
              :preset="preset"
              :is-campaign="preset === 'campaign'"
            />
            <NFTBookSpecTableItemAvailableFormat
              :preset="preset"
              :content-types="contentTypes"
            />
            <NFTBookSpecTableItemAccessMethod
              :is-downloadable="!nftIsDownloadHidden"
              :preset="preset"
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
      v-if="!isCompactPreset && !isDetailsPreset"
      class="flex justify-between px-[8px] sm:px-[24px] mt-[20px]"
    >
      <Label
        v-if="isLoading"
        preset="p5"
        class="text-medium-gray"
        :text="$t('nft_details_page_label_item_loading')"
      />
      <Label
        v-else-if="nftBookAvailablePriceLabel"
        preset="p5"
        class="text-like-green-dark"
        :text="nftBookAvailablePriceLabel"
      />
      <Label
        v-else
        preset="p5"
        class="text-medium-gray"
        :text="$t('nft_details_page_label_sold_out')"
      />
    </div>
  </div>
</template>
<script>
import { getContentUrlType } from '~/util/misc';
import { ellipsis } from '~/util/ui';

import nftMixin from '~/mixins/nft';

export const PRESET_TYPE = {
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
    isOwnerHidden: {
      type: Boolean,
      default: false,
    },
    authorQuery: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isLoading: false,
      isExpanded: true,
    };
  },
  computed: {
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.classOwner)?.displayName ||
        this.classOwner
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
        new Date().getTime() - new Date(this.contentMetadata.recordTimestamp) <
        1000 * 60 * 60 * 24 * 30
      );
    },
    contentTypes() {
      const types = [];
      this.classContentUrls.forEach(url => {
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
    bookDescriptionTrimmed() {
      if (this.preset === PRESET_TYPE.CAMPAIGN) {
        return this.nftDescription
          .replaceAll('\n', '')
          .trim()
          .substring(0, 100);
      }
      return this.nftDescription.trim();
    },
  },
  mounted() {
    if (!this.isLazyLoaded) this.fetchInfo();
    this.$nextTick(() => {
      if (this.$refs.description.clientHeight > 320) {
        this.isExpanded = false;
      }
    });
  },
  methods: {
    async fetchInfo() {
      this.isLoading = true;
      try {
        await this.lazyFetchNFTClassAggregatedData();
      } finally {
        this.isLoading = false;
      }
    },
    onClickAvatar() {
      this.$emit('click-avatar', this.classOwner);
    },
    clickShowMore() {
      this.$emit('expand');
      this.isExpanded = true;
    },
  },
};
</script>
