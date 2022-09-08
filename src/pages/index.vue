<template>
  <main class="laptop:-mt-[120px] text-gray-4a">
    <NFTAboutPage />
  </main>
</template>

<script>
export default {
  name: 'HomePage',
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
    };
  },
};
</script>
