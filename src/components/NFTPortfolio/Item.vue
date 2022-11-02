<template>
  <NuxtLink
    :to="{ name: 'nft-class-classId', params: { classId } }"
    @click.native="handleClickViewDetails"
  >
    <NFTPortfolioBase
      class="w-[310px]"
      :title="NFTName"
      :price="NFTPrice"
      :is-writing-nft="isWritingNFT"
      :collected-count="collectedCount"
      :collector-count="ownerCount"
      :user-display-name="iscnOwnerDisplayName"
      :user-avatar-src="iscnOwnerAvatar"
      :is-user-civic-liker="isCivicLiker"
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
  },

  data() {
    return {
      isCollecting: false,
    };
  },
  async mounted() {
    await this.updateNFTClassMetadata();
    this.updateNFTOwners();
    // wait for metadata to determine if it is writing NFT
    if (this.isWritingNFT) this.updateNFTPurchaseInfo();
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
