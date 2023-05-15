<template>
  <div class="flex flex-col justify-center">
    <component
      :is="componentTag"
      :class="['flex', 'items-end', rootStyle]"
      :to="nftCollectRoute"
    >
      <div
        :class="[
          'relative',
          'flex sm:items-end',
          'flex-col sm:flex-row',
          'sm:gap-[36px]',
          'w-full',
          'rounded-[32px]',
          'px-[32px]',
          'transition-all',
          'duration-200',
          bgStyle
        ]"
      >
        <client-only>
          <lazy-component
            class="absolute inset-0 pointer-events-none"
            @show="fetchInfo"
          />
        </client-only>
        <div class="w-full max-w-[220px] shrink-0 self-center sm:self-end">
          <div
            :class="[
              'mt-[-48px]',
              'shadow-xl',
              coverStyle,
            ]"
          >
            <NFTCover
              v-if="NFTImageUrl"
              class="grow"
              :is-nft-book="true"
              :src="NFTImageUrl"
              :size="450"
              :alt="NFTName"
            />
          </div>
        </div>
        <!-- Info column -->
        <div class="flex flex-col justify-start py-[32px] gap-[12px] w-min">
          <Label
            class="text-like-cyan"
            :text="$t('campaign_nft_book_just_arrived')"
          />
          <Label preset="h4" :class="titleStyle" :text="NFTName" />
          <p :class="['text-14', descriptionStyle]">
            {{ NFTDescription }}
          </p>
          <div class="flex w-min">
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
                @click.native.stop
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
        </div>
      </div>
    </component>

    <!-- Footer -->
    <div class="flex justify-between px-[8px] sm:px-[24px] mt-[20px]">
      <NFTBookTypeTags :content-types="contentTypes" />
      <div v-if="nftIsCollectable">
        <Label
          preset="p5"
          class="text-like-green-dark"
          :text="formattedNFTPriceUSD"
        />
      </div>
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
import { ellipsis, formatNumberWithLIKE } from '~/util/ui';

import nftMixin from '~/mixins/nft';

const PRESET_TYPE = {
  CAMPAIGN: 'campaign', // (Landing page) like-green bg
  DEFAULT: 'default', // (All books page) white bg
  DETAILS: 'details', // (Class details page) Expand all information
};

export default {
  filters: {
    ellipsis,
    formatNumberWithLIKE,
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
  },
  computed: {
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.iscnOwner)?.displayName || this.iscnOwner
      );
    },
    contentTypes() {
      const types = [];
      this.iscnContentUrls.forEach(url => {
        types.push(this.getContentUrlType(url));
      });
      types.push('nft');
      return types.filter(type => type !== 'unknown');
    },
    componentTag() {
      if (this.preset === PRESET_TYPE.DETAILS) return 'div';
      return 'NuxtLink';
    },
    rootStyle() {
      if (this.preset === PRESET_TYPE.DETAILS) return 'h-auto';
      return 'min-h-[290px]';
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
    coverStyle() {
      if (this.preset === PRESET_TYPE.DETAILS) return 'top-[-40px]';
      return 'bottom-[-1px]';
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
      await this.updateNFTClassMetadata();
      this.updateNFTPurchaseInfo();
      this.updateNFTOwners();
      try {
        const blockingPromises = [this.fetchISCNMetadata()];
        await Promise.all(blockingPromises);
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
  },
};
</script>
