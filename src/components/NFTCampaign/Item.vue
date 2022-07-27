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
    @collect="handleCollect"
    @view-details="handleViewDetails"
  />
</template>

<script>
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
    handleCollect() {
      window.open(this.purchaseURL, '_blank');
    },
    handleViewDetails() {
      this.$router.push({
        name: 'nft-class-classId',
        params: { classId: this.classId },
      });
    },
  },
};
</script>
