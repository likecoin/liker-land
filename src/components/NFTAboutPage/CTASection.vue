<template>
  <nav class="grid items-center justify-center grid-flow-row laptop:grid-flow-col gap-[16px]">
    <ButtonV2
      :to="{ name: 'writing-nft' }"
      preset="secondary"
      @click.native="handleClickCampaignPageButton"
    >{{ aboutNFTNavCampaignText }}</ButtonV2>
    <ButtonV2
      preset="tertiary"
      @click="handleClickMyDashboardButton"
    >{{ $t('about_nft_page_nav_collection') }}</ButtonV2>
  </nav>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

import walletMixin from '~/mixins/wallet';
import experimentMixin from '~/mixins/experiment';

export default {
  name: 'NFTCTASection',
  mixins: [walletMixin],
  computed: {
    aboutNFTNavCampaignText() {
      return this.$t('about_nft_page_nav_campaign');
    },
  },
  methods: {
    handleClickCampaignPageButton() {
      // Legacy event
      logTrackerEvent(this, 'NFT', 'NFTGoToCampaign', 'NFTGoToCampaign', 1);
      this.$emit('go-campaign');
    },
    handleClickMyDashboardButton() {
      // Legacy event
      logTrackerEvent(this, 'NFT', 'NFTGoToMyPage', 'NFTGoToMyPage', 1);
      this.$emit('go-dashboard');
      this.navigateToMyDashboard();
    },
  },
};
</script>
