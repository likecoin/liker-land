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
    <section :class="['w-full', 'max-w-[416px]', 'laptop:max-w-full']">
      <h2 class="text-[#3AB7A2] text-[48px] font-proxima font-[600] inline">
        {{ $t('home_section_articles_title') }}
      </h2>
      <NuxtLink
        class="mx-[6px] align-text-top text-medium-gray hover:text-like-cyan-dark text-[12px] cursor-pointer inline-block"
        :to="localeLocation({ name: 'about-writing-nft' })"
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
        :to="localeLocation({ name: 'about-writing-nft' })"
      >
        {{ $t('home_button_about_writing_nft') }}
      </NuxtLink>
      <a
        v-if="!isInInAppBrowser"
        class="text-medium-gray hover:text-like-cyan-dark text-[12px] leading-[5/3] underline transition-colors cursor-pointer"
        href="https://likecoin.github.io/likecoin-nft-dashboard/"
        target="_blank"
        rel="noopener"
        >{{ $t('campaign_nft_view_nft_dashboard') }}</a
      >
    </section>
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { EXTERNAL_HOST, LIKECOIN_NFT_CAMPAIGN_ITEMS } from '~/constant';

import { parseNFTMetadataURL } from '~/util/nft';

import inAppMixin from '~/mixins/in-app';
import navigationListenerMixin from '~/mixins/navigation-listener';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'ArticleStorePage',
  mixins: [inAppMixin, navigationListenerMixin, walletMixin],
  layout: 'default',
  head() {
    const title = this.$t('campaign_nft_page_title');
    const description = this.$t('campaign_nft_page_description');

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'DataFeed',
      dataFeedElement: this.allNftClassIds
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
            '@type': 'CreativeWork',
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
      ],
      script: [
        {
          hid: 'schema-store',
          innerHTML: JSON.stringify(schema),
          type: 'application/ld+json',
          body: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'nftClassIdListInLatest',
      'nftClassIdListInTrending',
      'nftClassIdListInFree',
      'getNFTClassMetadataById',
    ]),
    currentTab() {
      return this.$route.query.tab || 'trending';
    },
    allNftClassIds() {
      return LIKECOIN_NFT_CAMPAIGN_ITEMS.concat(
        this.nftClassIdListInTrending,
        this.nftClassIdListInFree,
        this.nftClassIdListInLatest
      );
    },
    nftClassIds() {
      switch (this.currentTab) {
        case 'trending': {
          return this.nftClassIdListInTrending;
        }
        case 'free': {
          return this.nftClassIdListInFree;
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
    tabMenuItemList() {
      const items = [
        {
          text: this.$t('nft_index_page_label_trending'),
          value: 'trending',
        },
        {
          text: this.$t('nft_index_page_label_featured'),
          value: 'featured',
        },
        {
          text: this.$t('nft_index_page_label_free'),
          value: 'free',
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
    handleTabClick(tab) {
      const { query } = this.$route;
      this.$router.replace({
        ...this.$route,
        query: { ...query, tab },
      });
    },
  },
};
</script>
