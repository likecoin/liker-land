<template>
  <Page>

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

        'mt-[32px]',
      ]"
    >
      {{ /* Left Column */ }}
      <div
        :class="[
          'w-full',
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
            text="My Dashboard"
            @click="goMyDashboard"
          >
            <template #prepend>
              <IconPerson />
            </template>
          </ButtonV2>
        </div>
      </div>

      {{ /* Right Column */ }}
      <div
        :class="[
          'flex',
          'flex-col',
          'items-center',
          'w-full',
          'gap-[32px]',
          'pb-[48px]',
          'max-w-[644x]',
          'desktop:w-[644px]',
        ]"
      >
        <CardV2
          v-if="isLoading"
        >{{ $t('nft_portfolio_page_label_loading') }}</CardV2>
        <section
          v-else
          class="flex flex-col items-center gap-[32px] w-full"
        >
          <nav class="flex items-center justify-center w-full">
            <div
              :class="[
                'flex',
                'justify-center',
                'items-center',
                'p-[4px]',
                'bg-shade-gray',
                'rounded-[14px]',
              ]"
            >
              <MenuButton
                :text="$t('nft_portfolio_page_label_collected')"
                :is-selected="isCurrentTabCollected"
                @click="handleGoCollected"
              />
              <MenuButtonDivider />
              <MenuButton
                :text="$t('nft_portfolio_page_label_created')"
                :is-selected="isCurrentTabCreated"
                @click="handleGoCreated"
              />
              <MenuButtonDivider v-if="isShowOtherTab" />
              <MenuButton
                v-if="isShowOtherTab"
                :text="$t('nft_portfolio_page_label_other')"
                :is-selected="isCurrentTabOther"
                @click="handleGoOther"
              />
            </div>
          </nav>

          <div
            v-if="currentNFTClassList.length"
            class="flex justify-end w-full"
          >
            <Dropdown class="hidden desktop:block">
              <template v-slot:trigger="{ toggle }">
                <ButtonV2
                  :text="currentNFTClassSortingLabel"
                  preset="plain"
                  @click="toggle"
                >
                  <template #append>
                    <IconASC v-if="currentNFTClassListOrder === 'ASC'" />
                    <IconDESC v-if="currentNFTClassListOrder === 'DESC'" />
                  </template>
                </ButtonV2>
              </template>
              <MenuList>
                <MenuItem
                  v-for="(item, i) in currentNFTClassSortingOptionList"
                  :key="i"
                  :value="item.value"
                  :label="item.name"
                  label-align="left"
                  :selected-value="currentNFTClassListSortingValue"
                  @select="handleNFTClassListSortingChange"
                >
                  <template #label-append>
                    <IconASC v-if="item.value.split('-')[1] === 'ASC'" />
                    <IconDESC v-if="item.value.split('-')[1] === 'DESC'" />
                  </template>
                </MenuItem>
              </MenuList>
            </Dropdown>
          </div>

          <NFTPagePrimitiveDisclaimer
            v-if="isCurrentTabOther"
            class="w-full"
            :is-portfolio="true"
          />

          <ul
            v-if="!isCurrentTabCreated || currentNFTClassList.length"
            ref="nftGrid"
            class="w-full -mx-[12px] max-w-[668x] desktop:w-[668px] transition-all"
          >
            <li v-if="!currentNFTClassList.length" class="w-full">
              <NFTPortfolioEmpty :preset="currentTab" />
            </li>
            <li
              v-for="nft in currentNFTClassList"
              :key="nft.classId"
              class="w-[310px] pb-[20px]"
            >
              <NFTPortfolioItem
                :class-id="nft.classId"
                :nft-id="nft.id"
                @load="updateNFTGrid"
              />
            </li>
          </ul>

          <div
            v-if="hasMoreNFTClassListItems"
            ref="loadingMore"
            class="animate-pulse flex items-center justify-center font-[600] text-gray-9b min-h-[240px]"
          >{{ $t('nft_portfolio_page_label_loading_more') }}</div>
        </section>

        <NFTPortfolioSubscriptionForm
          v-if="!isLoading && isCurrentTabCreated && !isUserPortfolio"
          :id="creatorFollowSectionId"
          class="w-full phone:order-first"
          :creator-wallet-address="wallet"
          :creator-display-name="userDisplayName"
          :is-empty="!nftClassListOfCreatedInOrder.length"
        />

        <hr class="w-[32px] h-[2px] bg-shade-gray border-none">

        <ButtonV2
          preset="outline"
          :text="$t('portfolio_finding_more_button')"
          to="/campaign/writing-nft"
        />
      </div>

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
import portfolioMixin from '~/mixins/portfolio';

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
          this.$nextTick(this.scrollToCreatorFollowSection);
        } else if (
          this.currentTab !== portfolioMixin.tabOptions.created &&
          !this.nftClassListOfCollectedInOrder.length
        ) {
          // Go to created tab if collected tab is empty
          this.goCreatedTab();
        }
        this.$nextTick(this.setupNFTGrid);
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
    if (!this.isLoading) {
      this.setupNFTGrid();
    }
    if (this.hasMoreNFTClassListItems) {
      this.addInfiniteScrollListener();
    }
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
    handleGoCollected() {
      logTrackerEvent(this, 'UserPortfolio', 'GoCollectedTab', this.wallet, 1);
      this.goCollectedTab();
    },
    handleGoCreated() {
      logTrackerEvent(this, 'UserPortfolio', 'GoCreatedTab', this.wallet, 1);
      this.goCreatedTab();
    },
    handleGoOther() {
      logTrackerEvent(this, 'UserPortfolio', 'GoOtherTab', this.wallet, 1);
      this.goOtherTab();
    },
    goMyDashboard() {
      logTrackerEvent(this, 'UserPortfolio', 'GoToMyDashboard', this.wallet, 1);
      this.$router.push({ name: 'dashboard' });
    },
  },
};
</script>
