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
    :owner-count="ownerCount"
    :sold-count="mintedCount"
    :view-details-label="$t('campaign_nft_item_view_details_label')"
    @collect="handleClickCollect"
    @view-details="handleViewDetails"
    @like="handleLike"
  />
</template>

<script>
import { LIKECOIN_BUTTON_BASE } from '~/constant';
import nftMixin from '~/mixins/nft';

export default {
  mixins: [nftMixin],
  props: {
    classId: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.updateNFTClassMetdata();
    this.updateNFTPurchaseInfo();
    this.updateNFTOwners();
  },
  methods: {
    handleClickCollect() {
      // TODO: Log event
      this.collectNFT();
    },
    handleViewDetails() {
      this.$router.push({
        name: 'nft-class-classId',
        params: { classId: this.classId },
      });
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
