<template>
  <div class="settings-page">
    <PageHeader>
      <template>
        <SiteNavBar class="text-like-green" />
      </template>
    </PageHeader>

    <main class="page-content page-content--narrow">
      <SettingsPageHeader :is-show-back="isHeaderShowBack" />
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
  computed: {
    isHeaderShowBack() {
      return /^settings-.+$/.test(this.$route.name);
    },
  },
  head() {
    return {
      title: this.$t('SettingsPage.title'),
    };
  },
};
</script>
