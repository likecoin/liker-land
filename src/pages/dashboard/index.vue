<template>
  <Page>
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
    <div v-else class="flex flex-col items-center mt-[32px]">
      <!-- UserStat -->
      <div class="flex items-center mb-[28px] laptop:mb-[48px] w-full">
        <UserStatsMyDashboard
          class="flex flex-col items-center w-full laptop:flex-row"
          :stat-wallet="getAddress"
          @go-created="handleGoCreated"
          @go-collected="handleGoCollected"
        />
      </div>

      <!-- Main -->
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
          <nav class="flex flex-col items-center justify-center w-full laptop:flex-row gap-[32px]">
            <ButtonV2
              preset="tertiary"
              size="small"
              :text="$t('dashboard_portfolio_button')"
              :class="[
                'block',

                'laptop:absolute',
                'laptop:left-0',
                'laptop:ml-[24px]',

                'rounded-full',
              ]"
              @click="goMyPortfolio"
            >
              <template #prepend>
                <IconView />
              </template>
            </ButtonV2>

            <div
              :class="[
                'flex',
                'justify-center',
                'items-center',
                'p-[4px]',
                'mx-auto',
                'bg-shade-gray',
                'rounded-[14px]',
              ]"
            >
              <MenuButton
                :text="$t('nft_portfolio_page_label_collected')"
                :is-selected="currentTab === 'collected'"
                @click="handleGoCollected"
              />
              <MenuButtonDivider />
              <MenuButton
                :text="$t('nft_portfolio_page_label_created')"
                :is-selected="currentTab === 'created'"
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
            class="justify-end hidden w-full desktop:flex"
          >
            <Dropdown>
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
                  :selected-value="currentNFTClassListSortingValue"
                  label-align="left"
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

        <hr class="w-[32px] h-[2px] bg-shade-gray border-none">

        <ButtonV2
          preset="outline"
          :text="$t('portfolio_finding_more_button')"
          to="/campaign/writing-nft"
        />
      </div>
    </div>
  </Page>
</template>

<script>
import { mapActions } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

import walletMixin from '~/mixins/wallet';
import portfolioMixin from '~/mixins/portfolio';
import authMixin from '~/mixins/auth';

export default {
  name: 'MyDashboardPage',
  layout: 'default',
  mixins: [walletMixin, portfolioMixin, authMixin],
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
    return { hasSwitchedWallet: false };
  },
  computed: {
    wallet() {
      return this.getAddress;
    },
  },
  watch: {
    getAddress: {
      immediate: true,
      async handler(newAddress) {
        if (newAddress) {
          if (!this.hasSwitchedWallet) {
            this.hasSwitchedWallet = true;
            this.fetchUserInfo();
            await this.loadNFTListByAddress(this.getAddress);
            this.setupNFTGrid();
          } else {
            // Refresh the page to prevent data overlapping
            this.$router.go();
          }
        }
      },
    },
    isLoading(isLoading) {
      if (!isLoading) {
        this.$nextTick(this.setupNFTGrid);
      }
    },
  },
  mounted() {
    this.syncRouteForTab();
    if (!this.isLoading) {
      this.setupNFTGrid();
    }
    if (this.hasMoreNFTClassListItems) {
      this.addInfiniteScrollListener();
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
    handleGoCollected() {
      logTrackerEvent(this, 'MyDashboard', 'GoCollectedTab', this.wallet, 1);
      this.goCollectedTab();
    },
    handleGoCreated() {
      logTrackerEvent(this, 'MyDashboard', 'GoCreatedTab', this.wallet, 1);
      this.goCreatedTab();
    },
    handleGoOther() {
      logTrackerEvent(this, 'MyDashboard', 'GoOtherTab', this.wallet, 1);
      this.goOtherTab();
    },
    async handleSignLogin() {
      await this.signLogin();
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
