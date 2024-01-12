<template>
  <main
    class="
      about-page
      page-content
      text-gray-4a
      leading-[1.25]
      max-w-[1024px]
      w-full
      mx-auto
      pb-[132px]
    "
  >
    <NFTAboutPage />
  </main>
</template>

<script>
import { EXTERNAL_HOST } from '~/constant';

export default {
  name: 'AboutWritingNFTPage',
  layout: 'default',
  head() {
    const title = this.$t('about_nft_page_title');
    const description = this.$t('about_nft_page_description');
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
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify({
            '@context': 'http://www.schema.org',
            '@type': 'FAQPage',
            about: {
              '@type': 'Brand',
              url: `${EXTERNAL_HOST}/about/writing-nft`,
              name: 'Writing NFT',
            },
            mainEntity: this.$t('faq_list').map(
              ({ q: question, a: answer }) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: answer,
                },
              })
            ),
          }),
          type: 'application/ld+json',
          body: true,
        },
      ],
    };
  },
};
</script>
