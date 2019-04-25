<template lang="pug">
  .settings-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content.page-content--narrow
      SettingsPageHeader(:is-show-back="isHeaderShowBack")

      NuxtChild
</template>

<script>
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import SettingsPageHeader from '~/components/SettingsPageHeader';

export default {
  name: 'SettingsPage',
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
