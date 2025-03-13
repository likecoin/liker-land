<template>
  <main class="flex flex-col items-center justify-center">
    <ProgressIndicator />
  </main>
</template>

<script>
import { mapGetters } from 'vuex';

import bookstoreMixin from '~/mixins/bookstore';

import { logRetailEvent } from '~/util/EventLogger';

export default {
  name: 'IndexV3',
  mixins: [bookstoreMixin],
  async fetch({ store, route }) {
    const { t } = route.query;
    try {
      await Promise.all([
        store.dispatch('fetchBookstoreCMSProductsForLandingPage', { t }),
        store.dispatch('lazyFetchBookstoreCMSProductsByTagId', {
          tagId: 'landing-latest',
          t,
        }),
      ]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  head() {
    const title = this.$t('og_title');
    const description = this.$t('og_description');

    const classIds = Array.from(
      new Set(
        this.editorialBookstoreItems.map(b => b.classIds || b.classId).flat()
      )
    );
    const links = [];
    classIds.forEach(classId =>
      links.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${classId}`,
      })
    );

    const meta = [
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
    ];

    const script = [
      {
        hid: 'schema-faq',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: this.faqs.map(({ question, answer }) => ({
            '@context': 'http://www.schema.org',
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
              '@context': 'http://www.schema.org',
              '@type': 'Answer',
              text: answer,
            },
          })),
        }),
        type: 'application/ld+json',
        body: true,
      },
      {
        hid: 'elfsight',
        src: 'https://apps.elfsight.com/p/platform.js',
        defer: true,
        dataUseServiceCore: 'data-use-service-core',
      },
    ];

    return {
      title,
      meta,
      link: links,
      script,
    };
  },
  computed: {
    ...mapGetters(['getIsRestoringSession', 'walletIsMatchedSession']),
    editorialBookstoreItems() {
      return this.nftBookstoreCMSProductsForLandingPage.filter(
        item =>
          !item.locales ||
          item.locales.some(locale => this.$i18n.locale.includes(locale))
      );
    },
    faqs() {
      return this.$t('index_faq_list').map(({ q: question, a: answer }) => ({
        question,
        answer,
      }));
    },
  },
  mounted() {
    logRetailEvent(this, 'home-page-view');
  },
};
</script>
