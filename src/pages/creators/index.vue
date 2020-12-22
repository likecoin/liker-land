<template lang="pug">
  PageHeader.overflow-x-hidden
    template
      SiteNavBar.text-like-green(class="laptop:pb-32")

    main.page-content.max-w-desktop.w-full.mx-auto
      CreatorsPage
</template>

<script>
import CreatorsPage from '~/components/CreatorsPage/CreatorsPage';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  components: {
    CreatorsPage,
    PageHeader,
    SiteNavBar,
  },
  head() {
    return {
      title: this.$t('CreatorsPageV2.Hero.Title'),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('CreatorsPageV2.Hero.Title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('CreatorsPageV2.Hero.Description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('CreatorsPageV2.Hero.Description'),
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic-v2.png',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
};
</script>
