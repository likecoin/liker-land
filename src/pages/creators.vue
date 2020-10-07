<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    main.page-content
      CreatorsPage(:liker-id="getUserId")
</template>

<script>
import { mapGetters } from 'vuex';

import CreatorsPage from '~/components/CreatorsPage/CreatorsPage';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

import { CrispMixinFactory } from '~/mixins/crisp';

export default {
  components: {
    CreatorsPage,
    PageHeader,
    SiteNavBar,
  },
  mixins: [CrispMixinFactory({ isBootAtMounted: false })],
  head() {
    return {
      title: this.$t('CreatorsPage.Og.Title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('CreatorsPage.Og.Title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CreatorsPage.Og.Description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('CreatorsPage.Og.Description'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic.png',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
  computed: {
    ...mapGetters(['getUserId']),
  },
};
</script>
