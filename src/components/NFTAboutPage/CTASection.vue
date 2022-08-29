<template>
  <nav class="grid items-center justify-center grid-flow-row laptop:grid-flow-col gap-[16px]">
    <ButtonV2
      to="/campaign/writing-nft"
      preset="secondary"
      @click="handleClickCampaignPageButton"
    >{{ $t('about_nft_page_nav_campaign') }}</ButtonV2>
    <ButtonV2
      preset="tertiary"
      @click="handleClickMyDashboardButton"
    >{{ $t('about_nft_page_nav_collection') }}</ButtonV2>
  </nav>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

import walletMixin from '~/mixins/wallet';

export default {
  name: 'NFTCTASection',
  mixins: [walletMixin],
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
