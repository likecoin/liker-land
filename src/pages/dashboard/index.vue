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
      <div class="relative flex items-center mb-[48px] w-full">
        <UserStatsMyDashboard
          class="flex flex-col items-center w-full laptop:flex-row"
          :collected-items="ownedNFTs"
          :created-class-ids="sellingNFTClassIds"
          :is-loading="isLoading"
          @goCreated="goCreated"
          @goCollected="goCollected"
        />
        <ShareButton class="absolute right-[-40px]" @copy="handleCopyURL" />
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
        <div :class="['flex', 'items-center', 'mb-[48px]', 'w-full']">
          <ButtonV2
            preset="tertiary"
            text="Portfolio View"
            class="absolute left-[-120px] rounded-[16px]"
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
              @click="goCollected"
            />
            <MenuButtonDivider v-if="sellingNFTClassIds.length" />
            <MenuButton
              v-if="isLoading || sellingNFTClassIds.length"
              :text="$t('nft_portfolio_page_label_created')"
              :is-selected="currentTab === 'created'"
              @click="goCreated"
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
            <NFTPortfolioCard
              v-if="!ownedNFTs.length"
              class="!bg-shade-gray break-inside-avoid"
            >
              <div class="p-[8px] w-full h-[140px]">
                <div
                  class="z-[5] h-full w-full bg-repeat-space"
                  :style="{
                    backgroundImage: `url(/images/NFT/background_cross.png)`,
                  }"
                />
              </div>
              <div
                class="
                  w-full
                  pb-[32px]
                  bg-shade-gray
                  border-t-[1px] border-white
                "
              >
                <div
                  class="flex flex-col justify-center items-center mt-[-21px]"
                >
                  <div
                    class="
                      w-[42px]
                      h-[42px]
                      rounded-[50%]
                      bg-shade-gray
                      border-[2px] border-white
                    "
                  />
                  <Label
                    class="text-medium-gray mt-[12px]"
                    :text="$t('portfolio_collected_tab_no_item')"
                  />
                </div>
              </div>
            </NFTPortfolioCard>
            <NFTPortfolioItem
              v-for="id in ownedNFTClassIds"
              :key="id"
              :class-id="id"
            />
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
            <NFTPortfolioItem
              v-for="id in sellingNFTClassIds"
              :key="id"
              :class-id="id"
            />
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
import { getUserSellNFTClasses, getAddressLikerIdMinApi } from '~/util/api';
import { getNFTs } from '~/util/nft';
import { ellipsis, copyToClipboard } from '~/util/ui';
import { logTrackerEvent } from '~/util/EventLogger';

import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';

export default {
  name: 'NFTMyDashboard',
  layout: 'default',
  filters: {
    ellipsis,
  },
  mixins: [walletMixin, alertMixin],
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
      ownedNFTs: [],
      sellingNFTClassIds: [],
      currentTab: ['collected', 'created'].includes(this.$route.query.tab)
        ? this.$route.query.tab
        : 'created',
      isLoading: true,
    };
  },
  computed: {
    ownedNFTClassIds() {
      const classIdSet = new Set(this.ownedNFTs.map(n => n.classId));
      return Array.from(classIdSet);
    },
    userDisplayName() {
      return this.userInfo?.displayName || this.wallet;
    },
  },
  watch: {
    getAddress: {
      immediate: true,
      handler(newAddress) {
        if (newAddress) {
          this.fetchUserInfo();
          this.fetchUserSellingClasses();
          this.fetchUserCollectedNFTs();
        }
      },
    },
  },
  methods: {
    async fetchUserCollectedNFTs() {
      const { nfts } = await getNFTs({ owner: this.getAddress });
      this.ownedNFTs = nfts;
    },
    async fetchUserSellingClasses() {
      const { data } = await this.$api.get(
        getUserSellNFTClasses({ wallet: this.getAddress })
      );
      this.sellingNFTClassIds = data.list;
      if (!this.sellingNFTClassIds.length) {
        this.currentTab = 'collected';
      }
      this.isLoading = false;
    },
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
    goCollected() {
      logTrackerEvent(this, 'MyDashboard', 'GoCollectedTab', this.wallet, 1);
      this.currentTab = 'collected';
    },
    goCreated() {
      logTrackerEvent(this, 'MyDashboard', 'GoCreatedTab', this.wallet, 1);
      this.currentTab = 'created';
    },
    goMyPortfolio() {
      logTrackerEvent(this, 'MyDashboard', 'GoToMyPortfolio', this.wallet, 1);
      this.$router.push({
        name: 'id',
        params: { id: this.wallet },
      });
    },
    handleCopyURL() {
      const host = `${window.location.protocol}//${window.location.host}`;
      const url = `${host}/${this.wallet}`;
      copyToClipboard(url);
      this.alertPromptSuccess(this.$t('tooltip_share_done'));
      logTrackerEvent(this, 'MyDashboard', 'CopyShareURL', url, 1);
    },
  },
};
</script>
