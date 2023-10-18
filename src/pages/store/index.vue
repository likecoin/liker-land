<template>
  <Page class="pb-[132px]">
    <NFTBookHero />

    <div
      :class="[
        'w-full',
        'max-w-[960px]',
        'mx-auto',
        'mt-[4.5rem]',
        'laptop:px-[32px]',
        'px-[12px]',
      ]"
    >
      <section>
        <h2 class="text-[#3AB7A2] text-[48px] font-proxima font-[600]">{{ $t('home_section_book_title') }}</h2>
        <div class="flex flex-col items-stretch w-full max-w-[840px] mx-auto mt-[48px]">
          <NFTBookItemCard
            v-if="nftBooks.length > 0"
            :class-id="nftBooks[0].classId"
            preset="campaign"
            @click.native="() => onClickCampaignItem(nftBooks[0].classId)"
            @click-avatar="() => onClickCampaignItemAvatar(nftBooks[0].classId)"
          />
          <NFTBookShelf
            class="mt-[48px]"
            :items="nftBooksOnShelf"
            @click-item="onClickShelfItem"
            @click-item-avatar="onClickShelfItemAvatar"
          />
        </div>
      </section>

      <footer class="flex flex-wrap justify-center items-center mt-[3rem] gap-[0.5rem]">
        <ButtonV2
          preset="secondary"
          :text="$t('store_nft_book_more_button')"
          :to="localeLocation({ name: 'store-books' })"
          @click.native="handleClickNFTBookMoreButton"
        />
        <ButtonV2
          preset="outline"
          :text="$t('store_articles_button')"
          :to="localeLocation({ name: 'store-articles' })"
          @click.native="handleClickViewArticlesButton"
        />
      </footer>
    </div>

  </Page>
</template>

<script>
import { LIKECOIN_NFT_BOOK_FEATURED_ITEMS, EXTERNAL_HOST } from '~/constant';

import { checkIsLikeCoinAppInAppBrowser } from '~/util/client';
import { logTrackerEvent } from '~/util/EventLogger';

import inAppMixin from '~/mixins/in-app';
import navigationListenerMixin from '~/mixins/navigation-listener';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'WritingNFTPage',
  mixins: [inAppMixin, navigationListenerMixin, walletMixin],
  layout: 'default',
  head() {
    const title = this.$t('store_index_page_title');
    const description = this.$t('store_books_page_descripition');
    const link = [{ rel: 'canonical', href: `${this.$route.path}` }];
    LIKECOIN_NFT_BOOK_FEATURED_ITEMS.forEach(nft => {
      link.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${nft.classId}`,
      });
    });
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
      link,
    };
  },
  computed: {
    nftBooks() {
      return LIKECOIN_NFT_BOOK_FEATURED_ITEMS;
    },
    nftBooksOnShelf() {
      return this.nftBooks.slice(1);
    },
  },
  mounted() {
    // NOTE: Redirect to store-articles page if in LikeCoin App
    if (checkIsLikeCoinAppInAppBrowser(this.$route)) {
      this.$router.replace(this.localeLocation({ name: 'store-articles' }));
    }
  },
  methods: {
    handleClickNFTBookMoreButton() {
      logTrackerEvent(this, 'Store', 'StoreViewMoreNFTBookClick', '', 1);
    },
    handleClickViewArticlesButton() {
      logTrackerEvent(this, 'Store', 'StoreViewArticlesClick', '', 1);
    },
    onClickCampaignItem(classId) {
      logTrackerEvent(
        this,
        'nft_book_featured',
        'nft_book_campaign_click_book',
        classId,
        1
      );
    },
    onClickCampaignItemAvatar(classId) {
      logTrackerEvent(
        this,
        'nft_book_featured',
        'nft_book_campaign_click_avatar',
        classId,
        1
      );
    },
    onClickShelfItem(classId) {
      logTrackerEvent(
        this,
        'nft_book_featured',
        'nft_book_shelf_click_book',
        classId,
        1
      );
    },
    onClickShelfItemAvatar(classId) {
      logTrackerEvent(
        this,
        'nft_book_featured',
        'nft_book_shelf_click_avatar',
        classId,
        1
      );
    },
  },
};
</script>
