<template>
  <div class="relative">
    <client-only>
      <lazy-component
        class="absolute inset-0 pointer-events-none -top-full"
        @show.once="fetchInfo"
      />
    </client-only>
    <NFTCampaignItemBase
      :class-id="classId"
      :title="nftName"
      :description="nftDescription"
      :img-src="nftImageUrl"
      :img-bg-color="nftImageBackgroundColor"
      :price="NFTPrice"
      :base-price="nftBasePrice"
      :owner-address="classOwner"
      :owner-avatar-src="creatorAvatar"
      :owner-count="ownerCount"
      :owner-name="creatorDisplayName"
      :own-count="ownCount"
      :sold-count="nftSoldCount"
      :is-loading="uiIsOpenCollectModal && isCollecting"
      :is-content-viewable="isContentViewable"
      :view-details-label="
        isContentViewable
          ? $t('campaign_nft_item_view_details_label')
          : $t('nft_details_page_button_collect_to_view')
      "
      :like-action-label="$t('campaign_nft_item_like_action_label')"
      :owner-count-label="$t('nft_details_page_title_collector')"
      :sold-count-label="$t('campaign_nft_item_collected_count_label')"
      :own-count-label="$t('nft_details_page_label_owning')"
      :story-title="storyTitle"
      :story-description="storyDescription"
      :is-collectable="nftIsCollectable"
      :collect-expiry-time="collectExpiryTime"
      :content-preview-props="{
        to: nftCollectRoute,
        tag: 'NuxtLink',
      }"
      :is-single-column="isSingleColumn || !NFTPrice"
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
    storyTitle: {
      type: String,
      default: '',
    },
    storyDescription: {
      type: String,
      default: '',
    },
    isSingleColumn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCollecting: false,
    };
  },
  computed: {
    isContentViewable() {
      return !(this.nftIsNFTBook && !this.ownCount);
    },
  },
  methods: {
    fetchInfo() {
      this.lazyFetchNFTClassAggregatedData();
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
