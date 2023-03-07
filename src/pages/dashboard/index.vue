<template>
  <Page class="px-[8px]">
    <div
      v-if="!getAddress"
      class="flex flex-col items-center justify-center h-[80vh] mt-[-80px]"
    >
      <ButtonV2
        preset="tertiary"
        :text="$t('header_button_connect_to_wallet')"
        @click="connectWallet"
      />
    </div>
    <template v-else>
      <!-- UserStat -->
      <div class="flex flex-col justify-center items-center mb-[24px] laptop:mb-[48px] w-full max-w-[736px]">
        <UserStatsMyDashboard
          class="flex flex-col items-center w-full laptop:flex-row"
          :stat-wallet="getAddress"
          @go-created="handleGoCreated"
          @go-collected="handleGoCollected"
        />
        <NFTPortfolioTopUsersList
          v-if="topRankedUsers && topRankedUsers.length"
          class="mt-[12px]"
          type="creator"
          :is-card="false"
          :user-list="topRankedUsers"
          @hover="handleTopUserHover"
          @click="handleTopUserClick"
        >
          <template #append>
            <Label
              class="w-min font-600 text-medium-gray mt-[4px]"
              :text="$t('nft_portfolio_page_label_collector_top_ranked_creators')"
              preset="h6"
              align="center"
              valign="middle"
            />
          </template>
        </NFTPortfolioTopUsersList>
      </div>

      <!-- Main -->
      <NFTPortfolioMainView
        key="dashboard"
        ref="portfolioMainView"
        :portfolio-wallet="getAddress"
        :portfolio-tab="currentTab"
        :portfolio-items="currentNFTClassList"
        :portfolio-items-show-count="currentNFTClassListShowCount"
        :portfolio-items-sorting="currentNFTClassListSorting"
        :portfolio-items-sorting-order="currentNFTClassListSortingOrder"
        :portfolio-items-sorting-option-list="currentNFTClassSortingOptionList"
        :portfolio-items-filtering="{ creator: nftCreatorFilter }"
        :portfolio-collected-creator-list="nftCreatorInfoListOfCollected"
        :is-loading-portfolio-items="isLoading"
        :is-show-other-tab="isShowOtherTab"
        @portfolio-change-tab="handleTabChange"
        @portfolio-change-sorting="handleNFTClassListSortingChange"
        @portfolio-change-filtering="handleNFTClassListFilteringChange"
        @infinite-scroll="handleInfiniteScroll"
      >
        <template #tab-bar-prepend>
          <ButtonV2
            preset="tertiary"
            size="small"
            :text="$t('dashboard_portfolio_button')"
            :class="[
              'block',

              'laptop:absolute',
              'laptop:left-0',
              'laptop:ml-[32px]',

              'rounded-full',
            ]"
            @click="goMyPortfolio"
          >
            <template #prepend>
              <IconView />
            </template>
          </ButtonV2>
        </template>
      </NFTPortfolioMainView>

    </template>
  </Page>
</template>

<script>
import { mapActions } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

import { createPorfolioMixin, tabOptions } from '~/mixins/portfolio';
import walletMixin from '~/mixins/wallet';
import { getCollectorTopRankedCreators } from '~/util/api';
import { fisherShuffle } from '~/util/misc';

export default {
  name: 'MyDashboardPage',
  layout: 'default',
  mixins: [
    walletMixin,
    createPorfolioMixin({ shouldApplyDisplayState: false }),
  ],
  head() {
    const title = this.$t('dashboard_title');
    const description = this.$t('dashboard_description');
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
    };
  },
  data() {
    return {
      topRankedUsers: [],
    };
  },
  computed: {
    wallet() {
      return this.getAddress;
    },
  },
  watch: {
    getAddress(newAddress) {
      if (newAddress) {
        this.fetchUserInfo();
        this.loadNFTListByAddress(this.getAddress);
        this.updateTopRankedCreators();
      }
    },
  },
  mounted() {
    this.syncRouteForTab();
    if (this.getAddress) {
      this.loadNFTListByAddress(this.getAddress);
      this.updateTopRankedCreators();
    }
  },
  methods: {
    ...mapActions(['fetchUserInfoByAddress']),
    async fetchUserInfo() {
      try {
        await this.fetchUserInfoByAddress(this.getAddress);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async updateTopRankedCreators() {
      const res = await this.$axios.$get(
        getCollectorTopRankedCreators(this.getAddress)
      );
      if (res.creators) {
        let users = (await Promise.all(
          // res.creators can be array of address, or array of { creator: address }
          res.creators.map(c => this.lazyGetUserInfoByAddress(c.creator || c))
        )).map((c, i) => ({
          id: res.creators[i].creator || res.creators[i],
          ...c,
        }));
        if (users && users.length > 10) {
          users = fisherShuffle(users);
          users = users.slice(0, 10);
        }
        this.topRankedUsers = users;
      } else {
        this.topRankedUsers = res.creators;
      }
    },
    handleTopUserHover(i) {
      logTrackerEvent(
        this,
        'MyDashboard',
        `dashboard_top_faned_creators_hover`,
        `${i}`,
        1
      );
    },
    handleTopUserClick(i) {
      logTrackerEvent(
        this,
        'MyDashboard',
        `dashboard_top_faned_creators_hover`,
        `${i}`,
        1
      );
    },
    handleGoCollected() {
      this.handleTabChange(tabOptions.collected);
    },
    handleGoCreated() {
      this.handleTabChange(tabOptions.created);
    },
    handleTabChange(tab) {
      switch (tab) {
        case tabOptions.collected:
          logTrackerEvent(
            this,
            'MyDashboard',
            'GoCollectedTab',
            this.wallet,
            1
          );
          break;

        case tabOptions.created:
          logTrackerEvent(this, 'MyDashboard', 'GoCreatedTab', this.wallet, 1);

          break;
        case tabOptions.other:
          logTrackerEvent(this, 'MyDashboard', 'GoOtherTab', this.wallet, 1);
          break;

        default:
          break;
      }
      this.changeTab(tab);
    },
    goMyPortfolio() {
      logTrackerEvent(this, 'MyDashboard', 'GoToMyPortfolio', this.wallet, 1);
      this.$router.push(
        this.localeLocation({
          name: 'id',
          params: { id: this.wallet },
        })
      );
    },
  },
};
</script>
