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
    <section v-if="shouldShowNFTBookSection" class="w-full">
      <h2 class="text-[#3AB7A2] text-[48px] font-proxima font-[600]">{{ $t('home_section_book_title') }}</h2>
      <div class="w-full max-w-[840px] mx-auto mt-[48px]">
        <NFTBookItemCard
          v-if="nftBooks.length > 0"
          :class-id="nftBooks[0].classId"
          preset="campaign"
          @click.native="() => onClickCampaignItem(nftBooks[0].classId)"
          @click-avatar="() => onClickCampaignItemAvatar(nftBooks[0].classId)"
        />
        <div class="flex flex-col items-center mt-[48px]">
          <ul
            :class="[
              'grid',
              'grid-cols-1 sm:grid-cols-2 desktop:grid-cols-3',
              'justify-center',
              'gap-[48px]',
              'sm:px-[48px]',
            ]"
          >
            <li
              v-for="({ classId }, index) in nftBooksOnShelf"
              :id="classId"
              :key="classId"
              class="max-w-[220px]"
            >
              <NFTBookItemCard
                :class-id="classId"
                preset="shelf"
                :shelf-class="[
                  // NOTE: Make the shelf appear to be continuous.
                  { 'sm:rounded-l-[0px]': index % 2 !== 0 && index % 3 === 1 },
                  { 'desktop:rounded-l-[0px]': index % 3 === 2 },
                ]"
                @click.native="() => onClickShelfItem(classId)"
                @click-avatar="() => onClickShelfItemAvatar(classId)"
              />
            </li>
            {{ /* NOTE: A dummy to make the book shelf extend to the right if only 1 book in 2 columns */ }}
            <li
              v-for="i in 2"
              :key="`dummy-${i}`"
              :class="[
                'hidden',
                { 'sm:block desktop:!hidden': i === 1 && nftBooksOnShelf.length % 2 > 0 },
                { 'desktop:block': nftBooksOnShelf.length % 3 > 0 },
                'relative',
                'w-full',
                'max-w-[220px]',
                'h-[290px]',
              ]"
            >
              <div
                :class="[
                  'absolute',
                  'inset-x-[-48px]',
                  'inset-y-0',
                  'mt-[48px]',
                  'bg-like-cyan-pale',
                  'rounded-r-[32px]',
                ]"
              />
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section
      :class="[
        'w-full',
        'max-w-[416px]',
        'laptop:max-w-full',
        'mt-[96px]',
      ]"
    >
      <h2 class="text-[#3AB7A2] text-[48px] font-proxima font-[600] inline">{{ $t('home_section_articles_title') }}</h2>
      <NuxtLink
        class="mx-[6px] align-text-top text-medium-gray hover:text-like-cyan-dark text-[12px] cursor-pointer inline-block"
        :to="localeLocation({ name: 'writing-nft-about' })"
      >
        <IconHelp />
      </NuxtLink>
      <nav class="flex items-center justify-center mt-[48px]">
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
              :is-selected="item.isSelected"
              @click="handleTabClick(item.value)"
            />
          </li>
        </ul>
      </nav>

      <ul class="mt-[48px]">
        <li
          v-for="({ classId, storyTitle, storyDescription }, index) in nfts"
          :id="classId"
          :key="classId"
          :class="{ 'mt-[88px]': index > 0 }"
        >
          <NFTCampaignItem
            :class-id="classId"
            :story-title="storyTitle"
            :story-description="storyDescription"
          />
        </li>
      </ul>
    </section>

    <section
      class="mt-[88px] px-[24px] flex flex-wrap justify-center gap-[16px]"
    >
      <NuxtLink
        class="text-medium-gray hover:text-like-cyan-dark text-[12px] leading-[5/3] underline transition-colors cursor-pointer"
        :to="localeLocation({ name: 'writing-nft-about' })"
      >
        {{ $t('home_button_about_writing_nft') }}
      </NuxtLink>
      <a
        v-if="!isInInAppBrowser"
        class="text-medium-gray hover:text-like-cyan-dark text-[12px] leading-[5/3] underline transition-colors cursor-pointer"
        href="https://likecoin.github.io/likecoin-nft-dashboard/"
        target="_blank"
        rel="noopener"
      >{{ $t('campaign_nft_view_nft_dashboard') }}</a>
    </section>
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import {
  LIKECOIN_NFT_CAMPAIGN_ITEMS,
  LIKECOIN_NFT_BOOK_ITEMS,
} from '~/constant';

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
    const title = this.$t('campaign_nft_page_title');
    const description = this.$t('campaign_nft_page_description');
    const link = [{ rel: 'canonical', href: `${this.$route.path}` }];
    LIKECOIN_NFT_BOOK_ITEMS.forEach(item => {
      link.push({
        rel: 'prefetch',
        href: `/api/nft/metadata?class_id=${item}`,
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
      ],
      link,
    };
  },
  computed: {
    ...mapGetters(['nftClassIdListInLatest', 'nftClassIdListInTrending']),
    currentTab() {
      return this.$route.query.tab || 'featured';
    },
    nftClassIds() {
      switch (this.currentTab) {
        case 'trending': {
          return this.nftClassIdListInTrending;
        }
        case 'latest': {
          return this.nftClassIdListInLatest;
        }
        case 'featured':
        default:
          return LIKECOIN_NFT_CAMPAIGN_ITEMS;
      }
    },
    nfts() {
      return this.nftClassIds
        .map(classId => {
          const nft = { classId };
          if (this.currentTab === 'featured') {
            const storyTitleI18nKey = `nft_featured_${classId}_title`;
            const hasStory = this.$te(storyTitleI18nKey);
            if (hasStory) {
              nft.storyTitle = this.$t(storyTitleI18nKey);
              nft.storyDescription = this.$t(
                `nft_featured_${classId}_description`
              );
            }
          }
          return nft;
        })
        .sort((a, b) => {
          if (a.storyTitle && !b.storyTitle) return -1;
          if (!a.storyTitle && b.storyTitle) return 1;
          return 0;
        });
    },
    nftBooks() {
      return LIKECOIN_NFT_BOOK_ITEMS.map(classId => ({ classId }));
    },
    nftBooksOnShelf() {
      return this.nftBooks.slice(1);
    },
    tabMenuItemList() {
      const items = [
        {
          text: this.$t('nft_index_page_label_featured'),
          value: 'featured',
        },
        {
          text: this.$t('nft_index_page_label_trending'),
          value: 'trending',
        },
        {
          text: this.$t('nft_index_page_label_latest'),
          value: 'latest',
        },
      ];

      return items.map(item => ({
        ...item,
        isSelected: item.value === this.currentTab,
      }));
    },
    shouldShowNFTBookSection() {
      return !checkIsLikeCoinAppInAppBrowser(this.$route);
    },
  },
  async mounted() {
    const { hash } = this.$route;
    if (hash) {
      try {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch {
        // No-op
      }
    }
    try {
      await this.lazyFetchLatestAndTrendingNFTClassIdList();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Error occurred when fetching latest and trending WNFTs',
        error
      );
    }
  },
  methods: {
    ...mapActions([
      'lazyFetchLatestAndTrendingNFTClassIdList',
      'lazyGetISCNMetadataById',
    ]),
    async getClassOwner(classData) {
      try {
        const iscnPrefix = classData.parent.iscn_id_prefix;
        const data = await this.lazyGetISCNMetadataById(iscnPrefix);
        return data.owner;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Failed to fetch owner of ${classData.id}`);
        return null;
      }
    },
    handleTabClick(tab) {
      const { query } = this.$route;
      this.$router.replace({
        ...this.$route,
        query: { ...query, tab },
      });
    },
    handleClickAboutWritingNFTButton() {
      logTrackerEvent(
        this,
        'WritingNFTPage',
        'writing_nft_page_click_about_button',
        '',
        1
      );
    },
    handleClickMyDashboardButton() {
      logTrackerEvent(
        this,
        'WritingNFTPage',
        'writing_nft_page_click_about_button',
        '',
        1
      );
      this.navigateToMyDashboard();
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