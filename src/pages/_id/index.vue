<template>
  <Page>

    <div
      :class="[
        'flex',

        'flex-col',
        'desktop:flex-row',

        'items-center',
        'desktop:items-start',
        'desktop:justify-center',

        'mt-[32px]',
      ]"
    >
      <div
        :class="[
          'mb-[24px]',
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
            :collected-class-ids="collectedClassIds"
            :created-class-ids="createdClassIds"
            :is-loading="isLoading"
          />
        </NFTPortfolioUserInfo>
        <div class="flex justify-center mt-[18px]">
          <ButtonV2
            v-if="getAddress === wallet"
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
          'max-w-[700px]',
          'desktop:w-[700px]',
        ]"
      >
        <div :class="['flex','items-center','mb-[48px]','w-full']">
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
          <ShareButton @copy="handleShare" />
        </div>

        <CardV2 v-if="isLoading">Loading</CardV2>

        <div v-else class="w-full">
          <MagicGrid v-show="currentTab === 'collected'" :gap="16" :max-cols="2" :max-col-width="310">
            <NFTPortfolioEmpty v-if="!sortedCollectedClassIds.length" preset="collected" />
            <div v-for="id in sortedCollectedClassIds" :key="id">
              <NFTPortfolioItem :class-id="id" class="mb-[12px] w-[310px]" />
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
                class="mb-[12px] w-[310px]"
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
import { getUserMinAPI } from '~/util/api';
import { convertAddressPrefix, isValidAddress } from '~/util/cosmos';
import { logTrackerEvent } from '~/util/EventLogger';
import { checkUserNameValid } from '~/util/user';

import walletMixin from '~/mixins/wallet';
import portfolioMixin from '~/mixins/portfolio';

export default {
  name: 'NFTPortfolioPage',
  layout: 'default',
  mixins: [walletMixin, portfolioMixin],
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
  async mounted() {
    await this.loadNFTListByAddress(this.wallet);
  },
  methods: {
    handleGoCollected() {
      logTrackerEvent(this, 'UserPortfolio', 'GoCollectedTab', this.wallet, 1);
      this.goCollected();
    },
    handleGoCreated() {
      logTrackerEvent(this, 'UserPortfolio', 'GoCreatedTab', this.wallet, 1);
      this.goCreated();
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
