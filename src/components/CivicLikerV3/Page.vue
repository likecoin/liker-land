<template>
  <div class="civic-dashboard">
    <div class="w-full mx-auto max-w-phone phone:px-12 tablet:px-12">
      <header class="flex items-center justify-between mb-24">
        <div class="flex items-center">
          <img
            src="~/assets/images/civic-liker-icon.png"
            :alt="$t('civic_page_v3_title')"
            style="height:64px; width:68px"
          >
          <span class="ml-16 text-like-green text-24">{{
            $t('civic_page_v3_title')
          }}</span>
        </div>
        <Button
          :title="$t('civicLiker.about')"
          preset="secondary-outline"
          :href="$t('civic_dashboard_v3_about_url')"
          target="_blank"
          rel="noreferrer noopener"
        >
          <template #prepend>
            <AlertCircle class="w-16 ml-4" />
          </template>
          <template #append>
            <ExternalLink class="w-16" />
          </template>
        </Button>
      </header>
      <CivicDashboardV3 class="pb-64" />
    </div>
  </div>
</template>

<script>
import AlertCircle from '~/assets/icons/alert-circle.svg?inline';
import ExternalLink from '~/assets/icons/external-link.svg?inline';

import Button from '../LegacyButton/Button';

import CivicDashboardV3 from './Dashboard';

export default {
  layout: 'default',
  components: {
    AlertCircle,
    ExternalLink,
    Button,
    CivicDashboardV3,
  },
};
</script>
