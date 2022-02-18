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
        <Button
          :title="$t('civicLiker.about')"
          preset="secondary-outline"
          href="https://matters.news/@likecoin/%E8%AE%9A%E8%B3%9E%E5%85%AC%E6%B0%91-web3-%E6%94%B9%E7%89%88%E8%BF%8E%E8%99%8E%E5%B9%B4-bafyreiayqigrxbmpsrtzgauwpz5muo2lgssmjlfydafqindgupp3gs7syy"
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
import Button from '../Button/Button';
import PageHeader from '../PageHeader';
import SiteNavBar from '../SiteNavBar';

import CivicDashboardV3 from './Dashboard';

export default {
  components: {
    AlertCircle: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/alert-circle.svg'),
    ExternalLink: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/external-link.svg'),
    Button,
    CivicDashboardV3,
    PageHeader,
    SiteNavBar,
  },
};
</script>
