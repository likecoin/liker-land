<template>
  <NFTBookShelf
    class="w-full"
    :items="nftBookstoreLatestPaidItems"
    @click-item="handleClickItem"
    @click-item-avatar="handleClickItemAvatar"
  />
</template>

<script>
import { mapGetters } from 'vuex';
import { EXTERNAL_HOST } from '~/constant';

import { parseNFTMetadataURL } from '~/util/nft';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'StorePaidBooksPage',
  async fetch({ store }) {
    try {
      await store.dispatch('fetchBookstoreLatestItems');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  head() {
    const link = [{ rel: 'canonical', href: `${this.$route.path}` }];
    this.nftBookstoreLatestPaidItems.forEach(classId => {
      link.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${classId}`,
      });
    });
    const title = this.$t('store_books_page_title');
    const description = this.$t('store_books_page_description');

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'DataFeed',
      dataFeedElement: this.nftBookstoreLatestPaidItems
        .filter(c => this.getNFTClassMetadataById(c.classId))
        .map(c => {
          const {
            name: className,
            description: classDescription,
            image: classImage = '',
            iscn_owner: iscnOwner,
          } = this.getNFTClassMetadataById(c.classId);
          const iscnOwnerPerson = iscnOwner
            ? {
                '@context': 'http://www.schema.org',
                '@type': 'Person',
                url: `${EXTERNAL_HOST}/${iscnOwner}`,
                identifier: iscnOwner,
              }
            : undefined;

          return {
            '@context': 'http://www.schema.org',
            '@type': 'Book',
            '@id': `${EXTERNAL_HOST}/nft/class/${c.classId}`,
            name: className,
            description: classDescription,
            image: parseNFTMetadataURL(classImage),
            url: `${EXTERNAL_HOST}/nft/class/${c.classId}`,
            author: iscnOwnerPerson,
            identifier: c.classId,
          };
        }),
    };
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
          content: `${EXTERNAL_HOST}/images/og/${
            this.$i18n.locale === 'zh-Hant' ? 'book-zh.png' : 'book.png'
          }`,
        },
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify(schema),
          type: 'application/ld+json',
          body: true,
        },
      ],
      link,
    };
  },
  computed: {
    ...mapGetters(['nftBookstoreLatestPaidItems', 'getNFTClassMetadataById']),
  },
  methods: {
    handleClickItem(classId) {
      logTrackerEvent(this, 'Store', 'StoreBooksItemClick', classId, 1);
    },
    handleClickItemAvatar(classId) {
      logTrackerEvent(this, 'Store', 'StoreBooksItemAvatarClick', classId, 1);
    },
  },
};
</script>
