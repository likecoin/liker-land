<template>
  <Page>

    <div
      :class="[
        'flex',

        'flex-col',
        'desktop:flex-row',
        'gap-[48px]',

        'items-center',
        'desktop:items-start',
        'desktop:justify-center',

        'mt-[32px]',
      ]"
    >
      <div
        :class="[
          'desktop:mr-[24px]',

          'w-full',
          'min-w-[280px]',
          'desktop:w-[280px]',
        ]"
      >
        <NFTPortfolioUserInfo
          :user-info="userInfo"
          :wallet="wallet"
        >
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
          v-if="getAddress === wallet"
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
      <div
        :class="[
          'flex',
          'flex-col',
          'items-center',
          'w-full',
          'gap-[48px]',
          'pb-[48px]',
          'max-w-[700px]',
          'desktop:w-[700px]',
        ]"
      >
        <div :class="['flex', 'relative', 'items-center', 'w-full']">
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
              text="Collected"
              :is-selected="currentTab === 'collected'"
              @click="handleGoCollected"
            />
            <MenuButtonDivider />
            <MenuButton
              text="Created"
              :is-selected="currentTab === 'created'"
              @click="handleGoCreated"
            />
          </div>
          <div
            :class="[
              'flex',
              'items-center',

              'desktop:absolute',
              'desktop:right-[10px]',
            ]"
          >
            <Dropdown class="hidden desktop:block">
              <template v-slot:trigger="{ toggle }">
                <ButtonV2
                  :text="label"
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
                  label-align="left"
                  :selected-value="selectedValue"
                  @select="handleSelectOrder"
                >
                  <template #label-append>
                    <IconASC v-if="item.value.split('-')[1] === 'ASC'" />
                    <IconDESC v-if="item.value.split('-')[1] === 'DESC'" />
                  </template>
                </MenuItem>
              </MenuList>
            </Dropdown>
            <MenuButtonDivider class="hidden bg-gray-c desktop:block" />
            <ShareButton @copy="handleShare" />
          </div>
        </div>

        <NFTPortfolioSubscriptionForm
          v-if="!isLoading && currentTab === 'created' && getAddress !== wallet"
          :id="creatorFollowSectionId"
          class="w-full desktop:order-1"
          :creator-wallet-address="wallet"
          :creator-display-name="userDisplayName"
          :is-empty="!sortedCreatedClassIds.length"
        />

        <CardV2 v-if="isLoading">Loading</CardV2>

        <div v-else class="w-full">
          <MagicGrid v-show="currentTab === 'collected'" :gap="16" :max-cols="2" :max-col-width="310">
            <NFTPortfolioEmpty v-if="!sortedCollectedClassIds.length" preset="collected" />
            <div v-for="id in sortedCollectedClassIds" :key="id">
              <NFTPortfolioItem v-if="currentTab === 'collected'" :class-id="id" class="mb-[12px] w-[310px]" />
              <NFTPortfolioEmpty v-else preset="collected" />
            </div>
          </MagicGrid>

          <MagicGrid v-show="currentTab === 'created'" :gap="16" :max-cols="2" :max-col-width="310">
            <div
              v-for="id in sortedCreatedClassIds"
              :key="id"
            >
              <NFTPortfolioItem
                v-if="currentTab === 'created'"
                :class-id="id"
                class="mb-[12px] w-[310px]"
              />
              <NFTPortfolioEmpty v-else preset="collected" />
            </div>
          </MagicGrid>
        </div>

        <div class="flex flex-col items-center order-2 w-full">
          <div class="w-[32px] h-[2px] bg-shade-gray mb-[32px]" />
          <ButtonV2
            preset="outline"
            :text="$t('portfolio_finding_more_button')"
            to="/campaign/writing-nft"
          />
        </div>
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
  computed: {
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
          !this.sortedCollectedClassIds.length
        ) {
          // Go to created tab if collected tab is empty
          this.goCreatedTab();
        }
      }
    },
  },
  async asyncData({ route, $api, error, store }) {
    let { id } = route.params;
    if (id && isValidAddress(id)) {
      if (id.startsWith('cosmos1')) {
        id = convertAddressPrefix(id, 'like');
      }
      if (id.startsWith('like1')) {
        try {
          const userInfo = await store.dispatch('fetchUserInfoByAddress', id);
          return {
            userInfo,
            wallet: id,
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
        return {
          wallet: id,
          userInfo: undefined,
        };
      }
    }
    if (id && checkUserNameValid(id)) {
      try {
        const userInfo = await $api.$get(getUserMinAPI(id));
        return {
          userInfo,
          wallet: userInfo.likeWallet,
        };
      } catch (err) {
        const msg = (err.response && err.response.data) || err;
        // eslint-disable-next-line no-console
        console.error(msg);
      }
    }
    error({ statusCode: 404, message: 'LIKER_NOT_FOUND' });
    return undefined;
  },
  mounted() {
    let tab = this.currentTab;
    if (this.$route.hash === this.creatorFollowSectionHash) {
      tab = portfolioMixin.tabOptions.created;
    }
    this.syncRouteForTab(tab);

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
    handleGoCollected() {
      logTrackerEvent(this, 'UserPortfolio', 'GoCollectedTab', this.wallet, 1);
      this.goCollectedTab();
    },
    handleGoCreated() {
      logTrackerEvent(this, 'UserPortfolio', 'GoCreatedTab', this.wallet, 1);
      this.goCreatedTab();
    },
    handleShare() {
      this.copySharePageURL(this.wallet, this.getAddress);
      logTrackerEvent(this, 'UserPortfolio', 'CopyShareURL', this.wallet, 1);
    },
    goMyDashboard() {
      logTrackerEvent(this, 'UserPortfolio', 'GoToMyDashboard', this.wallet, 1);
      this.$router.push({ name: 'dashboard' });
    },
  },
};
</script>
