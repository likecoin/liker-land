<template>
  <Page class="px-[8px]">
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
        'pt-[32px]',
        'pb-[120px]',
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
          <template #stats>
            <UserStatsPortfolio
              class="grid grid-cols-2 cursor-default gap-x-8 gap-y-4 text-medium-gray"
              :stat-wallet="wallet"
            />
          </template>
          <!-- In App Follow -->
          <template #follow>
            <div
              v-if="shouldShowFollowButton"
              class="flex items-center justify-center"
            >
              <ProgressIndicator v-if="isFollowPromptUpdating" preset="thin" />
              <div
                v-else
                class="relative flex group w-[138px]"
                @click="clickFollow(wallet, userDisplayName)"
              >
                <div
                  :class="[
                    ...getDefaultClass,
                    isFollowPromptStateAuto
                      ? '!bg-like-cyan-light text-like-green'
                      : '!bg-shade-gray text-dark-gray',
                  ]"
                >
                  <Label align="center" :text="followPromptButtonText">
                    <template v-if="isFollowPromptStateAuto" #prepend>
                      <IconCheck />
                    </template>
                  </Label>
                </div>
                <div
                  :class="[
                    ...getDefaultClass,
                    'group-hover:opacity-[100]',
                    'group-active:!bg-medium-gray',
                    'opacity-0',
                    'transition-all',
                    'absolute',
                    'inset-0',
                    isFollowPromptStateAuto
                      ? '!bg-shade-gray text-dark-gray'
                      : '!bg-like-cyan-light text-like-green',
                  ]"
                >
                  <Label align="center" :text="followPromptButtonHoverText" />
                </div>
              </div>
            </div>
          </template>
        </NFTPortfolioUserInfo>
        <NFTPortfolioTopUsersList
          v-if="
            (isCurrentTabCollected ? userTopCreators : userTopCollectors)
              .length &&
              (isCurrentTabCollected || isCurrentTabCreated)
          "
          :type="isCurrentTabCollected ? 'creator' : 'collector'"
          :user-list="
            isCurrentTabCollected ? userTopCreators : userTopCollectors
          "
          @hover="handleTopUserHover"
          @click="handleTopUserClick"
        >
          <template #prepend>
            <Label
              class="w-min font-600 text-like-green"
              :text="
                isCurrentTabCollected
                  ? $t('nft_portfolio_page_label_top_creators')
                  : $t('nft_portfolio_page_label_top_collector')
              "
              preset="h5"
              align="center"
              valign="middle"
            />
          </template>
        </NFTPortfolioTopUsersList>

        <template v-if="!isUserPortfolio">
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
        @item-click="handlePortfolioItemClick"
        @item-collect="handlePortfolioItemCollect"
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
import {
  fetchAllNFTClassFromChain,
  checkIsWritingNFT,
  parseNFTMetadataURL,
  NFT_TYPE_FILTER_OPTIONS,
} from '~/util/nft';
import { EXTERNAL_HOST, BOOK3_HOSTNAME } from '~/constant';

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
  mixins: [walletMixin, portfolioMixin, alertMixin],
  layout: 'default',
  async asyncData({ route, $api, error, store, redirect }) {
    const { id: originalId } = route.params;
    const { query, hash } = route;
    let id = originalId;
    if (id && isValidAddress(id)) {
      if (id.startsWith('like1')) {
        try {
          await store.dispatch('fetchUserInfoByAddress', id);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
        return;
      }
      if (id.startsWith('0x')) {
        redirect(301, `https://${BOOK3_HOSTNAME}/store/?owner_wallet=${id}`);
        return;
      }
      if (id.startsWith('cosmos1')) {
        id = convertAddressPrefix(id, 'like');
      }
    } else if (id && checkUserNameValid(id)) {
      try {
        const userInfo = await $api.$get(getUserMinAPI(id));
        const { likeWallet, evmWallet } = userInfo;
        if (evmWallet) {
          redirect(
            301,
            `https://${BOOK3_HOSTNAME}/store/?owner_wallet=${evmWallet}`
          );
        } else {
          redirect(301, {
            ...route,
            params: { id: likeWallet },
            query,
            hash,
          });
        }
        return;
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    if (originalId !== id) {
      redirect(301, { ...route, params: { id }, query, hash });
      return;
    }
    error({ statusCode: 404, message: 'LIKER_NOT_FOUND' });
  },
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
      return this.$route.params.id;
    },
    isFollowed() {
      return this.walletFollowees?.includes(this.wallet) || false;
    },
    isUserPortfolio() {
      return this.wallet === this.getAddress;
    },

    // Follow
    followPromptButtonText() {
      if (this.isFollowPromptUpdating) {
        return this.$t('nft_details_page_label_loading');
      }
      if (this.isFollowPromptStateAuto) {
        return this.$t('settings_following');
      }
      return this.$t('settings_follow_follow');
    },
    followPromptButtonHoverText() {
      if (this.isFollowPromptStateAuto) {
        return this.$t('settings_follow_unfollow');
      }
      return this.$t('settings_follow_follow');
    },
    isFollowPromptStateAuto() {
      return this.followPromptState === FOLLOW_PROMPT_STATE.AUTO;
    },
    getDefaultClass() {
      return [
        'flex',
        'gap-[16px]',
        'box-border',
        'overflow-hidden',
        'justify-center',
        'items-center',
        'transition',
        'duration-200',
        'h-40px',
        'w-full',
        'font-600',
        'px-[16px]',
        'py-[8px]',
        'rounded-[20px]',
        'cursor-pointer',
      ];
    },
    shouldShowFollowButton() {
      return (
        this.wallet !== this.getAddress &&
        this.walletHasLoggedIn &&
        !this.isFollowed
      );
    },
  },
  watch: {
    isLoading(isLoading) {
      if (!isLoading) {
        if (
          // If collected tab is empty
          this.isCurrentTabCreated &&
          !this.nftClassListOfFilteredCreatedByType.length
        ) {
          this.changeTab(tabOptions.collected);
        }
      }
    },
  },
  mounted() {
    this.syncRouteForTab();
    this.syncRouteForTypeFilter(NFT_TYPE_FILTER_OPTIONS.NFT_BOOK);
    this.loadNFTClassesForCurrentTabByAddress(this.wallet);
    this.lazyFetchNFTDisplayStateListByAddress(this.wallet);
    this.loadTopUserListByAddress(this.wallet);
    this.lazyFetchCreatedNFTClassesByAddress(this.wallet);
  },
  methods: {
    ...mapActions([
      'addNFTClassesToShoppingCart',
      'clearShoppingCart',
      'lazyFetchNFTDisplayStateListByAddress',
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
    async handleClickCollectAllButton() {
      if (this.isLoading) return;

      logTrackerEvent(
        this,
        'portfolio',
        'portfolio_collect_all_button_click',
        `${this.wallet}`,
        1
      );

      if (!this.getSessionWallet) {
        const isConnected = await this.connectWallet();
        if (!isConnected) return;
        this.walletFetchLIKEBalance();
      }

      // TODO: store partial collected classes into collectedNFTClassesByAddressMap
      const collected = await fetchAllNFTClassFromChain(this.$api, {
        classOwner: this.wallet,
        nftOwner: this.getAddress,
      });
      const collectedSet = new Set(collected.map(n => n.id));

      const classIds = this.nftClassListOfCreatedInOrder
        // HACK: c.price is latest_price (has been) from chain, not actual price (to be) from Firestore.
        // Classes haven't been collected by anyone will not have price
        .filter(
          c =>
            checkIsWritingNFT(this.getNFTClassMetadataById(c.classId)) &&
            (c.price > 0 || this.NFTPrice > 0)
        )
        .map(n => n.classId)
        .filter(classId => !collectedSet.has(classId));
      if (classIds.length) {
        this.addNFTClassesToShoppingCart({ classIds });
        this.$router.push(this.localeLocation({ name: 'shopping-cart-wnft' }));
      } else {
        this.alertPromptSuccess(this.$t('portfolio_collect_all_already_alert'));
      }
    },
    handlePortfolioItemClick(classId) {
      logTrackerEvent(this, 'NFT', 'NFTViewDetails(Portfolio)', classId, 1);
    },
    handlePortfolioItemCollect(classId) {
      logTrackerEvent(this, 'NFT', 'NFTCollect(Portfolio)', classId, 1);
    },
    async clickFollow(followOwnerWallet, followOwnerDisplayName) {
      try {
        this.isFollowPromptUpdating = true;
        switch (this.followPromptState) {
          case FOLLOW_PROMPT_STATE.AUTO:
            this.followPromptState = FOLLOW_PROMPT_STATE.UNFOLLOW;
            await this.walletUnfollowCreator(followOwnerWallet);
            logTrackerEvent(
              this,
              'NFT',
              'FeedUnfollowClick',
              FOLLOW_PROMPT_STATE.UNFOLLOW,
              1
            );
            break;
          case FOLLOW_PROMPT_STATE.UNFOLLOW:
          default:
            this.followPromptState = FOLLOW_PROMPT_STATE.AUTO;
            await this.walletFollowCreator(followOwnerWallet);
            logTrackerEvent(
              this,
              'NFT',
              'FeedFollowClick',
              FOLLOW_PROMPT_STATE.AUTO,
              1
            );
            this.alertPromptSuccess(
              this.$t('portfolio_subscription_success_alert', {
                creator: followOwnerDisplayName,
              })
            );
            break;
        }
      } catch (error) {
        this.alertPromptError(error.toString());
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isFollowPromptUpdating = false;
      }
    },
  },
};
</script>
