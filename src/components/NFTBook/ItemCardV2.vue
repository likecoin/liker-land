<template>
  <div class="relative flex flex-col">
    <client-only v-if="isLazyLoaded">
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>

    <NFTBookCoverWithFrame
      tag="NuxtLink"
      class="group"
      :class-aspect-ratio="classCoverFrameAspectRatio"
      cover-class="group-hover:scale-[1.02] transition-transform"
      :cover-resize="coverResize"
      :src="productImageUrl"
      :alt="productName"
      :to="viewInfoLocation"
      :event="isLinkDisabled ? '' : 'click'"
      @click.native="$emit('click-cover', $event)"
    />

    <div
      class="mt-[8px] text-[#333] text-[1rem] font-[500] laptop:text-[1.125rem]"
    >
      {{ productName }}
    </div>

    <div class="text-[#8B8B8B] text-[0.875rem] laptop:text-[1rem]">
      {{ (iscnWorkAuthor || creatorDisplayName) | ellipsis }}
    </div>

    <div class="mt-[16px] text-[#1F1F1F] text-[0.875rem] laptop:text-[1rem]">
      {{ priceLabel }}
    </div>
  </div>
</template>

<script>
import nftOrCollectionMixin from '~/mixins/nft-or-collection';

import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  mixins: [nftOrCollectionMixin],
  props: {
    itemId: {
      type: String,
      required: true,
    },
    classCoverFrameAspectRatio: {
      type: String,
      default: 'aspect-[4/5]',
    },
    coverResize: {
      type: Number,
      default: 300,
    },
    isLinkDisabled: {
      type: Boolean,
      default: false,
    },
    isLazyLoaded: {
      type: Boolean,
      default: true,
    },
    linkMedium: {
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
    classId() {
      return this.itemId.startsWith('likenft1') ? this.itemId : '';
    },
    collectionId() {
      return this.itemId.startsWith('col') ? this.itemId : '';
    },
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.productOwner)?.displayName ||
        this.productOwner
      );
    },
    priceLabel() {
      if (this.isLoading) return this.$t('nft_details_page_label_item_loading');
      return (
        this.productAvailablePriceLabel ||
        this.$t('nft_details_page_label_sold_out')
      );
    },
  },
  mounted() {
    if (!this.isLazyLoaded) this.fetchInfo();
  },
  methods: {
    async fetchInfo() {
      this.isLoading = true;
      try {
        if (this.isCollection) {
          await this.lazyFetchNFTCollectionInfo();
        } else {
          await this.lazyFetchNFTClassAggregatedData();
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
