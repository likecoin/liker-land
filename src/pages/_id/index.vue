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

        <CardV2
          v-if="isLoading"
        >{{ $t('nft_portfolio_page_label_loading') }}</CardV2>
        <div
          v-else-if="
            currentTab === 'collected' ||
              // Show grid if empty in created tab & not user portfolio
              (currentTab === 'created' && (sortedCreatedClassIds.length || getAddress === wallet))
          "
          class="w-full"
        >
          <ul ref="nftGrid">
            <template v-if="currentTab === 'collected'">
              <li v-if="!sortedCollectedNFTs.length" class="w-full">
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
                v-if="!sortedCreatedClassIds.length && getAddress === wallet"
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
          !this.sortedCollectedNFTs.length
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
    this.loadNFTListByAddress(this.wallet);
    if (!this.isLoading) {
      this.setupNFTGrid();
    }
    if (this.hasMoreNFTs) {
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
