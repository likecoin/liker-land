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
    <template v-if="!isInInAppBrowser">
      <NFTAboutPageHeroSection
        :is3DPrintDay="is3DPrintDay"
        class="w-full"
      />
      <div
        v-if="is3DPrintDay"
        class="mt-[-36px] mb-[48px] desktop:mt-[-64px]"
      >
        <div class="flex flex-grow items-center justify-center text-center p-[32px]">
          {{ $t('about_nft_page_hero_3d_print_mobile') }}
        </div>
        <div
          class="grid grid-cols-5 overflow-x-hidden"
        >
          <client-only>
            <div
              v-for="(classId, index) in trendingClassIds.slice(0, 10)"
              :key="classId"
            >
              <model-viewer
                style="width: 20vw; aspect-ratio: 4/3; max-width: 200px; max-height: 150px;"
                :src="getNFTModel({ classId })"
                ar
                auto-rotate
                auto-rotate-delay="500"
                xr-environment
                shadow-intensity="1"
                :camera-orbit="`${315 * index}deg 60deg 100m`"
                @click="e => handleNFTModelClick(e, classId)"
              >
                <button slot="ar-button" style="display:none" />
              </model-viewer>
            </div>
          </client-only>
          <hr>
        </div>
      </div>

      <nav
        :class="[
          'grid',
          'items-center',
          'justify-center',
          'grid-flow-row',
          'laptop:grid-flow-col',
          'gap-[16px]',
          'mb-[80px]',
        ]"
      >
        <ButtonV2
          preset="secondary"
          :text="$t('home_button_about_writing_nft')"
          :to="localeLocation({ name: 'writing-nft-about' })"
          @click.native="handleClickAboutWritingNFTButton"
        />
        <ButtonV2
          preset="tertiary"
          :text="$t('about_nft_page_nav_collection')"
          @click="handleClickMyDashboardButton"
        />
      </nav>
    </template>

    <section
      :class="[
        'w-full',
        'max-w-[416px]',
        'laptop:max-w-full',
        'mx-auto',
        'px-[24px]',
        { 'pt-[32px]': isInInAppBrowser },
        'laptop:px-[40px]',
      ]"
    >
      <nav class="flex items-center justify-center">
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
            :id="classId"
            :class-id="classId"
            :story-title="storyTitle"
            :story-description="storyDescription"
          />
        </li>
      </ul>
    </section>

    <section
      v-if="!isInInAppBrowser"
      class="mt-[88px] px-[24px]"
    >
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

import {
  getNFTClassesPartial,
  getTopNFTClasses,
  getISCNRecord,
  getNFTModel,
} from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';

import inAppMixin from '~/mixins/in-app';
import navigationListenerMixin from '~/mixins/navigation-listener';
import walletMixin from '~/mixins/wallet';

const MAX_NFT_CLASS_COUNT_PER_OWNER = 2;
const NFT_CLASS_DISPLAY_COUNT = 10;

export default {
  name: 'WritingNFTPage',
  layout: 'default',
  mixins: [inAppMixin, navigationListenerMixin, walletMixin],
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
      link: [
        { rel: 'canonical', href: `${this.$route.path}` },
        {
          rel: 'modulepreload',
          href:
            'https://unpkg.com/@google/model-viewer@3.0.2/dist/model-viewer.min.js',
          as: 'script',
        },
      ],
      script: [
        {
          type: 'module',
          src:
            'https://unpkg.com/@google/model-viewer@3.0.2/dist/model-viewer.min.js',
          asyc: 'true',
        },
      ],
    };
  },
  data() {
    return {
      is3DPrintDay: new Date().getMonth() === 3 && new Date().getDate() === 1,
      trendingClassIds: [],
      latestClassIds: [],
    };
  },
  computed: {
    currentTab() {
      return this.$route.query.tab || 'featured';
    },
    nftClassIds() {
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
    const trendingDate = new Date();
    trendingDate.setDate(trendingDate.getDate() - 14);
    const trendingDayString = trendingDate.toISOString().split('T')[0];
    const [trendingRes, latestRes] = await Promise.all([
      this.$axios.$get(
        getTopNFTClasses({
          after: new Date(trendingDayString).getTime() / 1000,
        })
      ),
      this.$axios.$get(getNFTClassesPartial({ reverse: true })),
    ]);
    const [trendingClasses, latestClasses] = [trendingRes, latestRes].map(res =>
      (res.classes || []).filter(
        c => c.metadata?.nft_meta_collection_id === 'likerland_writing_nft'
      )
    );
    this.latestClassIds = latestClasses
      .slice(0, NFT_CLASS_DISPLAY_COUNT)
      .map(c => c.id);
    this.trendingClassIds = await this.filterNFTClassesByOwner(trendingClasses);
  },
  methods: {
    getNFTModel,
    handleNFTModelClick(e, classId) {
      if (e.target.canActivateAR) {
        e.target.activateAR();
        return;
      }
      this.$nextTick(() => {
        try {
          const el = document.querySelector(`#${classId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } catch {
          // No-op
        }
      });
    },
    async getClassOwner(classData) {
      try {
        const iscnPrefix = classData.parent.iscn_id_prefix;
        const data = await this.$axios.$get(getISCNRecord(iscnPrefix));
        return data.owner;
      } catch (err) {
        console.error(`Failed to fetch owner of ${classData.id}`);
        return null;
      }
    },
    async filterNFTClassesByOwner(nftClasses) {
      const ownerList = await Promise.all(
        // use 3 times of display count to ensure enough classes
        nftClasses.slice(0, NFT_CLASS_DISPLAY_COUNT * 3).map(this.getClassOwner)
      );
      const filteredNFTClasses = [];
      const ownerToNFTClassCountMap = {};
      for (let i = 0; i < ownerList.length; i += 1) {
        const owner = ownerList[i];
        if (!ownerToNFTClassCountMap[owner]) {
          ownerToNFTClassCountMap[owner] = 0;
        }
        if (ownerToNFTClassCountMap[owner] < MAX_NFT_CLASS_COUNT_PER_OWNER) {
          filteredNFTClasses.push(nftClasses[i].id);
          ownerToNFTClassCountMap[owner] += 1;
        }
        if (filteredNFTClasses.length >= NFT_CLASS_DISPLAY_COUNT) break;
      }
      return filteredNFTClasses;
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
  },
};
</script>
