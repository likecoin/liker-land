<template>
  <NuxtLink
    :to="detailsPageRoute"
    @click.native="handleClickViewDetails"
  >
    <NFTPortfolioBase
      class="w-[310px]"
      :title="NFTName"
      :price="NFTPrice"
      :class-collection-type="nftClassCollectionType"
      :class-collection-name="nftClassCollectionName"
      :is-collectable="nftIsCollectable"
      :collected-count="collectedCount"
      :collector-count="ownerCount"
      :user-display-name="creatorDisplayName"
      :user-avatar-src="creatorAvatar"
      :is-user-civic-liker="isCreatorCivicLiker"
      :image-src="NFTImageUrl"
      :is-collecting="uiIsOpenCollectModal && isCollecting"
      :own-count="ownCount"
      @collect="handleClickCollect"
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
    nftId: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      isCollecting: false,
    };
  },
  computed: {
    detailsPageRoute() {
      if (this.nftId || this.nextNewNFTId) {
        return {
          name: 'nft-class-classId-nftId',
          params: {
            classId: this.classId,
            nftId: this.nftId || this.nextNewNFTId,
          },
        };
      }
      return { name: 'nft-class-classId', params: { classId: this.classId } };
    },
  },
  methods: {
    async handleClickCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(Portfolio)', this.classId, 1);
      try {
        this.isCollecting = true;
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
    handleClickViewDetails() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTViewDetails(Portfolio)',
        this.classId,
        1
      );
    },
  },
};
</script>
