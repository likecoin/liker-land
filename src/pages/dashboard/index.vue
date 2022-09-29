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
          :collected-class-ids="collectedClassIds"
          :created-class-ids="createdClassIds"
          :is-loading="isLoading"
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
            text="Portfolio View"
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
        </div>

        <CardV2 v-if="isLoading">{{
          $t('nft_portfolio_page_label_loading')
        }}</CardV2>

        <div v-else class="w-full">
          <MagicGrid v-show="currentTab === 'collected'" :gap="16" :max-cols="2" :max-col-width="310">
            <NFTPortfolioEmpty v-if="!sortedCollectedClassIds.length" preset="collected" />
            <div v-for="id in sortedCollectedClassIds" :key="id">
              <NFTPortfolioItem :class-id="id" class="mb-[12px]" />
            </div>
          </MagicGrid>

          <MagicGrid v-show="currentTab === 'created'" :gap="16" :max-cols="2" :max-col-width="310">
            <NFTPortfolioEmpty v-if="!sortedCreatedClassIds.length" preset="created" />
            <div
              v-for="id in sortedCreatedClassIds"
              :key="id"
            >
              <NFTPortfolioItem
                :class-id="id"
                class="mb-[12px]"
              />
            </div>
          </MagicGrid>

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
    </div>
  </Page>
</template>

<script>
import { mapActions } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

import walletMixin from '~/mixins/wallet';
import portfolioMixin from '~/mixins/portfolio';

export default {
  name: 'MyDashboardPage',
  layout: 'default',
  mixins: [walletMixin, portfolioMixin],
  data() {
    return { switchWalletCount: 0 };
  },
  watch: {
    getAddress: {
      immediate: true,
      async handler(newAddress) {
        if (newAddress) {
          this.switchWalletCount += 1;
          if (this.switchWalletCount < 2) {
            this.fetchUserInfo();
            await this.loadNFTListByAddress(this.getAddress);
          } else {
            this.$router.go();
          }
        }
      },
    },
  },
  methods: {
    ...mapActions(['fetchUserInfoByAddress']),
    async fetchUserInfo() {
      try {
        const userInfo = await this.fetchUserInfoByAddress(this.getAddress);
        this.userInfo = userInfo.data;
        this.wallet = this.getAddress;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.wallet = this.getAddress;
      }
    },
    handleGoCollected() {
      logTrackerEvent(this, 'MyDashboard', 'GoCollectedTab', this.wallet, 1);
      this.goCollected();
    },
    handleGoCreated() {
      logTrackerEvent(this, 'MyDashboard', 'GoCreatedTab', this.wallet, 1);
      this.goCreated();
    },
    handleShare() {
      this.copySharePageURL(this.wallet, this.getAddress);
      logTrackerEvent(this, 'MyDashboard', 'CopyShareURL', this.wallet, 1);
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
