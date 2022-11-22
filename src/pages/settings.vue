<template>
  <div class="settings-page">
    <main class="page-content.page-content--narrow">
      <SettingsPageHeader :is-show-back="isHeaderShowBack" />
      <NuxtChild />
    </main>
  </div>
</template>

<script>
import SettingsPageHeader from '~/components/SettingsPageHeader';

export default {
  name: 'SettingsPage',
  layout: 'default',
  components: {
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
