<template lang="pug">
  .settings-page
    main.page-content.page-content--narrow
      SettingsPageHeader(:is-show-back="isHeaderShowBack")

      NuxtChild
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
