<template>
  <Page
    :class="[
      'w-full',
      'max-w-[960px]',
      'mx-auto',
      'px-[.75em] laptop:px-[2em]',
      'pb-[8em]',
      'text-[0.75em] sm:text-[1em]',
    ]"
  >
    <AuthRequiredView
      class="w-full max-w-[960px] mx-auto"
      :is-loading-start-immediately="isInInAppBrowser"
      :login-label="$t('dashboard_login_in')"
      :login-button-label="$t('header_button_connect_to_wallet')"
    >
      {{ /* Tabs */ }}
      <div class="flex justify-center mb-[24px] desktop:mb-[48px]">
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
          <li class="flex justify-center items-center desktop:w-[118px]">
            <MenuButton
              class="w-full"
              :is-selected="currentMainTab === 'town'"
              @click="handleGoTown"
            >
              <div class="hidden desktop:block">
                {{ $t('nft_social_feed_page_label_town') }}
              </div>
              <IconTown class="desktop:hidden" />
            </MenuButton>
          </li>
          <li><MenuButtonDivider /></li>
          <li class="flex items-center desktop:w-[118px]">
            <MenuButton
              class="w-full"
              :is-selected="currentMainTab === 'collectibles'"
              @click="handleGoCollectibles"
            >
              <div class="hidden desktop:block">
                {{ $t('nft_social_feed_page_label_collectibles') }}
              </div>
              <IconCreativeWork class="desktop:hidden" />
            </MenuButton>
          </li>
          <li><MenuButtonDivider class="desktop:hidden"/></li>
          <li class="flex items-center desktop:hidden">
            <MenuButton
              :is-selected="currentMainTab === 'userStats'"
              @click="handleGoUserStats"
            >
              <IconStats />
            </MenuButton>
          </li>
        </ul>
      </div>

      {{ /* Main View */ }}
      <div
        :class="[
          'flex',

          'flex-col',
          'desktop:flex-row',
          'gap-x-[48px]',

          'items-center',
          'desktop:items-start',
          'desktop:justify-center',

          'w-full',
          'pt-[32px]',
          'pb-[120px]',
        ]"
      >
        {{ /* Main View -- Town */ }}
        <div
          v-if="currentMainTab === 'town'"
          :class="[
            'w-full',
            'flex',
            'justify-center'
          ]"
        >
          <div v-if="walletIsFetchingFolloweeEvents">
            <Label align="center" class="text-medium-gray" :text="$t('settings_follow_loading')" />
            <ProgressIndicator class="self-center " />
          </div>
          <ul v-else-if="displayedEvents.length" class="w-full">
            <li v-for="e in displayedEvents" :key="e.tx_hash" class="mb-[48px]">
              <SocialFeedItem
                :type="e.type"
                :sender-address="e.sender"
                :receiver-address="e.receiver"
                :memo="e.memo"
                :granter-memo="e.granterMemo"
                :timestamp="e.timestamp"
                :class-id="e.class_id"
                :nft-id="e.nft_id"
              />
            </li>
          </ul>
          <div v-if="!walletIsFetchingFolloweeEvents && !displayedEvents.length">{{ $t('dashboard_table_no_data') }}</div>
        </div>

        {{ /* Main View -- collectibles */ }}
        <NFTPortfolioMainView
          v-if="currentMainTab === 'collectibles'"
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
          @portfolio-change-tab="handleCollectiblesTabChange"
          @portfolio-change-sorting="handleNFTClassListSortingChange"
          @portfolio-change-creator="handleNFTClassListCreatorChange"
          @portfolio-change-type="handleNFTClassListTypeChange"
          @portfolio-change-keywords="handleNFTKeywordsChange"
          @infinite-scroll="handleInfiniteScroll"
          @portfolio-reset-filter="handleClearFilter"
          @portfolio-input-filter-change-creator="handleCreatorInputFilterChange"
          @portfolio-input-filter-change-keyword="handleKeywordInputFilterChange"
        />

        {{ /* Main View -- UserStats */ }}
        <div
          :class="[
            'hidden',
            { '!flex': currentMainTab === 'userStats' },
            'flex-col',
            'justify-center',
            'items-center',
            'desktop:flex',
            'w-full',
            'max-w-[272px]',
          ]"
        >
          <UserStatsMyDashboard
            :stat-wallet="getAddress"
            @go-created="handleGoCreated"
            @go-collected="handleGoCollected"
            @click-total-sales="handleClickTotalSales"
          />
          <NFTPortfolioTopUsersList
            v-if="topRankedUsers && topRankedUsers.length"
            type="creator"
            :is-card="true"
            :user-list="topRankedUsers"
            @hover="handleTopUserHover"
            @click="handleTopUserClick"
          >
            <template #append>
              <div class="flex flex-col items-center">
                <Label
                  class="w-min font-400 text-medium-gray mt-[4px]"
                  :text="
                    $t('nft_portfolio_page_label_collector_top_ranked_creators')
                  "
                  preset="p6"
                  align="center"
                  valign="middle"
                />

                <div class="w-[124px] h-[2px] bg-shade-gray my-[18px]" />

                <div
                  v-if="walletHasLoggedIn"
                  class="flex items-center justify-center"
                >
                  <ButtonV2
                    preset="tertiary"
                    size="mini"
                    @click="handleClickFollowers"
                  >{{ $t('portfolio_follower_title') }}</ButtonV2>
                </div>
              </div>
            </template>
          </NFTPortfolioTopUsersList>
          <div class="flex justify-center my-[24px]">
            <ButtonV2
              preset="tertiary"
              size="small"
              class="rounded-full"
              :text="$t('dashboard_portfolio_button')"
              @click="goMyPortfolio"
            >
              <template #prepend>
                <IconView />
              </template>
            </ButtonV2>
          </div>
        </div>
      </div>

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

import { createPortfolioMixin, tabOptions } from '~/mixins/portfolio';
import inAppMixin from '~/mixins/in-app';
import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';

import { getCollectorTopRankedCreators } from '~/util/api';
import { fisherShuffle } from '~/util/misc';

const DETAILS_TYPE = {
  ROYALTY: 'royalty',
  SALES: 'sales',
  RESALES: 'resales',
};

const TAB_OPTIONS = {
  TOWN: 'town',
  COLLECTIBLES: 'collectibles',
  USER_STATS: 'userStats',
};
export default {
  name: 'Feed',
  layout: 'default',
  mixins: [
    alertMixin,
    createPortfolioMixin({ shouldApplyDisplayState: false }),
    inAppMixin,
    walletMixin,
  ],
  data() {
    return {
      topRankedUsers: [],
      targetType: DETAILS_TYPE.SALES,
      isOpenFollowersDialog: false,
      isOpenIncomeDetailsDialog: false,
      isIncomeDetailsLoading: false,
      currentMainTab: TAB_OPTIONS.TOWN,
      eventsToShow: 30,

      hasFetchedFollowees: false,
    };
  },
  computed: {
    wallet() {
      return this.getAddress;
    },
    tabMenuItemList() {
      const items = [
        {
          text: this.$t('nft_portfolio_page_label_collected'),
          value: tabOptions.collected,
        },
        {
          text: this.$t('nft_portfolio_page_label_created'),
          value: tabOptions.created,
        },
      ];

      return items.map(item => ({
        type: 'item',
        ...item,
        isSelected: item.value === this.portfolioTab,
        handleClick: () => this.handleCollectiblesTabChange(item.value),
      }));
    },
    displayedEvents() {
      const uniqueTxHashes = new Set();
      return this.getFolloweeEvents
        .reduce((filteredEvents, event) => {
          if (!uniqueTxHashes.has(event.tx_hash)) {
            uniqueTxHashes.add(event.tx_hash);
            filteredEvents.push(event);
          }
          return filteredEvents;
        }, [])
        .slice(0, this.eventsToShow);
    },

    currentView() {
      return this.$route.query.view;
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
    walletFollowees: {
      immediate: true,
      handler(walletFollowees) {
        if (walletFollowees.length && !this.hasFetchedFollowees) {
          this.fetchFolloweeWalletEvent();
          this.hasFetchedFollowees = true;
        }
      },
    },
  },
  mounted() {
    this.currentMainTab = this.currentView;
    if (this.getAddress) {
      this.fetchNFTDisplayStateListByAddress(this.getAddress);
      this.updateTopRankedCreators();
    }
  },
  methods: {
    ...mapActions(['lazyGetUserInfoByAddress']),
    fetchUserInfo() {
      this.lazyGetUserInfoByAddress(this.getAddress);
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
    handleGoTown() {
      this.$router.replace({
        ...this.$route,
        query: { view: TAB_OPTIONS.TOWN, tab: undefined },
      });
      this.handleCurrentTabChange(TAB_OPTIONS.TOWN);
    },
    handleGoCollectibles() {
      this.$router.replace({
        ...this.$route,
        query: { view: TAB_OPTIONS.COLLECTIBLES, tab: 'collected' },
      });
      this.handleCurrentTabChange(TAB_OPTIONS.COLLECTIBLES);
      this.loadNFTClassesForCurrentTabByAddress(this.getAddress);
    },
    handleGoUserStats() {
      this.$router.replace({
        ...this.$route,
        query: { view: TAB_OPTIONS.USER_STATS, tab: undefined },
      });
      this.handleCurrentTabChange(TAB_OPTIONS.USER_STATS);
    },
    handleGoCollected() {
      this.handleCollectiblesTabChange(tabOptions.collected);
    },
    handleGoCreated() {
      this.handleCollectiblesTabChange(tabOptions.created);
    },
    handleCurrentTabChange(tab) {
      switch (tab) {
        case TAB_OPTIONS.TOWN:
          logTrackerEvent(
            this,
            'SocialFeed',
            'go_town_tab_clicked',
            this.wallet,
            1
          );
          break;

        case TAB_OPTIONS.COLLECTIBLES:
          logTrackerEvent(
            this,
            'SocialFeed',
            'go_collectibles_tab_clicked',
            this.wallet,
            1
          );

          break;

        case TAB_OPTIONS.USER_STATS:
          logTrackerEvent(
            this,
            'SocialFeed',
            'go_user_stats_tab_clicked',
            this.wallet,
            1
          );
          break;

        default:
          break;
      }
      this.currentMainTab = tab;
    },
    handleCollectiblesTabChange(tab) {
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
