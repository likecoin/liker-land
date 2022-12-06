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
        'mt-[32px]',
      ]"
    >
      {{ /* Left Column */ }}
      <div
        :class="[
          'min-w-[280px]',
          'desktop:w-[280px]',
        ]"
      >
        <NFTPortfolioUserInfo :wallet="wallet">
          <div class="flex justify-between w-[44px] mx-auto mt-[16px] mb-[24px] text-shade-gray">
            <IconEllipse />
            <IconEllipse />
            <IconEllipse />
          </div>
          <UserStatsPortfolio
            class="grid grid-cols-2 cursor-default gap-x-8 gap-y-4 text-medium-gray"
            :stat-wallet="wallet"
          />
        </NFTPortfolioUserInfo>
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
        :is-loading-portfolio-items="isLoading"
        :is-show-other-tab="isShowOtherTab"
        :is-narrow="true"
        @portfolio-change-tab="handleTabChange"
        @portfolio-change-sorting="handleNFTClassListSortingChange"
        @infinite-scroll="handleInfiniteScroll"
      >
        <template #grid-append>
          <NFTPortfolioSubscriptionForm
            v-if="!isLoading && isCurrentTabCreated && !isUserPortfolio"
            :id="creatorFollowSectionId"
            class="w-full phone:order-first"
            :creator-wallet-address="wallet"
            :creator-display-name="userDisplayName"
            :is-empty="!nftClassListOfCreatedInOrder.length"
          />
        </template>
      </NFTPortfolioMainView>

    </div>

    <NuxtChild />
  </Page>
</template>

<script>
import { getUserMinAPI } from '~/util/api';
import { convertAddressPrefix, isValidAddress } from '~/util/cosmos';
import { logTrackerEvent } from '~/util/EventLogger';
import { checkUserNameValid } from '~/util/user';

import walletMixin from '~/mixins/wallet';
import portfolioMixin, { tabOptions } from '~/mixins/portfolio';

const CREATOR_FOLLOW_SECTION_ID = 'creator-follow';

export default {
  name: 'NFTPortfolioPage',
  layout: 'default',
  mixins: [walletMixin, portfolioMixin],
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
    wallet() {
      return this.$route.params.id;
    },
    isUserPortfolio() {
      return this.wallet === this.getAddress;
    },
    creatorFollowSectionId() {
      return CREATOR_FOLLOW_SECTION_ID;
    },
    creatorFollowSectionHash() {
      return `#${this.creatorFollowSectionId}`;
    },
  },
  watch: {
    isLoading(isLoading) {
      if (!isLoading) {
        if (this.$route.hash === this.creatorFollowSectionHash) {
          if (!this.isCurrentTabCreated) {
            this.changeTab(tabOptions.created);
          }
          this.$nextTick(this.scrollToCreatorFollowSection);
        } else if (
          // If collected tab is empty
          this.isCurrentTabCollected &&
          !this.nftClassListOfCollectedExcludedOther.length
        ) {
          if (this.nftClassListOfOther.length) {
            // Go to other tab if not empty
            this.changeTab(tabOptions.other);
          } else {
            // Go to created tab if other tab is empty
            this.changeTab(tabOptions.created);
          }
        } else if (
          // If other tab is empty
          this.isCurrentTabOther &&
          !this.nftClassListOfOther.length
        ) {
          if (this.nftClassListOfCollectedExcludedOther.length) {
            // Go to collected tab if not empty
            this.changeTab(tabOptions.other);
          } else {
            // Go to created tab if collected tab is empty
            this.changeTab(tabOptions.created);
          }
        }
      }
    },
  },
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
  mounted() {
    this.syncRouteForTab();
    this.loadNFTListByAddress(this.wallet);
  },
  methods: {
    scrollToCreatorFollowSection() {
      this.$gsap.gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: this.creatorFollowSectionHash,
          offsetY: 100,
        },
      });
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
        case tabOptions.other:
          logTrackerEvent(this, 'UserPortfolio', 'GoOtherTab', this.wallet, 1);
          break;

        default:
          break;
      }
      this.changeTab(tab);
    },
    goMyDashboard() {
      logTrackerEvent(this, 'UserPortfolio', 'GoToMyDashboard', this.wallet, 1);
      this.$router.push({ name: 'dashboard' });
    },
  },
};
</script>
