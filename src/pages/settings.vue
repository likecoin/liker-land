<template>
  <div class="settings-page bg-gray-f7">
    <PageHeader>
      <template>
        <SiteNavBar class="text-like-green" />
      </template>
    </PageHeader>
  </div>
</template>

<script>
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  name: 'SettingsPage',
  middleware: 'authenticated',
  components: {
    PageHeader,
    SiteNavBar,
  },
  head() {
    return {
      title: this.$t('SettingsPage.title'),
    };
  },
};
</script>
