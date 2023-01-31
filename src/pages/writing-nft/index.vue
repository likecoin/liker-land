<template>
  <main
    class="
      about-page
      page-content
      text-gray-4a
      leading-[1.25]
      max-w-[1024px]
      w-full
      mx-auto
      pb-[132px]
    "
  >
    <section class="relative py-[32px] px-[24px]">
      <NFTCampaignHero class="absolute inset-0" />
      <div class="relative mx-auto">
        <h1
          class="
            font-proxima font-[300]
            text-like-green text-[32px]
            laptop:text-[64px]
            leading-[1.25]
            text-center
          "
        >
          <span class="whitespace-nowrap">{{
            $t('campaign_nft_page_tagline_1')
          }}</span>
          <span class="whitespace-nowrap">{{
            $t('campaign_nft_page_tagline_2')
          }}</span>
        </h1>
        <p
          v-t="'campaign_nft_page_description'"
          class="mt-[16px] max-w-[536px] mx-auto"
        />
      </div>

      <nav class="mt-[24px] relative flex-col laptop:flex-row flex items-center justify-center self-stretch gap-[32px]">
        <slot name="tab-bar-prepend" />
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
    </section>
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
import navigationListenerMixin from '~/mixins/navigation-listener';

export default {
  name: 'CampaignWritingNFTPage',
  layout: 'default',
  mixins: [navigationListenerMixin],
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
      currentTab: this.$route.query.tab || 'featured',
      trendingClassIds: [],
      latestClassIds: [],
    };
  },
  computed: {
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
      this.currentTab = tab;
      const { query } = this.$route;
      this.$router.replace({
        ...this.$route,
        query: { ...query, tab },
      });
    },
  },
};
</script>
