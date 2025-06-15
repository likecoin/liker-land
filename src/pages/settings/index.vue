<template>
  <AuthRequiredView
    class="w-full"
    :is-loading-start-immediately="isInInAppBrowser"
    :login-label="$t('settings_login_in')"
    :login-button-label="$t('header_button_connect_to_wallet')"
  >
    <div
      :class="[
        'flex flex-col desktop:flex-row',
        'gap-[24px]',
        'items-center desktop:items-start',
        'justify-center',

        'w-full',
        'max-w-[300px] desktop:max-w-full',
        'mx-auto',
      ]"
    >
      {{ /* phone version UI */ }}
      <UserInfoCard
        class="flex w-full mb-[12px] desktop:hidden"
        :wallet="loginAddress"
        :display-name="walletUserDisplayName"
        :avatar-src="walletUserAvatar"
        :is-civic-liker="isWalletUserCivicLiker"
        @click-avatar="handleClickUserInfoCardAvatar"
        @copy-wallet="handleCopyWallet"
      />

      <!-- Tab Bar -->
      <nav class="flex justify-center mb-[1.5rem] desktop:hidden">
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
              :is-selected="currentMainTab === 'settings'"
              @click="() => handleCurrentTabChange('settings')"
            >
              <IconSetting />
            </MenuButton>
          </li>
          <li><MenuButtonDivider /></li>
          <li class="flex items-center">
            <MenuButton
              :is-selected="currentMainTab === 'userStats'"
              @click="() => handleCurrentTabChange('userStats')"
            >
              <IconStats />
            </MenuButton>
          </li>
        </ul>
      </nav>

      {{ /* User state - Phone & Desktop */ }}
      <section
        :class="[
          'flex',
          'relative',
          'flex-col',
          'justify-center',
          'items-center',

          { hidden: !isShowUserStateTab },
          'desktop:flex',
          'gap-[1.5rem]',
          'w-full',
          'max-w-[280px]',
        ]"
      >
        <UserInfoCard
          class="hidden w-full desktop:flex"
          :wallet="loginAddress"
          :display-name="walletUserDisplayName"
          :avatar-src="walletUserAvatar"
          :is-civic-liker="isWalletUserCivicLiker"
          @click-avatar="handleClickUserInfoCardAvatar"
          @copy-wallet="handleCopyWallet"
        />

        <BalanceCard class="w-full" :balance="walletLIKEBalance" />

        <UserStatsMyDashboard
          class="w-full"
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
                  :text="$t('portfolio_follower_title')"
                  preset="tertiary"
                  size="mini"
                  @click="handleClickFollowers"
                />
              </div>
            </div>
          </template>
        </NFTPortfolioTopUsersList>
      </section>

      {{ /* Settings - Phone & Desktop */ }}
      <div
        :class="[
          'flex-grow',

          'w-full',
          'desktop:max-w-[640px]',

          { hidden: !isShowSettingsTab },
          'desktop:block',
        ]"
      >
        <ul class="settings-menu">
          <li>
            <NuxtLink
              class="settings-menu__item"
              :to="localeLocation({ name: 'settings-email' })"
            >
              <span class="settings-menu__item-title">
                {{ $t('settings_email') }}</span
              >
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="settings-menu__item"
              :to="localeLocation({ name: 'settings-following' })"
            >
              <span class="settings-menu__item-title">
                {{ $t('settings_following') }}</span
              >
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="settings-menu__item"
              :to="localeLocation({ name: 'settings-language' })"
            >
              <GlobeIcon class="settings-menu__item-title-icon" />
              <span class="settings-menu__item-title">
                {{ $t('SettingsPage.language') }}</span
              >
            </NuxtLink>
          </li>
        </ul>

        <ul class="settings-menu !mt-[24px]">
          <li>
            <a
              class="settings-menu__item"
              :href="likerIdSettingsURL"
              target="_blank"
              rel="noopener"
            >
              <span class="settings-menu__item-title">
                {{ $t('settings_liker_id') }}</span
              >
            </a>
          </li>
          <li v-if="isWalletUserAuthcore">
            <a
              class="settings-menu__item"
              :href="exportSeedWordURL"
              target="_blank"
              rel="noopener"
            >
              <span class="settings-menu__item-title">
                {{ $t('settings_export_seed_word') }}</span
              >
            </a>
          </li>
        </ul>

        <ul v-if="showClearCacheButton" class="settings-menu !mt-[24px]">
          <li>
            <button
              class="w-full text-left settings-menu__item"
              @click="onClickClearCache"
            >
              <span class="settings-menu__item-title">
                {{ $t('settings_clear_cache') }}</span
              >
            </button>
          </li>
        </ul>

        <ul class="settings-menu !mt-[24px]">
          <li>
            <button
              class="flex w-full py-12 pl-24 pr-16 text-left settings-menu text-like-green"
              @click="onClickLogOut"
            >
              <span class="settings-menu__item-title">
                {{ $t('main_menu_sign_out') }}</span
              >
            </button>
          </li>
        </ul>
      </div>
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
    <MigrateNoticeModalLogin />
  </AuthRequiredView>
</template>

<script>
import { mapActions } from 'vuex';
import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';
import inAppMixin from '~/mixins/in-app';

import GlobeIcon from '~/assets/icons/globe.svg?inline';
import { getCollectorTopRankedCreators } from '~/util/api/cosmos';
import { fisherShuffle } from '~/util/misc';
import { logTrackerEvent } from '~/util/EventLogger';

const DETAILS_TYPE = {
  ROYALTY: 'royalty',
  SALES: 'sales',
  RESALES: 'resales',
};

const TAB_OPTIONS = {
  USER_STATS: 'userStats',
  SETTINGS: 'settings',
};

export default {
  components: {
    GlobeIcon,
  },
  mixins: [walletMixin, alertMixin, inAppMixin],
  data() {
    return {
      showClearCacheButton: false,
      topRankedUsers: [],
      isIncomeDetailsLoading: false,

      isOpenIncomeDetailsDialog: false,
      isOpenFollowersDialog: false,

      targetType: DETAILS_TYPE.SALES,
      currentMainTab: TAB_OPTIONS.SETTINGS,
    };
  },
  computed: {
    wallet() {
      return this.getAddress;
    },
    isHeaderShowBack() {
      return /^settings-.+$/.test(this.getRouteBaseName(this.$route));
    },
    isShowUserStateTab() {
      return this.currentMainTab === TAB_OPTIONS.USER_STATS;
    },
    isShowSettingsTab() {
      return this.currentMainTab === TAB_OPTIONS.SETTINGS;
    },
  },

  watch: {
    getAddress: {
      handler(address) {
        if (address) {
          this.updateTopRankedCreators();
        }
      },
    },
  },

  mounted() {
    this.showClearCacheButton = !!window.caches;
    if (this.getAddress) {
      this.updateTopRankedCreators();
    }
  },
  methods: {
    ...mapActions([
      'lazyGetUserInfoByAddress',
      'userLogout',
      'disconnectWallet',
    ]),
    async onClickClearCache() {
      if (window.caches) {
        const keyList = await window.caches.keys();
        if (keyList?.length) {
          await Promise.all(
            keyList
              .filter(key => key.startsWith('reader'))
              .map(key => caches.delete(key))
          );
        }
        this.uiPromptSuccessAlert(this.$t('settings_clear_cache_success'));
      }
    },
    fetchUserInfo() {
      this.lazyGetUserInfoByAddress(this.getAddress);
    },
    handleClickUserInfoCardAvatar() {
      logTrackerEvent(
        this,
        'Settings',
        'settings_avatar_click',
        this.wallet,
        1
      );
      window.open(this.likerIdSettingsURL, '_blank');
    },
    handleCopyWallet() {
      logTrackerEvent(
        this,
        'Settings',
        'settings_copy_wallet_click',
        this.wallet,
        1
      );
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
    handleGoCollected() {
      logTrackerEvent(
        this,
        'Settings',
        'settings_collected_click',
        `${this.getAddress}`,
        1
      );

      this.$router.push(
        this.localeLocation({
          name: 'id',
          params: { id: this.getAddress },
          query: { tab: 'collected' },
        })
      );
    },
    handleGoCreated() {
      logTrackerEvent(
        this,
        'Settings',
        'settings_created_click',
        `${this.getAddress}`,
        1
      );

      this.$router.push(
        this.localeLocation({
          name: 'id',
          params: { id: this.getAddress },
          query: { tab: 'created' },
        })
      );
    },
    async handleClickTotalSales() {
      logTrackerEvent(
        this,
        'Settings',
        'settings_sales_click',
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
    handleTopUserHover(i) {
      logTrackerEvent(
        this,
        'Settings',
        `settings_top_faned_creators_hover`,
        `${i}`,
        1
      );
    },
    handleTopUserClick(i) {
      logTrackerEvent(
        this,
        'Settings',
        `settings_top_faned_creators_click`,
        `${i}`,
        1
      );
    },
    async handleClickFollowers() {
      logTrackerEvent(
        this,
        'Settings',
        'settings_followers_click',
        `${this.wallet}`,
        1
      );
      this.isOpenFollowersDialog = true;
      await this.walletFetchFollowers();
    },
    async handleClickExportFollowerList() {
      logTrackerEvent(
        this,
        'Settings',
        'settings_followers_export_click',
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
    handleCurrentTabChange(tab) {
      switch (tab) {
        case TAB_OPTIONS.SETTINGS:
          logTrackerEvent(
            this,
            'Settings',
            'settings_tab_click',
            this.wallet,
            1
          );
          break;

        case TAB_OPTIONS.USER_STATS:
          logTrackerEvent(
            this,
            'Settings',
            'settings_user_state_click',
            this.wallet,
            1
          );

          break;

        default:
          break;
      }
      this.currentMainTab = tab;
    },
    async onClickLogOut() {
      logTrackerEvent(
        this,
        'Settings',
        'settings_logout_click',
        this.wallet,
        1
      );
      this.disconnectWallet();
      await this.userLogout();
    },
  },
};
</script>

<style lang="scss">
.settings-menu {
  @apply list-none;

  & + & {
    @apply mt-8;

    @media screen and (max-width: 558px) {
      @apply mt-24;
    }
  }

  li {
    transition-duration: 0.25s;
    transition-timing-function: ease;

    transition-property: opacity;

    @apply bg-white;

    > * {
      @apply py-20;
    }

    &:hover {
      @apply opacity-50;
    }
    &:active {
      @apply opacity-25;
    }

    &:first-child {
      @apply rounded-t-[16px];
    }
    &:not(:first-child) {
      @apply border-t-2;
      @apply border-gray-e6;
    }
    &:last-child {
      @apply rounded-b-[16px];
    }
  }

  &__item {
    @apply flex;
    @apply items-center;

    @apply text-like-green;

    @apply pl-24;
    @apply pr-16;
    @apply py-12;

    &-title {
      @apply text-16;
      @apply font-600;

      @apply flex-grow;
    }

    &-title-icon {
      @apply mr-8;

      @apply w-20;
      @apply h-20;

      @apply fill-current;

      @media screen and (max-width: 558px) {
        @apply -ml-8;
      }
    }

    &-subtitle {
      @apply text-12;
      @apply text-gray-9b;
      @apply font-600;
    }

    &::after {
      content: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' viewBox='0 0 8.7 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m8.7 8v0c0-0.4-0.1-0.7-0.3-0.9l-6.2-6.7c-0.4-0.5-1.3-0.5-1.8-0.1-0.5 0.5-0.6 1.3-0.1 1.8l5.4 5.9-5.4 5.8c-0.5 0.5-0.4 1.3 0.1 1.8s1.3 0.4 1.8-0.1l6.2-6.7c0.2-0.1 0.3-0.4 0.3-0.8v0z' fill='%2328646E' fill-rule='evenodd'/%3E%3C/svg%3E%0A");

      @apply w-8;
      @apply h-16;

      @apply ml-12;
    }
  }
}
</style>
