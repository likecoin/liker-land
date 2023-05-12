<template>
  <div class="flex flex-col justify-center">
    <NuxtLink class="flex items-end h-[290px]" :to="nftCollectRoute">
      <div
        :class="[
          'flex',
          'flex-row',
          'gap-[38px]',
          'w-full',
          'rounded-[32px]',
          'px-[32px]',
          'bg-white',
          { '!bg-like-green': `${preset}` === 'campaign' },
        ]"
      >
        <lazy-component
          class="absolute inset-0 pointer-events-none"
          @show="fetchInfo"
        />
        <div class="relative w-full max-w-[220px] shrink-0">
          <div
            :class="[
              'absolute',
              'left-0',
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
        <div class="flex flex-col justify-start py-[32px] gap-[12px]">
          <Label
            class="text-like-cyan"
            :text="$t('campaign_nft_book_just_arrived')"
          />
          <Label preset="h4" class="text-white" :text="NFTName" />
          <p class="text-14 text-like-cyan-pale font-200 line-clamp-2">
            {{ NFTDescription }}
          </p>
          <NuxtLink
            class="mt-[8px] flex items-center text-like-green group my-[8px]"
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
              <span class="group-hover:underline font-[600] text-white">{{
                creatorDisplayName | ellipsis
              }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </NuxtLink>

    <!-- Footer -->
    <div class="flex justify-between px-[24px] mt-[20px]">
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
    coverStyle() {
      if (this.preset === 'details') return 'top-[40px]';
      return 'bottom-[-1px]';
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
