<template>
  <Page
    :class="[
      'w-full',
      'px-[.75em] laptop:px-[2em]',
      'pb-[120px]',
      'text-[0.75em] sm:text-[1em]',
    ]"
  >
    <AuthRequiredView
      class="w-full max-w-[960px] mx-auto"
      :is-loading-start-immediately="isInInAppBrowser"
      :login-label="$t('dashboard_login_in')"
      :login-button-label="$t('header_button_connect_to_wallet')"
    >
      <div
        :class="[
          'flex',

          'flex-col',
          'desktop:flex-row',
          'gap-x-[24px]',
          'gap-y-[24px]',

          'items-center',
          'desktop:items-start',
          'desktop:justify-center',

          'w-full',
        ]"
      >
        {{ /* Right Column */ }}
        <NFTPortfolioMainView
          key="portfolio"
          ref="portfolioMainView"
          :portfolio-wallet="wallet"
          :portfolio-tab="currentTab"
          :portfolio-items="currentNFTClassList"
          :portfolio-items-show-count="currentNFTClassListShowCount"
          :portfolio-items-sorting="currentNFTClassListSorting"
          :portfolio-items-sorting-order="currentNFTClassListSortingOrder"
          :portfolio-items-sorting-option-list="
            currentNFTClassSortingOptionList
          "
          :portfolio-items-creator-filtering="nftCreatorFilter"
          :portfolio-items-type-filtering="nftTypeFilter"
          :portfolio-items-type-filtering-options="nftTypeFilteringOptions"
          :portfolio-collected-creator-list="nftCreatorInfoListOfCollected"
          :nft-keyword-list="nftKeywordList"
          :nft-keyword-filtering="nftKeywordsFilter"
          :is-loading-portfolio-items="isLoading"
          :is-narrow="false"
          :is-bookshelf="true"
          @portfolio-change-tab="handleTabChange"
          @portfolio-change-sorting="handleNFTClassListSortingChange"
          @portfolio-change-creator="handleNFTClassListCreatorChange"
          @portfolio-change-type="handleNFTClassListTypeChange"
          @portfolio-change-keywords="handleNFTKeywordsChange"
          @infinite-scroll="handleInfiniteScroll"
          @portfolio-reset-filter="handleClearFilter"
          @portfolio-input-filter-change-creator="
            handleCreatorInputFilterChange
          "
          @portfolio-input-filter-change-keyword="
            handleKeywordInputFilterChange
          "
          @item-click="handlePortfolioItemClick"
          @item-collect="handlePortfolioItemCollect"
        >
          <template #tab-bar-prepend>
            <h3
              :class="[
                'text-[28px]',
                'font-500',
                'relative desktop:absolute desktop:left-0',
              ]"
            >
              {{ $t('main_menu_my_portfolio') }}
            </h3>
          </template>
        </NFTPortfolioMainView>
      </div>
      <MigrateNoticeModalLogin />
    </AuthRequiredView>
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { logTrackerEvent } from '~/util/EventLogger';
import { parseNFTMetadataURL, NFT_TYPE_FILTER_OPTIONS } from '~/util/nft';
import { EXTERNAL_HOST } from '~/constant';

import inAppMixin from '~/mixins/in-app';
import walletMixin from '~/mixins/wallet';
import portfolioMixin, { tabOptions } from '~/mixins/portfolio';
import alertMixin from '~/mixins/alert';

const FOLLOW_PROMPT_STATE = {
  DEFAULT: 'default', // No need to show any follow UI.
  UNFOLLOW: 'unfollow', // Show a switch button to toggle follow status.
  AUTO: 'auto', // Show auto-followed UI.
};

export default {
  name: 'NFTPortfolioPage',
  mixins: [walletMixin, portfolioMixin, alertMixin, inAppMixin],
  layout: 'default',
  data() {
    return {
      isOpenFollowersDialog: false,
      isFollowPromptUpdating: false,
      followPromptState: FOLLOW_PROMPT_STATE.DEFAULT,
    };
  },
  head() {
    const name = this.userDisplayName;
    const title = this.$t('portfolio_title', { name });
    const description = this.$t('portfolio_description');
    const image = this.userAvatar;
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
          content: image,
        },
        {
          hid: 'likecoin:wallet',
          name: 'likecoin:wallet',
          content: this.wallet,
        },
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            mainEntity: {
              '@context': 'http://www.schema.org',
              '@type': 'Person',
              url: `${EXTERNAL_HOST}/${this.wallet}`,
              name,
              image,
              identifier: this.wallet,
            },
            hasPart: this.nftClassListOfCreated
              .filter(c => this.getNFTClassMetadataById(c.classId))
              .map(c => {
                const {
                  name: className,
                  description: classDescription,
                  image: classImage = '',
                } = this.getNFTClassMetadataById(c.classId);
                return {
                  '@context': 'http://www.schema.org',
                  '@type': 'CreativeWork',
                  name: className,
                  description: classDescription,
                  image: parseNFTMetadataURL(classImage),
                  url: `${EXTERNAL_HOST}/nft/class/${c.classId}`,
                  identifier: c.classId,
                };
              }),
          }),
          type: 'application/ld+json',
          body: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassMetadataById',
      'getNFTClassPurchaseInfoById',
      'walletHasLoggedIn',
      'walletFollowees',
    ]),
    wallet() {
      return this.getSessionWallet;
    },
  },
  watch: {
    wallet() {
      this.fetchData();
    },
  },
  mounted() {
    this.syncRouteForTab();
    this.syncRouteForTypeFilter(NFT_TYPE_FILTER_OPTIONS.NFT_BOOK);
    this.changeTab(tabOptions.collected);
    this.fetchData();
  },
  methods: {
    ...mapActions([
      'addNFTClassesToShoppingCart',
      'clearShoppingCart',
      'lazyFetchNFTDisplayStateListByAddress',
    ]),
    fetchData() {
      if (!this.wallet) return;

      this.loadNFTClassesForCurrentTabByAddress(this.wallet);
      this.lazyFetchNFTDisplayStateListByAddress(this.wallet);
      this.loadTopUserListByAddress(this.wallet);
      this.lazyFetchCreatedNFTClassesByAddress(this.wallet);
    },
    handleTabChange(tab) {
      switch (tab) {
        case tabOptions.collected:
          logTrackerEvent(
            this,
            'UserPortfolio',
            'GoCollectedTab',
            this.wallet,
            1
          );
          break;

        case tabOptions.created:
          logTrackerEvent(
            this,
            'UserPortfolio',
            'GoCreatedTab',
            this.wallet,
            1
          );

          break;

        default:
          break;
      }
      this.changeTab(tab);
    },
    handlePortfolioItemClick(classId) {
      logTrackerEvent(this, 'NFT', 'NFTViewDetails(Portfolio)', classId, 1);
    },
    handlePortfolioItemCollect(classId) {
      logTrackerEvent(this, 'NFT', 'NFTCollect(Portfolio)', classId, 1);
    },
  },
};
</script>
