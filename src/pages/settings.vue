<template>
  <main class="w-full max-w-[1140px] mx-auto mb-[48px] flex flex-col px-[16px]">
    <SettingsPageHeader
      v-if="isHeaderShowBack"
      :is-show-back="isHeaderShowBack"
    />
    <NuxtChild />
  </main>
</template>

<script>
import SettingsPageHeader from '~/components/SettingsPageHeader';

export default {
  name: 'SettingsPage',
  components: {
    SettingsPageHeader,
  },
  layout: 'default',
  head() {
    return {
      title: this.$t('SettingsPage.title'),
    };
  },
  computed: {
    isHeaderShowBack() {
      return /^settings-.+$/.test(this.getRouteBaseName(this.$route));
    },
  },
};
</script>
