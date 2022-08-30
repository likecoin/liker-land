<template>
  <Page>
    <div
      v-if="!getAddress"
      class="flex flex-col items-center justify-center h-[80vh] mt-[-80px]"
    >
      <Label
        class="mb-[24px] text-medium-gray"
        preset="h3"
        :text="$t('tooltip_signin')"
      />
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
          :collected-items="ownedNFTs"
          :created-class-ids="sellingNFTClassIds"
          :is-loading="isLoading"
          @go-created="handleGoCreated"
          @go-collected="handleGoCollected"
        />
        <ShareButton class="absolute right-0 laptop:right-[-40px]" @copy="handleCopyURL" />
      </div>
      <!-- Main -->
      <div
        :class="[
          'flex',
          'flex-col',
          'relative',
          'items-center',
          'w-full',
          'max-w-[636px]',
          'desktop:w-[636px]',
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
            <MenuButtonDivider/>
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
        <div v-else>
          <ul
            v-if="currentTab === 'collected'"
            :class="[
              'w-full',
              'mx-auto',

              'columns-1',
              'laptop:columns-2',

              'gap-[16px]',
            ]"
          >
            <li>
              <NFTPortfolioEmpty v-if="!ownedNFTs.length" preset="collected" />
            </li>
            <li v-for="id in ownedNFTClassIds" :key="id">
              <NFTPortfolioItem :class-id="id" />
            </li>
          </ul>

          <ul
            v-if="currentTab === 'created'"
            :class="[
              'w-full',
              'mx-auto',

              'columns-1',
              'laptop:columns-2',

              'gap-[16px]',
            ]"
          >
            <li>
              <NFTPortfolioEmpty v-if="!sellingNFTClassIds.length" preset="created" />
            </li>
            <li
              v-for="id in sellingNFTClassIds"
              :key="id"
            >
              <NFTPortfolioItem
                :class-id="id"
              />
            </li>
          </ul>
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
import { getAddressLikerIdMinApi } from '~/util/api';
import { ellipsis } from '~/util/ui';
import { logTrackerEvent } from '~/util/EventLogger';

import walletMixin from '~/mixins/wallet';
import portfolioMixin from '~/mixins/portfolio';

export default {
  name: 'MyDashboardPage',
  layout: 'default',
  filters: {
    ellipsis,
  },
  mixins: [walletMixin, portfolioMixin],
  head() {
    const name = ellipsis(this.userDisplayName);
    const title = this.$t('portfolio_title', { name });
    const description = this.$t('portfolio_description', { name });
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
          content:
            this.userAvatar ||
            `https://avatars.dicebear.com/api/identicon/${this.wallet}/600.png`,
        },
      ],
    };
  },
  data() {
    return {
      wallet: undefined,
      userInfo: null,
    };
  },
  computed: {
    userDisplayName() {
      return (this.userInfo && this.userInfo.displayName) || this.wallet;
    },
  },
  watch: {
    getAddress: {
      immediate: true,
      handler(newAddress) {
        if (newAddress) {
          this.fetchUserInfo();
          this.fetchUserSellingClasses(this.getAddress);
          this.fetchUserCollectedNFTs(this.getAddress);
        }
      },
    },
  },
  methods: {
    async fetchUserInfo() {
      try {
        const userInfo = await this.$api.get(
          getAddressLikerIdMinApi(this.getAddress),
          {
            validateStatus: code => code < 500 && code !== 400,
          }
        );
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
    goMyPortfolio() {
      logTrackerEvent(this, 'MyDashboard', 'GoToMyPortfolio', this.wallet, 1);
      this.$router.push({
        name: 'id',
        params: { id: this.wallet },
      });
    },
    handleCopyURL() {
      this.copyURL(this.wallet);
      logTrackerEvent(this, 'MyDashboard', 'CopyShareURL', this.wallet, 1);
    },
  },
};
</script>
