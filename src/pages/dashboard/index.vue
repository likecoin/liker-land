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
      <div class="flex items-center mb-[24px] laptop:mb-[48px] w-full max-w-[736px]">
        <UserStatsMyDashboard
          class="flex flex-col items-center w-full laptop:flex-row"
          :stat-wallet="getAddress"
          @go-created="handleGoCreated"
          @go-collected="handleGoCollected"
        />
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
        :is-loading-portfolio-items="isLoading"
        :is-show-other-tab="isShowOtherTab"
        @portfolio-change-tab="handleTabChange"
        @portfolio-change-sorting="handleNFTClassListSortingChange"
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
  computed: {
    wallet() {
      return this.getAddress;
    },
  },
  watch: {
    async getAddress(newAddress) {
      if (newAddress) {
        this.fetchUserInfo();
        await this.loadNFTListByAddress(this.getAddress);
      }
    },
  },
  mounted() {
    this.syncRouteForTab();
    if (this.getAddress) this.loadNFTListByAddress(this.getAddress);
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
      this.$router.push({
        name: 'id',
        params: { id: this.wallet },
      });
    },
  },
};
</script>
