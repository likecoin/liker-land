<template lang="pug">
  .getapp-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      GetAppPage(:from="$route.query.from")
</template>

<script>
import GetAppPage from '~/components/GetAppPage/GetAppPage';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

import { CrispMixinFactory } from '~/mixins/crisp';

export default {
  components: {
    GetAppPage,
    PageHeader,
    SiteNavBar,
  },
  mixins: [CrispMixinFactory()],
  head() {
    return {
      title: this.$t('GetAppPage.Title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('GetAppPage.Og.Title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('GetAppPage.Og.Description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('GetAppPage.Og.Description'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/rocket.png',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
};
</script>

<style lang="scss">
.getapp-page {
  background: linear-gradient(20deg, #d2f0f0, #f0e6b4);
}
</style>
