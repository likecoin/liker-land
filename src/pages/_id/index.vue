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
            :collected-items="ownedNFTs"
            :created-class-ids="sellingNFTClassIds"
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
          'max-w-[636px]',
          'desktop:w-[636px]',
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
              @click="goCollected"
            />
            <MenuButtonDivider v-if="sellingNFTClassIds.length" />
            <MenuButton
              v-if="isLoading || sellingNFTClassIds.length"
              text="Created"
              :is-selected="currentTab === 'created'"
              @click="goCreated"
            />
          </div>
          <ShareButton @copy="handleCopyURL" />
        </div>

        <CardV2 v-if="isLoading">Loading</CardV2>
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
              <div class="w-full pb-[32px] bg-shade-gray border-t-[1px] border-white">
                <div class="flex flex-col justify-center items-center mt-[-21px]">
                  <div class="w-[42px] h-[42px] rounded-[50%] bg-shade-gray border-[2px] border-white" />
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
import {
  getUserMinAPI,
  getUserSellNFTClasses,
  getAddressLikerIdMinApi,
} from '~/util/api';
import { convertAddressPrefix, isValidAddress } from '~/util/cosmos';
import { getNFTs } from '~/util/nft';
import { ellipsis, copyToClipboard } from '~/util/ui';
import { checkUserNameValid } from '~/util/user';
import { logTrackerEvent } from '~/util/EventLogger';

import walletMixin from '~/mixins/wallet';
import alertMixin from '~/mixins/alert';

export default {
  name: 'NFTPortfolioPage',
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
      return (this.userInfo && this.userInfo.displayName) || this.wallet;
    },
  },
  async asyncData({ route, $api, error }) {
    let { id } = route.params;
    if (id && isValidAddress(id)) {
      if (id.startsWith('cosmos1')) {
        id = convertAddressPrefix(id, 'like');
      }
      if (id.startsWith('like1')) {
        try {
          const userInfo = await $api.get(getAddressLikerIdMinApi(id), {
            validateStatus: code => code < 500 && code !== 400,
          });
          return {
            userInfo: userInfo.data,
            wallet: id,
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
        return {
          wallet: id,
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
    this.fetchUserSellingClasses();
    this.fetchUserCollectedNFTs();
  },
  methods: {
    async fetchUserCollectedNFTs() {
      const { nfts } = await getNFTs({ owner: this.wallet });
      this.ownedNFTs = nfts;
    },
    async fetchUserSellingClasses() {
      const { data } = await this.$api.get(
        getUserSellNFTClasses({ wallet: this.wallet })
      );
      this.sellingNFTClassIds = data.list;
      if (!this.sellingNFTClassIds.length) {
        this.currentTab = 'collected';
      }
      this.isLoading = false;
    },
    goCollected() {
      logTrackerEvent(this, 'UserPortfolio', 'GoCollectedTab', this.wallet, 1);
      this.currentTab = 'collected';
    },
    goCreated() {
      logTrackerEvent(this, 'UserPortfolio', 'GoCreatedTab', this.wallet, 1);
      this.currentTab = 'created';
    },
    goMyDashboard() {
      logTrackerEvent(this, 'UserPortfolio', 'GoToMyDashboard', this.wallet, 1);
      this.$router.push({
        name: 'dashboard',
      });
    },
    handleCopyURL() {
      const host = `${window.location.protocol}//${window.location.host}`;
      const { path } = this.$route;
      const url = `${host}${path}`;
      copyToClipboard(url);

      logTrackerEvent(this, 'UserPortfolio', 'CopyShareURL', url, 1);

      this.alertPromptSuccess(this.$t('tooltip_share_done'));
    },
  },
};
</script>
