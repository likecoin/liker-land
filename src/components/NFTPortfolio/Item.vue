<template>
  <NuxtLink class="relative block w-[310px]" :to="detailsPageRoute">
    <client-only v-if="shouldFetchWhenVisible">
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>
    <NFTPortfolioBase
      :title="NFTName"
      :price="NFTPrice"
      :is-free="nftIsFree"
      :class-id="classId"
      :external-url="externalUrl"
      :iscn-url="iscnURL"
      :content-urls="iscnContentUrls"
      :is-collectable="nftIsCollectable"
      :user-display-name="creatorDisplayNameFull"
      :user-avatar-src="creatorAvatar"
      :is-user-civic-liker="isCreatorCivicLiker"
      :image-src="NFTImageUrl"
      :is-collecting="uiIsOpenCollectModal && isCollecting"
      :own-count="ownCount"
      :display-state="nftDisplayState"
      :is-nft-book="nftIsNFTBook"
      :portfolio-tab="portfolioTab"
      :is-content-viewable="!(nftIsNFTBook && !isOwningNFT)"
      :is-content-downloadable="!nftIsDownloadHidden"
      :collect-expiry-time="collectExpiryTime"
      @collect="handleClickCollect"
      @load-cover="handleCoverLoaded"
    />
    <NFTFeatured
      :class-id="classId"
      :read-only="!isSocialFeedWithCollectiblesView"
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
      default: undefined,
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
    nftIdForDetails() {
      return this.portfolioTab === 'collected' && this.nftId;
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
    isSocialFeedWithCollectiblesView() {
      return (
        this.getRouteBaseName(this.$route) === 'feed' &&
        this.$route.query.view === 'collectibles'
      );
    },
  },
  methods: {
    async fetchInfo() {
      await Promise.all([
        this.lazyFetchNFTClassAggregatedData({ excludeOptions: ['owner'] }),
        this.updateNFTOwners(),
      ]);
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
