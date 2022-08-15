<template>
  <div class="about-page bg-gray-f7">
    <main class="page-content text-gray-4a">
      <AboutNFTPage />
    </main>
    <Footer />
  </div>
</template>

<script>
import AboutNFTPage from '../components/AboutNFTPage';
import Footer from '../components/Footer';

export default {
  name: 'AboutPage',
  layout: 'default',
  components: {
    AboutNFTPage,
    Footer,
  },
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
