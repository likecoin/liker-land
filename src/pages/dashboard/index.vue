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
      <div class="relative flex items-center mb-[28px] laptop:mb-[48px] w-full">
        <UserStatsMyDashboard
          class="flex flex-col items-center w-full laptop:flex-row"
          :stat-wallet="getAddress"
          @go-created="handleGoCreated"
          @go-collected="handleGoCollected"
        />
        <ShareButton class="absolute right-0 laptop:right-[-40px]" @copy="handleShare" />
      </div>
      <!-- Main -->
      <div
        :class="[
          'flex',
          'flex-col',
          'relative',
          'items-center',
          'w-full',
          'max-w-[700px]',
          'desktop:w-[700px]',
        ]"
      >
        <div
          :class="['flex', 'flex-col', 'items-center', 'mb-[48px]', 'w-full']"
        >
          <ButtonV2
            preset="tertiary"
            :text="$t('dashboard_portfolio_button')"
            :class="[
              'block',
              'mb-[12px]',

              'laptop:absolute',
              'laptop:left-[-100px]',
              'laptop:m-0',

              'rounded-[16px]',
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
          </div>

          <Dropdown
            :class="[
              'hidden',

              'desktop:block',
              'desktop:absolute',
              'desktop:right-[-50px]',
              'desktop:m-0',

              'rounded-[16px]',
            ]"
          >
            <template v-slot:trigger="{ toggle }">
              <ButtonV2
                :text="label.replace('By ', '')"
                preset="plain"
                @click="toggle"
              >
                <template #append>
                  <IconASC v-if="currentOrder === 'ASC'" />
                  <IconDESC v-if="currentOrder === 'DESC'" />
                </template>
              </ButtonV2>
            </template>
            <MenuList>
              <MenuItem
                v-for="(item, i) in currentOrderOptions"
                :key="i"
                :value="item.value"
                :label="item.name"
                :selected-value="selectedValue"
                label-align="left"
                @select="handleSelectOrder"
              >
                <template #label-append>
                  <IconASC v-if="item.value.split('-')[1] === 'ASC'" />
                  <IconDESC v-if="item.value.split('-')[1] === 'DESC'" />
                </template>
              </MenuItem>
            </MenuList>
          </Dropdown>
        </div>

        <CardV2
          v-if="isLoading"
        >{{ $t('nft_portfolio_page_label_loading') }}</CardV2>

        <div v-else class="w-full">
          <ul ref="nftGrid">
            <template v-if="currentTab === 'collected'">
              <li
                v-if="!sortedCollectedNFTs.length"
                class="w-full"
              >
                <NFTPortfolioEmpty preset="collected" />
              </li>
              <li
                v-for="nft in sortedCollectedNFTs"
                :key="nft.classId"
                class="w-[310px] pb-[20px]"
              >
                <NFTPortfolioItem
                  :class-id="nft.classId"
                  :nft-id="nft.id"
                  @load="updateNFTGrid"
                />
              </li>
            </template>
            <template v-else>
              <li
                v-if="!sortedCreatedClassIds.length"
                class="w-full"
              >
                <NFTPortfolioEmpty preset="created" />
              </li>
              <li
                v-for="id in sortedCreatedClassIds"
                :key="id"
                class="w-[310px] pb-[20px]"
              >
                <NFTPortfolioItem
                  :class-id="id"
                  @load="updateNFTGrid"
                />
              </li>
            </template>
          </ul>

          <div
            v-if="hasMoreNFTs"
            ref="loadingMore"
            class="animate-pulse flex items-center justify-center font-[600] text-gray-9b min-h-[240px]"
          >{{ $t('nft_portfolio_page_label_loading_more') }}</div>
        </div>

        <div class="flex flex-col items-center my-[48px] w-full">
          <div class="w-[32px] h-[2px] bg-shade-gray mb-[32px]" />
          <ButtonV2
            preset="outline"
            :text="$t('portfolio_finding_more_button')"
            to="/campaign/writing-nft"
          />
        </div>
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
    if (this.hasMoreNFTs) {
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
    handleShare() {
      this.copySharePageURL(this.wallet, this.getAddress);
      logTrackerEvent(this, 'MyDashboard', 'CopyShareURL', this.wallet, 1);
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
