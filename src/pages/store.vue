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
        <div class="flex flex-col items-stretch w-full max-w-[840px] mx-auto">
          <NFTBookShelf
            :items="bookstoreListItemsInHighlighted"
            preset="campaign"
            @click-item="onClickCampaignItem"
            @click-item-avatar="onClickCampaignItemAvatar"
          />
        </div>
      </section>

      <section class="mt-[6rem]">
        <nav class="flex items-center justify-center mb-[3rem]">
          <ul
            :class="[
              'flex',
              'justify-center',
              'items-center',
              'p-[4px]',
              'bg-shade-gray',
              'rounded-[14px]',
            ]"
          >
            <li
              v-for="(item, index) in tabMenuItemList"
              :key="item.value"
              class="flex items-center"
            >
              <MenuButtonDivider v-if="index > 0" />
              <MenuButton
                :text="item.text"
                :is-selected="item.value === currentTab"
                @click="handleTabClick(item.value)"
              />
            </li>
          </ul>
        </nav>

        <Nuxt />
      </section>

      <footer
        class="flex flex-wrap justify-center items-center mt-[3rem] gap-[0.5rem]"
      >
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

import bookstoreMixin from '~/mixins/bookstore';
import inAppMixin from '~/mixins/in-app';
import navigationListenerMixin from '~/mixins/navigation-listener';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'StoreIndexPage',
  mixins: [inAppMixin, navigationListenerMixin, walletMixin, bookstoreMixin],
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
    const classIds = Array.from(
      new Set(this.nftBooks.map(b => b.classId).flat())
    );
    classIds.forEach(classId =>
      link.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${classId}`,
      })
    );

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'DataFeed',
      dataFeedElement: classIds
        .filter(classId => this.getNFTClassMetadataById(classId))
        .map(classId => {
          const {
            name: className,
            description: classDescription,
            image: classImage = '',
            iscn_owner: iscnOwner,
          } = this.getNFTClassMetadataById(classId);
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
            '@id': `${EXTERNAL_HOST}/nft/class/${classId}`,
            name: className,
            description: classDescription,
            image: parseNFTMetadataURL(classImage),
            url: `${EXTERNAL_HOST}/nft/class/${classId}`,
            author: iscnOwnerPerson,
            identifier: classId,
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
    ...mapGetters(['getNFTClassMetadataById']),
    nftBooks() {
      return this.bookstoreListItemsInHighlighted;
    },
    currentTab() {
      const routeName = this.getRouteBaseName(this.$route);
      switch (routeName) {
        case 'store-paid':
          return 'paid';

        case 'store-free':
          return 'free';

        case 'store':
        default:
          return 'featured';
      }
    },
    tabMenuItemList() {
      return [
        {
          text: this.$t('store_books_page_tab_featured'),
          value: 'featured',
        },
        {
          text: this.$t('store_books_page_tab_paid'),
          value: 'paid',
        },
        {
          text: this.$t('store_books_page_tab_free'),
          value: 'free',
        },
      ];
    },
  },
  mounted() {
    console.log('mounted', this.$route.name);
    // NOTE: Redirect to store-articles page if in LikeCoin App
    if (checkIsLikeCoinAppInAppBrowser(this.$route)) {
      this.$router.replace(this.localeLocation({ name: 'store-articles' }));
    }
  },
  methods: {
    handleTabClick(tab) {
      logTrackerEvent(this, 'Store', `StoreBooksSwitchTab_${tab}`, tab, 1);
      this.$router.push(this.localeLocation({ name: `store-${tab}` }));
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
