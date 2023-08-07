<template>
  <NuxtLink
    class="relative block w-[310px]"
    :to="detailsPageRoute"
  >
    <client-only v-if="shouldFetchWhenVisible">
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>
    <NFTPortfolioBase
      :title="NFTName"
      :price="NFTPrice"
      :class-id="classId"
      :class-collection-type="nftClassCollectionType"
      :class-collection-name="nftClassCollectionName"
      :external-url="externalUrl"
      :iscn-url="iscnURL"
      :is-collectable="nftIsCollectable"
      :collected-count="collectedCount"
      :collector-count="ownerCount"
      :user-display-name="creatorDisplayName"
      :user-avatar-src="creatorAvatar"
      :is-user-civic-liker="isCreatorCivicLiker"
      :image-src="NFTImageUrl"
      :is-collecting="uiIsOpenCollectModal && isCollecting"
      :own-count="ownCount"
      :display-state="nftDisplayState"
      :is-nft-book="nftIsNFTBook"
      :is-collected-tab="isCollectedTab"
      @collect="handleClickCollect"
      @load-cover="handleCoverLoaded"
    />
    <NFTFeatured
      :class-id="classId"
      :read-only="!isSocialFeedsWithCollectiblesView"
      :display-state="nftDisplayState"
    />
  </NuxtLink>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

import nftMixin from '~/mixins/nft';

export default {
  mixins: [nftMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
    portfolioWallet: {
      type: String,
      required: true,
    },
    nftId: {
      type: String,
      default: undefined,
    },
    portfolioTab: {
      type: String,
      default: undefined,
    },
    shouldFetchWhenVisible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isCollecting: false,
    };
  },
  computed: {
    isCollectedTab() {
      return this.portfolioTab === 'collected';
    },
    nftIdForDetails() {
      return this.isCollectedTab && this.nftId;
    },
    detailsPageRoute() {
      if (this.nftIdForDetails) {
        return this.localeLocation({
          name: 'nft-class-classId-nftId',
          params: {
            classId: this.classId,
            nftId: this.nftIdForDetails,
          },
        });
      }
      return this.localeLocation({
        name: 'nft-class-classId',
        params: { classId: this.classId },
      });
    },
    isSocialFeedsWithCollectiblesView() {
      return (
        this.getRouteBaseName(this.$route) === 'social-feeds' &&
        this.$route.query.view === 'collectibles'
      );
    },
  },
  methods: {
    fetchInfo() {
      this.lazyFetchNFTClassAggregatedData();
    },
    async handleClickCollect() {
      this.$emit('collect');
      try {
        this.isCollecting = true;
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
    handleCoverLoaded(e) {
      this.$emit('load-cover', e);
    },
  },
};
</script>
