<template>
  <CivicPageV3 />
</template>

<script>
import CivicPageV3 from '~/components/CivicLikerV3/Page';

export default {
  components: {
    CivicPageV3,
  },
  fetch({ redirect, store }) {
    if (store.getters.getUserId) {
      redirect({ name: 'civic-dashboard' });
    }
  },
  head() {
    const title = this.$t('civic_page_v3_title');
    const description = this.$t('civic_page_v3_description');
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/civic-v3.png',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
    };
  },
};
</script>
