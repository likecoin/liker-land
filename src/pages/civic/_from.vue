<template lang="pug">
  .civic-page
    PageHeader
      template
        SiteNavBar.text-like-green

    CivicLikerWeb3Notice.max-w-phone.mx-auto(

    )
</template>

<script>
import { STRIPE_SDK_URL } from '~/constant';

import CivicLikerWeb3Notice from '~/components/CivicLikerWeb3Notice';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  components: {
    PageHeader,
    SiteNavBar,
    CivicLikerWeb3Notice,
  },
  fetch({ redirect, params }) {
    if (params.from) {
      redirect({ name: 'civic' });
    }
  },
  head() {
    const title = this.$t('CivicPage.Og.Title');
    const description = this.$t('CivicPage.Og.Description');
    const image = 'https://liker.land/images/og/civic-v2.png';
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
          content: image,
        },
      ],
      link: [
        {
          hid: 'preload:stripe',
          rel: 'preload',
          href: STRIPE_SDK_URL,
          as: 'script',
        },
      ],
      script: [{ hid: 'stripe', src: STRIPE_SDK_URL }],
    };
  },
};
</script>
