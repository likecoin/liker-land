<template>
  <nav class="grid items-center justify-center grid-flow-row laptop:grid-flow-col gap-[16px]">
    <ButtonV2
      preset="secondary"
      :text="$t('about_nft_page_nav_campaign')"
      :to="localeLocation({ name: 'index' })"
      @click.native="handleClickCampaignPageButton"
    />
  </nav>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'NFTCTASection',
  methods: {
    handleClickCampaignPageButton() {
      // Legacy event
      logTrackerEvent(this, 'NFT', 'NFTGoToCampaign', 'NFTGoToCampaign', 1);
      this.$emit('go-campaign');
    },
  },
};
</script>
