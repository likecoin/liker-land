<template>
  <NFTCampaignItemBase
    :class-id="classId"
    :title="NFTName"
    :description="NFTDescription"
    :url="NFTExternalUrl"
    :img-src="NFTImageUrl"
    :img-bg-color="NFTImageBackgroundColor"
    :price="NFTPrice"
    :owner-address="iscnOwner"
    :owner-avatar-src="iscnOwnerAvatar"
    :owner-count="ownerCount"
    :owner-name="iscnOwnerDisplayName"
    :sold-count="mintedCount"
    :is-loading="isCollecting"
    :view-details-label="$t('campaign_nft_item_view_details_label')"
    :like-action-label="$t('campaign_nft_item_like_action_label')"
    :sold-count-label="$t('campaign_nft_item_collected_count_label')"
    :content-preview-props="{
      to: {
        name: 'nft-class-classId',
        params: { classId: classId },
      },
      tag: 'NuxtLink',
    }"
    @collect="handleClickCollect"
    @like="handleLike"
  />
</template>

<script>
import { LIKECOIN_BUTTON_BASE } from '~/constant';
import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import errorMixin from '~/mixins/error';

export default {
  mixins: [nftMixin, walletMixin, errorMixin],
  data() {
    return {
      isCollecting: false,
    };
  },
  mounted() {
    this.updateNFTClassMetdata();
    this.updateNFTPurchaseInfo();
    this.updateNFTOwners();
  },
  methods: {
    handleClickCollect() {
      this.collectNFT();
    },
    handleLike() {
      window.open(
        `${LIKECOIN_BUTTON_BASE}/in/like/iscn/?iscn_id=${encodeURIComponent(
          this.iscnId
        )}&action=like`,
        `like_${this.classId}`,
        'popup=1,width=768,height=576,top=0,left=0'
      );
    },
  },
};
</script>
