<template>
  <main
    class="
      laptop:-mt-[120px]
      text-gray-4a
      max-w-[1024px]
      w-full
      mx-auto
      pb-[132px]
    "
  >
    <NFTAboutPageHeroSection class="w-full" />
    <section
      class="
        w-full
        max-w-[416px]
        laptop:max-w-full
        mx-auto
        px-[24px]
        laptop:px-[40px]
      "
    >

      <nav class="flex flex-col items-center justify-center self-stretch gap-[32px]">
        <div class="grid items-center justify-center grid-flow-row laptop:grid-flow-col gap-[16px]">
          <ButtonV2
            preset="secondary"
            :text="$t('home_button_about_writing_nft')"
            :to="{ name: 'writing-nft-about' }"
            @click.native="handleClickAboutWritingNFTButton"
          />
          <ButtonV2
            preset="tertiary"
            :text="$t('about_nft_page_nav_collection')"
            @click="handleClickMyDashboardButton"
          />
        </div>

        <ul
          :class="[
            'flex',
            'justify-center',
            'items-center',
            'mt-[48px]',
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
      <ul>
        <li
          v-for="(nftClassId, index) in nfts"
          :id="nftClassId"
          :key="nftClassId"
          :class="{ 'mt-[88px]': index > 0 }"
        >
          <NFTCampaignItem :class-id="nftClassId" />
        </li>
      </ul>
    </section>
    <section class="mt-[88px] px-[24px]">
      <a
        class="flex items-center justify-center mt-[8px] text-medium-gray hover:text-like-cyan-dark text-[12px] leading-[5/3] underline transition-colors cursor-pointer"
        href="https://likecoin.github.io/likecoin-nft-dashboard/"
        target="_blank"
        rel="noopener"
      >{{ $t('campaign_nft_view_nft_dashboard') }}</a>
    </section>
  </main>
</template>

<script>
import { LIKECOIN_NFT_CAMPAIGN_ITEMS } from '~/constant';

import { getLatestNFTClasses, getTopNFTClasses } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';

import navigationListenerMixin from '~/mixins/navigation-listener';
import walletMixin from '~/mixins/wallet';

export default {
  name: 'WritingNFTPage',
  layout: 'default',
  mixins: [navigationListenerMixin, walletMixin],
  head() {
    const title = this.$t('campaign_nft_page_title');
    const description = this.$t('campaign_nft_page_description');
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
  data() {
    return {
      trendingClassIds: [],
      latestClassIds: [],
    };
  },
  computed: {
    currentTab() {
      return this.$route.query.tab || 'featured';
    },
    nfts() {
      switch (this.currentTab) {
        case 'trending': {
          return this.trendingClassIds;
        }
        case 'latest': {
          return this.latestClassIds;
        }
        case 'featured':
        default:
          return LIKECOIN_NFT_CAMPAIGN_ITEMS;
      }
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
    const [trendingRes, latestRes] = await Promise.all([
      this.$axios.$get(getTopNFTClasses()),
      this.$axios.$get(getLatestNFTClasses()),
    ]);
    [this.trendingClassIds, this.latestClassIds] = [trendingRes, latestRes].map(
      res =>
        (res.classes || [])
          .filter(
            c => c.metadata?.nft_meta_collection_id === 'likerland_writing_nft'
          )
          .map(c => c.id)
          .slice(0, 10)
    );
  },
  methods: {
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
  },
};
</script>
