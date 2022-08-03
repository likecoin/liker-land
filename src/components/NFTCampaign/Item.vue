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
    :owner-avatar-src="getAvatar"
    :owner-count="ownerCount"
    :owner-name="getOwnerDisplayName"
    :sold-count="mintedCount"
    :view-details-label="$t('campaign_nft_item_view_details_label')"
    :like-action-label="$t('campaign_nft_item_like_action_label')"
    :sold-count-label="$t('campaign_nft_item_collected_count_label')"
    @collect="handleClickCollect"
    @view-details="handleViewDetails"
    @like="handleLike"
  />
</template>

<script>
import { LIKECOIN_BUTTON_BASE } from '~/constant';
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
  computed: {
    getAvatar() {
      return (
        this.avatarList[this.iscnOwner] ||
        `https://avatars.dicebear.com/api/identicon/${this.iscnOwner}.svg`
      );
    },
    getOwnerDisplayName() {
      return this.displayNameList[this.iscnOwner];
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
      if (!this.getAddress) {
        this.connectWallet();
        return;
      }
      this.collectNFT(this.getAddress, this.classId, this.getSigner);
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
