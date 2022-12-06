<template>
  <div class="relative">
    <lazy-component
      class="absolute inset-0 pointer-events-none"
      @show="fetchInfo"
    />
    <NFTCampaignItemBase
      :class-id="classId"
      :title="NFTName"
      :description="NFTDescription"
      :url="NFTExternalUrl"
      :img-src="NFTImageUrl"
      :img-bg-color="NFTImageBackgroundColor"
      :price="NFTPrice"
      :owner-address="iscnOwner"
      :owner-avatar-src="creatorAvatar"
      :owner-count="ownerCount"
      :owner-name="creatorDisplayName"
      :own-count="ownCount"
      :sold-count="collectedCount"
      :is-loading="uiIsOpenCollectModal && isCollecting"
      :view-details-label="$t('campaign_nft_item_view_details_label')"
      :like-action-label="$t('campaign_nft_item_like_action_label')"
      :owner-count-label="$t('nft_details_page_title_collector')"
      :sold-count-label="$t('campaign_nft_item_collected_count_label')"
      :own-count-label="$t('nft_details_page_label_owning')"
      :content-preview-props="{
        to: {
          name: 'nft-class-classId-nftId',
          params: { classId: classId, nftId: nftIdCollectNext },
        },
        tag: 'NuxtLink',
      }"
      @view-details="handleClickViewDetails"
      @view-content="handleClickViewContent"
      @collect="handleClickCollect"
      @like="handleLike"
    />
  </div>
</template>

<script>
import { LIKECOIN_BUTTON_BASE } from '~/constant';

import { logTrackerEvent } from '~/util/EventLogger';

import alertMixin from '~/mixins/alert';
import nftMixin from '~/mixins/nft';

export default {
  mixins: [alertMixin, nftMixin],
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
  methods: {
    fetchInfo() {
      this.updateNFTClassMetadata();
      this.updateNFTPurchaseInfo();
      this.updateNFTOwners();
    },
    async handleClickCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(Campaign)', this.classId, 1);
      try {
        this.isCollecting = true;
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
    handleLike() {
      logTrackerEvent(this, 'NFT', 'NFTLike(Campaign)', this.classId, 1);
      window.open(
        `${LIKECOIN_BUTTON_BASE}/in/like/iscn/?iscn_id=${encodeURIComponent(
          this.iscnId
        )}&action=like`,
        `like_${this.classId}`,
        'popup=1,width=768,height=576,top=0,left=0'
      );
    },
    handleClickViewDetails() {
      logTrackerEvent(this, 'NFT', 'NFTViewDetails(Campaign)', this.classId, 1);
    },
    handleClickViewContent() {
      logTrackerEvent(this, 'NFT', 'NFTViewContent(Campaign)', this.classId, 1);
    },
  },
};
</script>
