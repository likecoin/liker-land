<template>
  <Page
    :class="[
      'px-[8px]',
      'pb-[120px]',
    ]"
  >
    <AuthRequiredView
      class="w-full max-w-[960px] mx-auto"
      :is-loading-start-immediately="isInInAppBrowser"
      :login-label="$t('dashboard_login_in')"
      :login-button-label="$t('header_button_connect_to_wallet')"
    >
      <!-- UserStat -->
      <div class="flex flex-col justify-center items-center mb-[24px] laptop:mb-[48px] w-full">
        <UserStatsMyDashboard
          :stat-wallet="getAddress"
          @go-created="handleGoCreated"
          @go-collected="handleGoCollected"
          @click-total-sales="handleClickTotalSales"
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
        <div v-if="walletHasLoggedIn" class="flex items-center justify-center mt-[16px]">
          <div
            class="underline transition-all duration-75 cursor-pointer text-[14px] font-600 text-dark-gray hover:text-medium-gray"
            @click="handleClickFollowers"
          >{{ $t('portfolio_follower_title') }}</div>
        </div>
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
        :portfolio-items-creator-filtering="nftCreatorFilter"
        :portfolio-items-type-filtering="nftTypeFilter"
        :portfolio-items-type-filtering-options="nftTypeFilteringOptions"
        :portfolio-collected-creator-list="nftCreatorInfoListOfCollected"
        :is-loading-portfolio-items="isLoading"
        :nft-keyword-list="nftKeywordList"
        :nft-keyword-filtering="nftKeywordsFilter"
        @portfolio-change-tab="handleTabChange"
        @portfolio-change-sorting="handleNFTClassListSortingChange"
        @portfolio-change-creator="handleNFTClassListCreatorChange"
        @portfolio-change-type="handleNFTClassListTypeChange"
        @portfolio-change-keywords="handleNFTKeywordsChange"
        @infinite-scroll="handleInfiniteScroll"
        @portfolio-reset-filter="handleClearFilter"
        @portfolio-input-filter-change-creator="handleCreatorInputFilterChange"
        @portfolio-input-filter-change-keyword="handleKeywordInputFilterChange"
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

      <FollowerDialog
        :is-open-followers-dialog="isOpenFollowersDialog"
        :wallet-is-fetching-followers="walletIsFetchingFollowers"
        :populated-followers="populatedFollowers"
        @close="isOpenFollowersDialog = false"
        @on-export-followers="handleClickExportFollowerList"
      />
      <UserStatsIncomeDetailsDialog
        :address="getAddress"
        :is-open-dialog="isOpenIncomeDetailsDialog"
        :is-loading="isIncomeDetailsLoading"
        :total-sales="walletTotalSales"
        :total-royalty="walletTotalRoyalty"
        :total-resales="walletTotalResales"
        :sales-details="walletSalesDetails"
        :royalty-details="walletRoyaltyDetails"
        :resales-details="walletResalesDetails"
        :target-type="targetType"
        @close="isOpenIncomeDetailsDialog = false"
      />
    </AuthRequiredView>
  </Page>
</template>

<script>
import { mapActions } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

import alertMixin from '~/mixins/alert';
import inAppMixin from '~/mixins/in-app';
import { createPortfolioMixin, tabOptions } from '~/mixins/portfolio';
import walletMixin from '~/mixins/wallet';
import { getCollectorTopRankedCreators } from '~/util/api';
import { fisherShuffle } from '~/util/misc';

const DETAILS_TYPE = {
  ROYALTY: 'royalty',
  SALES: 'sales',
  RESALES: 'resales',
};

export default {
  name: 'MyDashboardPage',
  mixins: [
    alertMixin,
    createPortfolioMixin({ shouldApplyDisplayState: false }),
    inAppMixin,
    walletMixin,
  ],
  layout: 'default',
  data() {
    return {
      topRankedUsers: [],
      targetType: DETAILS_TYPE.SALES,
      isOpenFollowersDialog: false,
      isOpenIncomeDetailsDialog: false,
      isIncomeDetailsLoading: false,
    };
  },
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
          content: 'https://liker.land/images/og/default.jpg',
        },
      ],
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
        this.loadNFTClassesForCurrentTabByAddress(this.getAddress);
        this.fetchNFTDisplayStateListByAddress(this.getAddress);
        this.updateTopRankedCreators();
      }
    },
  },
  mounted() {
    this.syncRouteForTab();
    if (this.getAddress) {
      this.loadNFTClassesForCurrentTabByAddress(this.getAddress);
      this.fetchNFTDisplayStateListByAddress(this.getAddress);
      this.updateTopRankedCreators();
    }
  },
  methods: {
    ...mapActions([
      'fetchUserInfoByAddress',
      'fetchNFTDisplayStateListByAddress',
    ]),
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
    async handleClickTotalSales() {
      logTrackerEvent(
        this,
        'MyDashboard',
        'MyDashboard_sales_click',
        `${this.wallet}`,
        1
      );

      this.isIncomeDetailsLoading = true;
      this.isOpenIncomeDetailsDialog = true;
      try {
        if (!this.walletTotalSales && !this.walletTotalRoyalty) {
          await Promise.all([
            this.walletFetchTotalSales(this.wallet),
            this.walletFetchTotalRoyalty(this.wallet),
            this.walletFetchTotalResales(this.wallet),
          ]);
        }
      } finally {
        this.isIncomeDetailsLoading = false;
      }
    },
    async handleClickFollowers() {
      logTrackerEvent(
        this,
        'MyDashboard',
        'MyDashboard_followers_click',
        `${this.wallet}`,
        1
      );
      this.isOpenFollowersDialog = true;
      await this.walletFetchFollowers();
    },
    async handleClickExportFollowerList() {
      logTrackerEvent(
        this,
        'MyDashboard',
        'MyDashboard_followers_export_click',
        `${this.wallet}`,
        1
      );
      try {
        await this.exportFollowerList();
        this.alertPromptSuccess(this.$t('portfolio_follower_export_success'));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.alertPromptError(error.toString());
      }
    },
  },
};
</script>
