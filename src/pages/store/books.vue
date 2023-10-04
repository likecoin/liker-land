<template>
  <Page
    :class="[
      'w-full',
      'max-w-[960px]',
      'mx-auto',
      'laptop:px-[32px]',
      'px-[12px]',
      'pb-[132px]',
    ]"
  >
    <section class="w-full">
      <h2 class="text-[#3AB7A2] text-[48px] font-proxima font-[600]">{{ $t('store_books_page_title') }}</h2>
      <NFTBookShelf
        class="mt-[3rem]"
        :items="nftBooks"
        @click-item="handleClickItem"
        @click-item-avatar="handleClickItemAvatar"
      />
    </section>
  </Page>
</template>

<script>
import {
  LIKECOIN_NFT_BOOK_FEATURED_ITEMS,
  LIKECOIN_NFT_BOOK_ITEMS,
} from '~/constant';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'StoreAllBooksPage',
  head() {
    const link = [{ rel: 'canonical', href: `${this.$route.path}` }];
    LIKECOIN_NFT_BOOK_ITEMS.forEach(classId => {
      link.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${classId}`,
      });
    });
    return {
      link,
    };
  },
  computed: {
    nftBooks() {
      const books = [
        ...LIKECOIN_NFT_BOOK_FEATURED_ITEMS,
        ...LIKECOIN_NFT_BOOK_ITEMS,
      ];
      books.sort((a, b) => new Date(b.date) - new Date(a.date));
      return books;
    },
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
