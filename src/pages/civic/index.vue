<template>
  <CivicPageV3 />
</template>

<script>
import { EXTERNAL_HOST } from '~/constant';
import CivicPageV3 from '~/components/CivicLikerV3/Page';

export default {
  components: {
    CivicPageV3,
  },
  head() {
    const title = this.$t('civic_page_v3_title');
    const description = this.$t('civic_page_v3_description');
    const ogImage = 'https://liker.land/images/og/civic-v3.png';
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
          content: ogImage,
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify([
            {
              '@context': 'http://www.schema.org',
              '@type': 'Product',
              name: title,
              image: [ogImage],
              description,
              brand: {
                '@type': 'Brand',
                name: 'Civic Liker',
              },
              url: `${EXTERNAL_HOST}${this.$route.path}`,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'InStock',
              },
            },
          ]),
          type: 'application/ld+json',
          body: true,
        },
      ],
    };
  },
};
</script>
