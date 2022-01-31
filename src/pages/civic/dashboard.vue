<template>
  <div class="civic-dashboard">
    <PageHeader>
      <SiteNavBar class="text-like-green" />
    </PageHeader>
    <div class="w-full mx-auto max-w-phone phone:px-12 tablet:px-12">
      <header class="flex items-center justify-between mb-24">
        <img
          src="~/assets/images/civic-liker-icon.svg?inline"
          :alt="$t('civic_liker_dashboard_header_title')"
          style="width:68px"
        >
        <span class="ml-16 text-like-green text-24">{{
          $t('civic_liker_dashboard_header_title')
        }}</span>
      </header>
      <CivicLikerWeb3Notice class="mb-32" />
      <CivicDashboard v-if="shouldShowNewDashboard" />
      <CivicSettingsV1 v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CivicLikerWeb3Notice from '~/components/CivicLikerWeb3Notice';
import CivicSettingsV1 from '~/components/CivicSettingsV1';
import CivicDashboard from '~/components/CivicDashboard';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  middleware: 'authenticated',
  components: {
    CivicLikerWeb3Notice,
    CivicSettingsV1,
    CivicDashboard,
    PageHeader,
    SiteNavBar,
  },
  computed: {
    ...mapGetters(['getUserIsCivicLikerV2', 'getUserIsCivicLiker']),
    shouldShowNewDashboard() {
      return !!(this.getUserIsCivicLikerV2 || !this.getUserIsCivicLiker);
    },
  },
};
</script>
