<template>
  <Page class="pb-[132px]">
    <NFTStoreCarousel class="w-full" />

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
        <h2 class="text-[#3AB7A2] text-[48px] font-proxima font-[600]">
          {{ $t('home_section_book_title') }}
        </h2>
        <div
          class="flex flex-col items-stretch w-full max-w-[840px] mx-auto mt-[48px]"
        >
          <NFTBookShelf
            :items="nftBooksDisplayInFullWidth"
            preset="campaign"
            @click-item="onClickCampaignItem"
            @click-item-avatar="onClickCampaignItemAvatar"
          />
          <NFTBookShelf
            class="mt-[48px]"
            :items="nftBooksDisplayOnShelf"
            @click-item="onClickShelfItem"
            @click-item-avatar="onClickShelfItemAvatar"
          />
        </div>
      </section>

      <footer
        class="flex flex-wrap justify-center items-center mt-[3rem] gap-[0.5rem]"
      >
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
import { mapGetters } from 'vuex';

import { EXTERNAL_HOST } from '~/constant';

import {
  checkIsForcedInAppPage,
  checkIsLikeCoinAppInAppBrowser,
} from '~/util/client';
import { parseNFTMetadataURL } from '~/util/nft';
import { logTrackerEvent } from '~/util/EventLogger';

import inAppMixin from '~/mixins/in-app';
import navigationListenerMixin from '~/mixins/navigation-listener';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'StoreIndexPage',
  mixins: [inAppMixin, navigationListenerMixin, walletMixin],
  layout: 'default',
  async fetch({ route, redirect, localeLocation, store }) {
    if (checkIsForcedInAppPage(route)) {
      redirect(301, localeLocation({ name: 'store-articles' }));
    }

    try {
      await store.dispatch('fetchBookstoreList');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  head() {
    const title = this.$t('store_index_page_title');
    const description = this.$t('store_books_page_description');
    const link = [{ rel: 'canonical', href: `${this.$route.path}` }];
    this.nftBooks.forEach(nft => {
      link.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${nft.classId}`,
      });
    });

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'DataFeed',
      dataFeedElement: this.nftBooks
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
    ...mapGetters(['nftGetBookstoreListItems', 'getNFTClassMetadataById']),
    nftBooks() {
      return [
        ...this.nftBooksDisplayInFullWidth,
        ...this.nftBooksDisplayOnShelf,
      ];
    },
    nftBooksDisplayInFullWidth() {
      return this.nftGetBookstoreListItems('highlighted').filter(nft =>
        // Display books of the current locale only
        this.$i18n.locale.includes(nft.locale)
      );
    },
    nftBooksDisplayOnShelf() {
      const { locale } = this.$i18n;
      const books = [...this.nftGetBookstoreListItems('featured')];
      // Display books of the current locale first
      books.sort((a, b) => {
        const aMatchedLocale = locale.includes(a.locale);
        const bMatchedLocale = locale.includes(b.locale);
        if (aMatchedLocale && !bMatchedLocale) {
          return -1;
        }
        if (!aMatchedLocale && bMatchedLocale) {
          return 1;
        }
        return 0;
      });
      return books;
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
