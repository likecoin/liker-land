<template>
  <NuxtLink
    :to="detailsPageRoute"
    @click.native="handleClickViewDetails"
  >
    <NFTPortfolioBase
      class="w-[310px]"
      :title="NFTName"
      :price="NFTPrice"
      :is-writing-nft="isWritingNFT"
      :collected-count="collectedCount"
      :collector-count="ownerCount"
      :user-display-name="creatorDisplayName"
      :user-avatar-src="creatorAvatar"
      :is-user-civic-liker="isCreatorCivicLiker"
      :image-src="NFTImageUrl"
      :is-collecting="uiIsOpenCollectModal && isCollecting"
      :own-count="ownCount"
      :current-state="state"
      @collect="handleClickCollect"
    />
    <NFTFeatured
      :class-id="classId"
      :preset="$route.path.includes('dashboard') ? 'edit' : 'viewOnly'"
      :current-state="state"
      @state-change="(obj) => (state = obj.state)"
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

      // Temp for testing UI
      state: 'featured',
    };
  },
  computed: {
    detailsPageRoute() {
      if (this.nftId) {
        return {
          name: 'nft-class-classId-nftId',
          params: {
            classId: this.classId,
            nftId: this.nftId,
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
