<template>
  <div
    v-if="isShelfPreset"
    class="relative flex flex-col items-start"
  >
    <client-only>
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>
    <div class="flex relative mt-[48px]">
      <div
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
          :is-nft-book="true"
          :src="NFTImageUrl"
          :size="300"
          :alt="NFTName"
        />
      </component>
    </div>
    <Label
      :class="[titleStyle, 'mt-[20px]']"
      preset="p5"
      :text="NFTName"
    />
    <Label
      class="text-medium-gray mt-[6px] mb-[12px]"
      preset="p6"
      :text="creatorDisplayName | ellipsis"
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
  </div>
  <div
    v-else
    :class="[
      'flex',
      'flex-col',
      'justify-center',
    ]"
  >
    <component
      :is="componentTag"
      :class="[
        'relative',
        'flex',
        isDetailsPreset ? 'laptop:items-start' : 'laptop:items-end',
        'flex-col laptop:flex-row',
        'laptop:gap-[36px]',
        'w-full',
        'rounded-[32px]',
        'px-[16px] sm:px-[32px] laptop:px-[48px]',
        'transition-all',
        'duration-200',
        bgStyle,
        'mt-[48px]',
        { group: !isDetailsPreset },
      ]"
      :to="isDetailsPreset ? undefined : nftCollectRoute"
    >
      <client-only v-if="!isDetailsPreset">
        <lazy-component
          class="absolute inset-0 pointer-events-none -top-full"
          @show.once="fetchInfo"
        />
      </client-only>
      <div class="flex flex-col items-center shrink-0">
        <NFTCover
          :class="[
            'mt-[-48px]',
            coverClasses,
          ]"
          :is-nft-book="true"
          :src="NFTImageUrl"
          :size="300"
          :alt="NFTName"
        />

        <div class="hidden laptop:block">
          <slot name="column-left" />
        </div>
      </div>
      <!-- Info column -->
      <div class="flex flex-col items-center laptop:items-start justify-start py-[32px] gap-[12px] grow">
        <Label
          class="text-like-cyan"
          :text="$t('campaign_nft_book_just_arrived')"
        />
        <Label preset="h4" :class="titleStyle" :text="NFTName" />
        <p :class="['text-14', descriptionStyle]">
          {{ NFTDescription }}
        </p>
        <div class="flex">
          <client-only>
            <NuxtLink
              class="mt-[12px] flex items-center text-like-green group my-[8px]"
              :to="
                iscnOwner
                  ? localeLocation({
                    name: 'id',
                    params: { id: iscnOwner },
                    query: { tab: 'created' },
                  })
                  : ''"
              @click.native.stop="onClickAvatar"
            >
              <Identity
                :avatar-url="creatorAvatar"
                :avatar-size="42"
                :is-avatar-disabled="true"
                :is-lazy-loaded="true"
              />
              <div class="flex flex-col justify-start ml-[8px]">
                <span class="text-like-cyan-gray text-10 group-hover:underline">{{
                  $t('identity_type_creator')
                }}</span>
                <span
                  :class="[
                    'group-hover:underline',
                    'font-[600]',
                    displayNameStyle,
                  ]"
                >{{ creatorDisplayName | ellipsis }}</span>
              </div>
            </NuxtLink>
          </client-only>
        </div>

        <slot name="column-right" />

      </div>
      <div class="laptop:hidden flex flex-col items-center">
        <slot name="column-left" />
      </div>
    </component>

    <!-- Footer -->
    <div class="flex justify-between px-[8px] sm:px-[24px] mt-[20px]">
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
  DEFAULT: 'default', // (All books page) white bg
  DETAILS: 'details', // (Class details page) Expand all information
};

export default {
  filters: {
    ellipsis,
  },
  mixins: [nftMixin],
  props: {
    classId: {
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
  },
  computed: {
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.iscnOwner)?.displayName || this.iscnOwner
      );
    },
    isShelfPreset() {
      return this.preset === PRESET_TYPE.SHELF;
    },
    isDetailsPreset() {
      return this.preset === PRESET_TYPE.DETAILS;
    },
    contentTypes() {
      const types = [];
      this.iscnContentUrls.forEach(url => {
        types.push(this.getContentUrlType(url));
      });
      types.push('nft');
      return [...new Set(types.filter(type => type !== 'unknown'))];
    },
    componentTag() {
      if (this.isDetailsPreset) return 'div';
      return 'NuxtLink';
    },
    bgStyle() {
      switch (this.preset) {
        case PRESET_TYPE.CAMPAIGN:
          return 'bg-like-green hover:shadow-lg';
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
      await this.lazyFetchNFTClassAggregatedData();
      try {
        if ([PRESET_TYPE.CAMPAIGN, PRESET_TYPE.SHELF].includes(this.preset)) {
          await this.fetchNFTBookPriceByClassId(this.classId).catch(error => {
            if (error.response?.status !== 400) {
              throw error;
            } else {
              return Promise.resolve();
            }
          });
        }
      } catch (error) {
        if (!error.response?.status === 404) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
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
