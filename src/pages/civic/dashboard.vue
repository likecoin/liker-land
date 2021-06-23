<template>
  <div class="civic-dashboard">
    <PageHeader>
      <SiteNavBar class="text-like-green" />
    </PageHeader>
    <div class="w-full max-w-phone mx-auto phone:px-12 tablet:px-12">
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
        <Button
          :title="$t('civic_liker_dashboard_header_about_button')"
          :to="{ name: 'civic' }"
          preset="primary-outline"
        />
      </header>
      <CivicDashboard v-if="getUserIsCivicLikerV2" />
      <CivicSettingsV1 v-else />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { DEFAULT_CL_SUPPORTER } from '~/constant';

import Button from '~/components/Button/Button';
import CivicSettingsV1 from '~/components/CivicSettingsV1';
import CivicDashboard from '~/components/CivicDashboard';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  middleware: 'authenticated',
  components: {
    Button,
    CivicSettingsV1,
    CivicDashboard,
    PageHeader,
    SiteNavBar,
  },
  computed: {
    ...mapGetters(['getUserIsCivicLikerV2']),
  },
  fetch({ store, redirect }) {
    const { getUserIsCivicLiker, getUserShouldRenewCivic } = store.getters;
    if (!getUserIsCivicLiker && !getUserShouldRenewCivic) {
      redirect({ name: 'id-civic', params: { id: DEFAULT_CL_SUPPORTER } });
    }
  },
};
</script>
