<template>
  <div class="relative flex flex-col">
    <client-only>
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>

    <NFTBookCoverWithFrame
      tag="NuxtLink"
      class="group"
      :class-aspect-ratio="classCoverFrameAspectRatio"
      img-class="group-hover:scale-[1.02] transition-transform"
      :src="NFTImageUrl"
      :alt="NFTName"
      :to="nftCollectRoute"
      @click.native="$emit('click-cover', $event)"
    />

    <div class="mt-[8px] text-[#8B8B8B] text-[0.875rem]">
      {{ (iscnWorkAuthor || creatorDisplayName) | ellipsis }}
    </div>

    <div class="mt-[4px] text-[#333] text-[1rem]">{{ NFTName }}</div>

    <div class="mt-[8px] text-[#1F1F1F] text-[0.875rem]">
      {{ nftBookAvailablePriceLabel || $t('nft_details_page_label_sold_out') }}
    </div>
  </div>
</template>

<script>
import nftMixin from '~/mixins/nft';

import { ellipsis } from '~/util/ui';

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
    classCoverFrameAspectRatio: {
      type: String,
      default: 'aspect-[4/5]',
    },
  },
  computed: {
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.iscnOwner)?.displayName || this.iscnOwner
      );
    },
  },
  methods: {
    async fetchInfo() {
      await this.lazyFetchNFTClassAggregatedData();
    },
  },
};
</script>
