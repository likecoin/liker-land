<template>
  <NuxtLink class="relative block w-[310px]" :to="detailsPageRoute">
    <client-only v-if="shouldFetchWhenVisible">
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>
    <NFTPortfolioBase
      :title="nftName"
      :price="NFTPrice"
      :is-free="nftIsFree"
      :class-id="classId"
      :external-url="externalUrl"
      :content-urls="classContentUrls"
      :is-collectable="nftIsCollectable"
      :user-display-name="creatorDisplayNameFull"
      :user-avatar-src="creatorAvatar"
      :is-user-civic-liker="isCreatorCivicLiker"
      :image-src="nftImageUrl"
      :is-collecting="uiIsOpenCollectModal && isCollecting"
      :own-count="ownCount"
      :display-state="nftDisplayState"
      :is-nft-book="nftIsNFTBook"
      :portfolio-tab="portfolioTab"
      :is-content-viewable="isContentViewable"
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
import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

export default {
  mixins: [nftMixin, walletMixin],
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
    isBookshelf: {
      type: Boolean,
      default: false,
    },
    llMedium: {
      type: String,
      default: '',
    },
    llSource: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isCollecting: false,
    };
  },
  computed: {
    isCurrentUserPortfolio() {
      return this.getAddress === this.portfolioWallet;
    },
    isContentViewable() {
      return !!(
        this.nftIsNFTBook &&
        (this.isBookshelf || this.isCurrentUserPortfolio) &&
        this.nftIdCollectedFirstByUser
      );
    },
    nftIdForDetails() {
      if (this.portfolioTab === 'collected') {
        return this.isBookshelf ? this.nftIdCollectedFirstByUser : this.nftId;
      }
      return undefined;
    },
    detailsPageRoute() {
      const query = { ...this.$route.query };
      if (this.llMedium) {
        query.ll_medium = this.llMedium;
      }
      if (this.llSource) {
        query.ll_source = this.llSource;
      }
      if (this.nftIdForDetails) {
        return this.localeLocation({
          name: 'nft-class-classId-nftId',
          params: {
            classId: this.classId,
            nftId: this.nftIdForDetails,
          },
          query,
        });
      }
      return this.localeLocation({
        name: 'nft-class-classId',
        params: { classId: this.classId },
        query,
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
        this.lazyFetchNFTOwners(),
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
