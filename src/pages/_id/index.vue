<template>
  <Page class="px-[8px]">

    <div
      :class="[
        'flex',

        'flex-col',
        'desktop:flex-row',
        'gap-x-[24px]',
        'gap-y-[48px]',

        'items-center',
        'desktop:items-start',
        'desktop:justify-center',

        'w-full',
        'pt-[32px]',
        'pb-[120px]'
      ]"
    >
      {{ /* Left Column */ }}
      <div
        :class="[
          'flex',
          'flex-col',
          'gap-y-[24px]',
          'min-w-[280px]',
          'desktop:w-[280px]',
        ]"
      >
        <NFTPortfolioUserInfo :wallet="wallet">
          <template #gem>
            <UserStatsGem
              class="mx-auto mt-[16px] mb-[24px]"
              :wallet="wallet"
            />
          </template>
          <template #stats>
            <UserStatsPortfolio
              class="grid grid-cols-2 cursor-default gap-x-8 gap-y-4 text-medium-gray"
              :stat-wallet="wallet"
            />
          </template>
        </NFTPortfolioUserInfo>
        <NFTPortfolioTopUsersList
          v-if="(isCurrentTabCollected ? userTopCreators : userTopCollectors).length && (isCurrentTabCollected || isCurrentTabCreated)"
          :type="isCurrentTabCollected ? 'creator' : 'collector'"
          :user-list="isCurrentTabCollected ? userTopCreators : userTopCollectors"
          @hover="handleTopUserHover"
          @click="handleTopUserClick"
        >
          <template #prepend>
            <Label
              class="w-min font-600 text-like-green"
              :text="isCurrentTabCollected ? $t('nft_portfolio_page_label_top_creators') : $t('nft_portfolio_page_label_top_collector')"
              preset="h5"
              align="center"
              valign="middle"
            />
          </template>
        </NFTPortfolioTopUsersList>
        <!-- Follower List -->
        <div v-if="walletHasLoggedIn && isUserPortfolio" class="flex items-center justify-center">
          <div
            class="underline transition-all duration-75 cursor-pointer text-medium-gray hover:text-dark-gray"
            @click="handleClickFollowers"
          >{{ $t('portfolio_follower_title') }}</div>
        </div>

        <!-- goMyDashboard btn -->
        <div
          v-if="isUserPortfolio"
          class="flex justify-center mt-[16px] mb-[24px]"
        >
          <ButtonV2
            preset="outline"
            :text="$t('main_menu_my_dashboard')"
            @click="goMyDashboard"
          >
            <template #prepend>
              <IconPerson />
            </template>
          </ButtonV2>
        </div>
        <template v-else>
          <CardV2
            v-show="isCurrentTabCreated"
            :is-outline="true"
            :class="[
              'flex',
              'flex-col',
              'items-center',
              'gap-[1rem]',
              'w-full',
              'py-[1rem]',
              'text-[.875rem]',
            ]"
          >
            <span
              v-t="'portfolio_collect_all_description'"
              class="text-center"
            />
            <ButtonV2
              class="shrink-0"
              :text="$t('portfolio_collect_all_button')"
              preset="secondary"
              :is-disabled="isLoading"
              @click="handleClickCollectAllButton"
            >
              <template #prepend>
                <IconPrice />
              </template>
            </ButtonV2>
          </CardV2>
          <NFTPortfolioSubscriptionForm
            id="creator-follow"
            class="w-full"
            :creator-wallet-address="wallet"
            :creator-display-name="userDisplayName"
            :is-wallet-connected="!!getAddress"
            :is-wallet-logged-in="walletHasLoggedIn"
            :is-followed="isFollowed"
            :is-empty="false"
          />
        </template>
      </div>

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
        :portfolio-items-sorting-option-list="currentNFTClassSortingOptionList"
        :portfolio-items-creator-filtering="nftCreatorFilter"
        :portfolio-items-type-filtering="nftTypeFilter"
        :portfolio-items-type-filtering-options="nftTypeFilteringOptions"
        :portfolio-collected-creator-list="nftCreatorInfoListOfCollected"
        :nft-keyword-list="nftKeywordList"
        :nft-keyword-filtering="nftKeywordsFilter"
        :is-loading-portfolio-items="isLoading"
        :is-narrow="true"
        @portfolio-change-tab="handleTabChange"
        @portfolio-change-sorting="handleNFTClassListSortingChange"
        @portfolio-change-creator="handleNFTClassListCreatorChange"
        @portfolio-change-type="handleNFTClassListTypeChange"
        @portfolio-change-keywords="handleNFTKeywordsChange"
        @infinite-scroll="handleInfiniteScroll"
        @portfolio-reset-filter="handleClearFilter"
        @portfolio-input-filter-change-creator="handleCreatorInputFilterChange"
        @portfolio-input-filter-change-keyword="handleKeywordInputFilterChange"
      />

    </div>

    <NuxtChild />
    <FollowerDialog
      :is-open-followers-dialog="isOpenFollowersDialog"
      :wallet-is-fetching-followers="walletIsFetchingFollowers"
      :populated-followers="populatedFollowers"
      @close="isOpenFollowersDialog = false"
      @on-export-followers="handleClickExportFollowerList"
    />
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getUserMinAPI } from '~/util/api';
import { convertAddressPrefix, isValidAddress } from '~/util/cosmos';
import { logTrackerEvent } from '~/util/EventLogger';
import { checkUserNameValid } from '~/util/user';

import walletMixin from '~/mixins/wallet';
import portfolioMixin, { tabOptions } from '~/mixins/portfolio';
import alertMixin from '~/mixins/alert';

export default {
  name: 'NFTPortfolioPage',
  mixins: [walletMixin, portfolioMixin, alertMixin],
  layout: 'default',
  async asyncData({ route, $api, error, store, redirect }) {
    let { id } = route.params;
    if (id && isValidAddress(id)) {
      if (id.startsWith('cosmos1')) {
        id = convertAddressPrefix(id, 'like');
      }
      if (id.startsWith('like1')) {
        try {
          await store.dispatch('fetchUserInfoByAddress', id);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
        return;
      }
    }
    if (id && checkUserNameValid(id)) {
      try {
        const userInfo = await $api.$get(getUserMinAPI(id));
        redirect({ ...route, params: { id: userInfo.likeWallet } });
        return;
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    error({ statusCode: 404, message: 'LIKER_NOT_FOUND' });
  },
  data() {
    return { isOpenFollowersDialog: false };
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
            '@context': 'http://www.schema.org',
            '@type': 'Person',
            name,
            image,
            identifier: this.wallet,
          }),
          type: 'application/ld+json',
          body: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassPurchaseInfoById',
      'getNFTClassOwnerInfoById',
      'walletHasLoggedIn',
      'walletFollowees',
    ]),
    wallet() {
      return this.$route.params.id;
    },
    isFollowed() {
      return this.walletFollowees?.includes(this.wallet) || false;
    },
    isUserPortfolio() {
      return this.wallet === this.getAddress;
    },
  },
  watch: {
    isLoading(isLoading) {
      if (!isLoading) {
        if (
          // If collected tab is empty
          this.isCurrentTabCollected &&
          !this.nftClassListOfFilteredCollectedByType.length
        ) {
          this.changeTab(tabOptions.created);
        }
      }
    },
  },
  mounted() {
    this.syncRouteForTab();
    this.loadNFTClassesForCurrentTabByAddress(this.wallet);
    this.fetchNFTDisplayStateListByAddress(this.wallet);
    this.loadTopUserListByAddress(this.wallet);
  },
  methods: {
    ...mapActions([
      'addNFTClassesToShoppingCart',
      'clearShoppingCart',
      'fetchNFTDisplayStateListByAddress',
    ]),
    handleTopUserHover(i) {
      const type = this.isCurrentTabCollected ? 'creator' : 'collector';
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_top_${type}_hover`,
        `${i}`,
        1
      );
    },
    handleTopUserClick(i) {
      const type = this.isCurrentTabCollected ? 'creator' : 'collector';
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_top_${type}_click`,
        `${i}`,
        1
      );
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
    goMyDashboard() {
      logTrackerEvent(this, 'UserPortfolio', 'GoToMyDashboard', this.wallet, 1);
      this.$router.push(
        this.localeLocation({ name: 'social-feeds', query: { view: 'town' } })
      );
    },
    async handleClickFollowers() {
      logTrackerEvent(
        this,
        'portfolio',
        'portfolio_followers_click',
        `${this.wallet}`,
        1
      );
      this.isOpenFollowersDialog = true;
      await this.walletFetchFollowers();
    },
    handleClickExportFollowerList() {
      logTrackerEvent(
        this,
        'portfolio',
        'portfolio_followers_export_click',
        `${this.wallet}`,
        1
      );
      this.exportFollowerList();
      this.alertPromptSuccess(this.$t('portfolio_follower_export_success'));
    },
    handleClickCollectAllButton() {
      if (this.isLoading) return;

      logTrackerEvent(
        this,
        'portfolio',
        'portfolio_collect_all_button_click',
        `${this.wallet}`,
        1
      );
      const classIds = this.nftClassListOfCreatedInOrder
        .map(n => n.classId)
        .filter(classId => {
          const isCollectable =
            this.getNFTClassPurchaseInfoById(classId)?.totalPrice > 0;
          const hasCollected =
            this.getAddress &&
            this.getNFTClassOwnerInfoById(classId)?.[this.getAddress];
          return isCollectable && !hasCollected;
        });
      if (classIds.length) {
        this.addNFTClassesToShoppingCart({ classIds });
        this.$router.push(this.localeLocation({ name: 'shopping-cart' }));
      } else {
        this.alertPromptSuccess(this.$t('portfolio_collect_all_already_alert'));
      }
    },
  },
};
</script>
