<template>
  <div class="civic-dashboard">
    <PageHeader>
      <SiteNavBar class="text-like-green" />
    </PageHeader>
    <div class="w-full mx-auto max-w-phone phone:px-12 tablet:px-12">
      <header class="flex items-center justify-between mb-24">
        <div class="flex items-center">
          <img
            src="~/assets/images/civic-liker-icon.svg?inline"
            :alt="$t('civic_liker_dashboard_header_title')"
            style="width:68px"
          >
          <span class="ml-16 text-like-green text-24">{{
            $t('civic_liker_dashboard_header_title')
          }}</span>
        </div>
        <Button :title="$t('civicLiker.about')" preset="secondary-outline" />
      </header>
      <CivicLikerWeb3Notice v-if="!shouldShowV3Dashboard" class="mb-32" />
      <CivicDashboardV3 v-if="shouldShowV3Dashboard" class="pb-64" />
      <CivicDashboardV2 v-else-if="shouldShowV2Dashboard" />
      <CivicSettingsV1 v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Button from '~/components/Button/Button';
import CivicLikerWeb3Notice from '~/components/CivicLikerWeb3Notice';
import CivicSettingsV1 from '~/components/CivicSettingsV1';
import CivicDashboardV2 from '~/components/CivicDashboard';
import CivicDashboardV3 from '~/components/CivicLikerV3/Dashboard';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  components: {
    Button,
    CivicLikerWeb3Notice,
    CivicSettingsV1,
    CivicDashboardV2,
    CivicDashboardV3,
    PageHeader,
    SiteNavBar,
  },
  computed: {
    ...mapGetters(['getUserIsCivicLikerV2', 'getUserIsCivicLiker']),
    shouldShowV2Dashboard() {
      return !!(this.getUserIsCivicLikerV2 || !this.getUserIsCivicLiker);
    },
    shouldShowV3Dashboard() {
      // TODO
      return true;
    },
  },
};
</script>
