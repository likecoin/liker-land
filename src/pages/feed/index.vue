<template>
  <Page
    :class="[
      'w-full',
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
      {{ /* Tab Bar */ }}
      <nav class="flex justify-center mb-[24px] desktop:mb-[48px]">
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
      </nav>

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
        ]"
      >
        {{ /* Main View -- Town */ }}
        <section v-if="currentMainTab === 'town'" class="flex justify-center w-full">
          <SocialFeed
            :should-show-loading="shouldShowLoading"
            :displayed-events="displayedEvents"
            :should-show-more="shouldShowMore"
            :should-show-end="shouldShowEnd"
            :should-show-empty="shouldShowEmpty"
            :is-fetching-events-with-memo="isFetchingEventsWithMemo"
            @on-fetch-event-info="fetchEventInfo"
            @on-scroll-feed="handleInfiniteScrollFeed"
            @on-click-feed="handleEmptyFeedActionClick"
            @on-click-feed-follow="handleFollowFeed"
            @on-click-suggested-follow="handleClickSuggestedFollow"
            @sender-click="handleClickFeedSender"
            @receiver-click="handleClickFeedReceiver"
            @nft-title-click="handleClickFeedNFTTitle"
            @nft-click="handleClickFeedNFT"
            @nft-collect="handleCollectFeedNFT"
          />
        </section>

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
        <section
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
        </section>
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
import { mapActions, mapGetters } from 'vuex';

import { createPortfolioMixin, tabOptions } from '~/mixins/portfolio';
import inAppMixin from '~/mixins/in-app';
import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';

import { logTrackerEvent } from '~/util/EventLogger';
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
      eventsToFetch: 30,

      hasStartedFetchingFolloweeEvents: false,
      hasStartedFetchingFirstBatch: false,
      isFetchingEventsWithMemo: false,
    };
  },
  computed: {
    ...mapGetters([
      'getAddress',
      'getFolloweeEvents',
      'getHasFetchMemo',
      'getAvailableFeedTxList',
      'getSuggestedFollowList',
    ]),
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
    formattedEvents() {
      if (this.getFolloweeEvents.length) {
        return this.sortAndFilterEvents(this.getFolloweeEvents);
      }

      return [];
    },
    pendingMemoFetchList() {
      return this.formattedEvents.filter(e => !this.getHasFetchMemo(e?.key));
    },
    displayedEvents() {
      if (this.getAvailableFeedTxList) {
        return this.formattedEvents.filter(e =>
          this.getAvailableFeedTxList.includes(e?.key)
        );
      }
      return [];
    },
    currentView() {
      return this.$route.query.view;
    },
    shouldShowLoading() {
      return Boolean(
        this.walletFollowees.length && !this.displayedEvents.length
      );
    },
    shouldShowMore() {
      return Boolean(this.pendingMemoFetchList.length);
    },
    shouldShowEnd() {
      return Boolean(
        this.displayedEvents.length && !this.pendingMemoFetchList.length
      );
    },
    shouldShowEmpty() {
      return Boolean(
        !this.pendingMemoFetchList.length && !this.displayedEvents.length
      );
    },
  },

  watch: {
    loginAddress: {
      immediate: true,
      handler(address) {
        if (address) {
          this.fetchUserInfo();
          this.loadNFTClassesForCurrentTabByAddress(address);
          this.fetchNFTDisplayStateListByAddress(address);
          this.updateTopRankedCreators();
          this.hasStartedFetchingFirstBatch = false;
          this.hasStartedFetchingFolloweeEvents = false;
        }
      },
    },
    walletFollowees: {
      immediate: true,
      handler(walletFollowees) {
        if (walletFollowees.length && !this.hasStartedFetchingFolloweeEvents) {
          this.fetchFolloweeWalletEvent();
          this.fetchSuggestedFollowList();
          this.hasStartedFetchingFolloweeEvents = true;
        }
      },
    },
    formattedEvents: {
      immediate: true,
      handler(formattedEvents) {
        if (formattedEvents?.length && !this.hasStartedFetchingFirstBatch) {
          this.fetchEventsWithMemo();
          this.hasStartedFetchingFirstBatch = true;
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
    ...mapActions([
      'lazyGetUserInfoByAddress',
      'lazyGetUserInfoByAddresses',
      'lazyFetchEventsMemo',
      'lazyGetNFTClassMetadata',
      'fetchFolloweeWalletEvent',
      'fetchSuggestedFollowList',
    ]),
    fetchUserInfo() {
      this.lazyGetUserInfoByAddress(this.getAddress);
    },
    async fetchEventsWithMemo() {
      this.isFetchingEventsWithMemo = true;

      try {
        const currentEventToFetch = Math.min(
          this.eventsToFetch,
          this.pendingMemoFetchList.length
        );
        const fetchList = this.pendingMemoFetchList.slice(
          0,
          currentEventToFetch
        );

        const fetchPromises = fetchList.map(event =>
          this.lazyFetchEventsMemo(event)
        );

        await Promise.all(fetchPromises);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isFetchingEventsWithMemo = false;
      }
    },
    fetchEventInfo({ event }) {
      this.lazyGetNFTClassMetadata(event.class_id);
      this.lazyGetUserInfoByAddresses([event.sender, event.receiver]);
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
            'FeedTabTownClick',
            this.wallet,
            1
          );
          break;

        case TAB_OPTIONS.COLLECTIBLES:
          logTrackerEvent(
            this,
            'SocialFeed',
            'FeedTabCollectiblesClick',
            this.wallet,
            1
          );

          break;

        case TAB_OPTIONS.USER_STATS:
          logTrackerEvent(
            this,
            'SocialFeed',
            'FeedTabStatsClick',
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
    handleEmptyFeedActionClick() {
      logTrackerEvent(
        this,
        'SocialFeed',
        'FeedEmptyActionClick',
        this.wallet,
        1
      );
    },
    handleFollowFeed(followee) {
      logTrackerEvent(this, 'SocialFeed', 'FeedFollowClick', followee, 1);
    },
    handleClickFeedSender(sender) {
      logTrackerEvent(this, 'SocialFeed', 'FeedSenderClick', sender, 1);
    },
    handleClickFeedReceiver(receiver) {
      logTrackerEvent(this, 'SocialFeed', 'FeedReceiverClick', receiver, 1);
    },
    handleClickFeedNFTTitle({ classId } = {}) {
      logTrackerEvent(this, 'SocialFeed', 'FeedNFTTitleClick', classId, 1);
    },
    handleClickFeedNFT(classId) {
      logTrackerEvent(this, 'SocialFeed', 'FeedNFTClick', classId, 1);
    },
    handleCollectFeedNFT(classId) {
      logTrackerEvent(this, 'SocialFeed', 'FeedNFTCollect', classId, 1);
    },
    sortAndFilterEvents(events) {
      const uniqueTxHashes = new Set();
      return events
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .filter(event => {
          if (!uniqueTxHashes.has(event?.key)) {
            uniqueTxHashes.add(event?.key);
            return true;
          }
          return false;
        });
    },
    handleInfiniteScrollFeed() {
      if (!this.pendingMemoFetchList.length) return;

      if (!this.isFetchingEventsWithMemo) {
        logTrackerEvent(this, 'SocialFeed', 'FeedLoadMore', this.wallet, 1);
        this.fetchEventsWithMemo();
      }
    },
    handleClickSuggestedFollow(followee) {
      logTrackerEvent(this, 'SocialFeed', 'SuggestedFollowClick', followee, 1);
    },
  },
};
</script>
