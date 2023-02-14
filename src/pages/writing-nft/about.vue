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
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://liker.land/images/og/writing-nft.jpg',
        },
      ],
      link: [{ rel: 'canonical', href: `${this.$route.path}` }],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify({
            '@context': 'http://www.schema.org',
            '@type': 'FAQPage',
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
