<template>
  <main class="max-w-[640px] w-full mx-auto mb-[48px] flex flex-col">
    <SettingsPageHeader :is-show-back="isHeaderShowBack" />
    <NuxtChild />
  </main>
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
      return /^settings-.+$/.test(this.getRouteBaseName(this.$route));
    },
  },
  head() {
    return {
      title: this.$t('SettingsPage.title'),
    };
  },
};
</script>
