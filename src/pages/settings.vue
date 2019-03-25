<template>
  <div class="settings-page bg-gray-f7">
    <PageHeader>
      <template>
        <SiteNavBar class="text-like-green" />
      </template>
    </PageHeader>

    <main class="page-content page-content--narrow">
      <SettingsPageHeader />
      <nuxt-child />
    </main>
  </div>
</template>

<script>
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import SettingsPageHeader from '~/components/SettingsPageHeader';

export default {
  name: 'SettingsPage',
  middleware: 'authenticated',
  components: {
    PageHeader,
    SiteNavBar,
    SettingsPageHeader,
  },
  head() {
    return {
      title: this.$t('SettingsPage.title'),
    };
  },
};
</script>
