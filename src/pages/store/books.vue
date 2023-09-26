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
      <h2 class="text-[#3AB7A2] text-[48px] font-proxima font-[600]">{{ $t('home_section_book_title') }}</h2>
      <ul class="flex flex-col items-stretch gap-[4rem] w-full max-w-[840px] mx-auto mt-[48px]">
        <li
          v-for="nft in nftBooks"
          :key="nft.classId"
        >
          <NFTBookItemCard
            :class-id="nft.classId"
            preset="default"
            @click.native="() => handleClickItem(nft.classId)"
            @click-avatar="() => handleClickItemAvatar(nft.classId)"
          />
        </li>
      </ul>
    </section>
  </Page>
</template>

<script>
import { LIKECOIN_NFT_BOOK_ITEMS } from '~/constant';

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
      return LIKECOIN_NFT_BOOK_ITEMS.map(classId => ({ classId }));
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
