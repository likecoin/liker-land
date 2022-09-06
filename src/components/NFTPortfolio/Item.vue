<template>
  <NuxtLink
    class="mx-auto mb-[5px] break-inside-avoid"
    :to="{ name: 'nft-class-classId', params: { classId } }"
    target="_blank"
    @click="handleClickViewDetails"
  >
    <NFTPortfolioBase
      :class-id="classId"
      :title="NFTName"
      :price="NFTPrice"
      :collected-count="mintedCount"
      :collector-count="ownerCount"
      :user-display-name="displayNameList[iscnOwner]"
      :user-avatar-src="avatarList[iscnOwner]"
      :is-user-civic-liker="civicLikerList[iscnOwner]"
      :image-src="NFTImageUrl"
      :is-collecting="uiIsOpenCollectModal && isCollecting"
      @collect="handleClickCollect"
    />
  </NuxtLink>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

export default {
  mixins: [nftMixin, walletMixin],
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
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.handleClickCollect();
        }
        return;
      }

      try {
        this.isCollecting = true;
        this.updateUserCollectedCount(this.classId, this.getAddress);
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
