<template>
  <Page>
    <CardV2 v-if="isLoading" class="absolute top-[40%]">{{
      $t('nft_details_page_label_loading')
    }}</CardV2>
    <div
      v-else
      :class="['mt-[8px]', 'px-[12px]', 'laptop:px-[24px]', 'self-stretch']"
    >
      <section
        :class="[
          'grid',
          'grid-cols-1',
          'desktop:grid-cols-3',
          'gap-[24px]',

          'w-full',
          'max-w-[1024px]',
          'mx-auto',
          'pb-[120px]',
        ]"
      >
        <!-- Left column -->
        <div
          :class="[
            'flex',
            'flex-col',

            'items-center',
            'desktop:items-start',

            'gap-[24px]',
          ]"
        >
          <CardV2
            :class="[
              'flex',
              'flex-col',
              'items-center',
              'w-full',
              'laptop:w-[310px]',
            ]"
          >
            <Identity
              :avatar-url="referrerAvatar"
              :avatar-size="88"
              :is-avatar-outlined="isReferrerCivicLiker"
            />
            <NuxtLink :class="['flex', 'mt-[8px]']" :to="`/${referrer}`">
              <Label preset="h3" :class="['text-like-green', 'mt-[18px]']">
                {{ referrerDisplayName | ellipsis }}
              </Label>
            </NuxtLink>
            <template v-if="referrerDescription">
              <hr :class="['w-full', 'border-shade-gray', 'my-[24px]']">
              <Label preset="p6" :class="['break-all', 'font-200']">
                {{ referrerDescription }}
              </Label>
            </template>
            <UserStatsPortfolio
              v-if="isReferrerTheCreator"
              class="grid grid-cols-2 cursor-default gap-x-8 gap-y-4 text-medium-gray mt-[12px]"
              :collected-items="collectedNFTs"
              :created-class-ids="sellingNFTClassIds"
              :is-loading="isLoading"
            />
            <ButtonV2
              v-else
              class="mt-[16px]"
              :text="$t('nft_share_page_button_portfolio')"
              preset="tertiary"
              @click="handleGoCollected"
            >
              <template #prepend>
                <IconView />
              </template>
            </ButtonV2>
          </CardV2>
        </div>
        <!-- Right column -->
        <div
          id="speech-bubble"
          :class="[
            'relative',
            'flex',
            'flex-col',
            'items-center',
            'justify-center',
            'rounded-[32px]',

            'py-[48px]',
            'px-[12px]',
            'phone:py-[28px]',

            'bg-like-cyan-pale',
            'gap-[24px]',
            'desktop:col-span-2',
          ]"
        >
          <Label preset="h3" align="center" class="text-like-green font-600" :text="shareTitle" />
          <div class="w-full max-w-[480px]">
            <div
              class="rounded-[18px] p-[3px] bg-cover bg-[url('/images/gradient/like-gradient-lighter-blur.svg')]"
            >
              <NFTWidgetBaseCard
                :class="[
                  'flex',
                  'flex-col',
                  'items-center',
                  'w-full',
                  'border-none',
                ]"
              >
                <NFTWidgetContentPreview
                  tag="div"
                  :class="[
                    'transition-shadow',
                    'cursor-pointer',
                    'hover:shadow-[0_0_0_2px_#aaf1e7]',
                    'min-h-[300px]',
                    'w-full',
                  ]"
                  :title="NFTName"
                  :description="NFTDescription"
                  :img-src="NFTImageUrl"
                  :img-bg-color="NFTImageBackgroundColor"
                  @click="handleClickNFTDetails"
                />
                <div
                  :class="[
                    'flex',
                    'items-center',
                    'justify-between',

                    'phone:flex-col',

                    'mt-[16px]',
                    'w-full',
                  ]"
                >
                  <div class="flex items-center phone:mb-[18px]">
                    <ToolTips :tool-tip-text="$t('campaign_nft_item_collected_count_label')">
                      <Label preset="h6" class="mr-[22px] text-medium-gray" :text="mintedCount"><template #prepend><IconMint /></template></Label>
                    </ToolTips>
                    <ToolTips :tool-tip-text="$t('nft_details_page_title_collector')">
                      <Label preset="h6" class="mr-[22px] text-medium-gray" :text="ownerCount"><template #prepend><IconPersonMini /></template></Label>
                    </ToolTips>
                    <ToolTips :tool-tip-text="$t('nft_details_page_label_price')">
                      <Label preset="h5" class="text-like-green font-600" :text="`${NFTPrice} LIKE`"><template #prepend><IconPrice /></template></Label>
                    </ToolTips>
                  </div>
                  <div>
                    <ProgressIndicator v-if="uiIsOpenCollectModal" />
                    <ButtonV2
                      v-else
                      preset="secondary"
                      :text="$t('nft_details_page_button_collect_now')"
                      @click="handleCollect"
                    >
                      <template #prepend>
                        <IconPrice />
                      </template>
                    </ButtonV2>
                  </div>
                </div>
              </NFTWidgetBaseCard>
            </div>
            <NFTWidgetLikeActionBar
              class="mt-[8px]"
              :creator-display-name="iscnOwnerDisplayName"
              :creator-avatar-src="iscnOwnerAvatar"
              :creator-address="iscnOwner"
              :like-action-label="$t('campaign_nft_item_like_action_label')"
              @like="handleLike"
            />
          </div>
        </div>
      </section>
    </div>
  </Page>
</template>

<script>
import { mapActions } from 'vuex';

import { LIKECOIN_BUTTON_BASE } from '~/constant';

import { logTrackerEvent } from '~/util/EventLogger';
import { ellipsis } from '~/util/ui';

import navigationListenerMixin from '~/mixins/navigation-listener';
import nftMixin from '~/mixins/nft';
import portfolioMixin from '~/mixins/portfolio';

export default {
  layout: 'default',
  filters: {
    ellipsis,
  },
  mixins: [navigationListenerMixin, nftMixin, portfolioMixin],
  head() {
    const title = this.NFTName || this.$t('nft_details_page_title');
    const description =
      this.NFTDescription || this.$t('nft_details_page_description');
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
            this.NFTImageUrl || 'https://liker.land/images/og/writing-nft.jpg',
        },
      ],
      link: [
        { rel: 'canonical', href: this.$route.path.replace('/share', '') },
      ],
    };
  },
  data() {
    return {
      referrerInfo: null,
      isLoading: true,
    };
  },
  computed: {
    ...mapActions(['fetchUserInfoByAddress']),
    classId() {
      return this.$route.params.classId;
    },
    isReferrerCivicLiker() {
      return !!(
        this.referrerInfo &&
        (this.referrerInfo.isCivicLikerTrial ||
          this.referrerInfo.isSubscribedCivicLiker)
      );
    },
    referrerDisplayName() {
      return (
        (this.referrerInfo && this.referrerInfo.displayName) || this.referrer
      );
    },
    referrerDescription() {
      return this.referrerInfo && this.referrerInfo.description;
    },
    referrerAvatar() {
      return (
        (this.referrerInfo && this.referrerInfo.avatar) ||
        `https://avatars.dicebear.com/api/identicon/${this.referrer}.svg`
      );
    },
    isReferrerTheCreator() {
      return this.referrer === this.iscnOwner;
    },
    isReferrerTheCollector() {
      return !!this.ownerInfo[this.referrer];
    },
    shareTitle() {
      return this.isReferrerTheCreator
        ? this.$t('nft_share_page_creator_title')
        : this.$t('nft_share_page_collector_title');
    },
  },
  asyncData({ query }) {
    const { referrer } = query;
    return { referrer };
  },
  async fetch({ route, store }) {
    const { classId } = route.params;
    await store.dispatch('fetchNFTMetadata', classId);
  },
  async mounted() {
    await Promise.all([
      this.updateDisplayNameList(this.iscnOwner),
      this.updateNFTPurchaseInfo(),
      this.updateNFTOwners(),
      this.updateReferrerInfo(),
    ]);
    if (
      this.referrer &&
      this.referrer !== this.iscnOwner &&
      !this.ownerInfo[this.referrer]
    ) {
      logTrackerEvent(
        this,
        'NFT',
        'NFTViewDetails(ShareRedirect)',
        this.classId,
        1
      );
      this.goNFTDetails(this.classId);
      return;
    }
    if (this.isReferrerTheCreator) {
      this.fetchUserSellingNFTs(this.referrer);
      this.fetchUserCollectedNFTs(this.referrer);
    }
    this.isLoading = false;
  },
  methods: {
    async handleCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(SharePage)', this.classId, 1);
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.handleCollect();
        }
        return;
      }
      try {
        this.isCollecting = true;
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
    async updateReferrerInfo() {
      try {
        const referrerInfo = await this.fetchUserInfoByAddress(this.referrer);
        this.referrerInfo = referrerInfo.data;
      } catch (error) {
        // no need to handle error
      }
    },
    handleGoCollected() {
      this.$router.push({
        name: 'id',
        params: { id: this.referrer },
        query: { tab: 'collected' },
      });
    },
    handleClickNFTDetails() {
      this.goNFTDetails(this.classId);
      logTrackerEvent(this, 'NFT', 'NFTViewDetails(Share)', this.classId, 1);
    },
    handleLike() {
      logTrackerEvent(this, 'NFT', 'NFTLike(Share)', this.classId, 1);
      window.open(
        `${LIKECOIN_BUTTON_BASE}/in/like/iscn/?iscn_id=${encodeURIComponent(
          this.iscnId
        )}&action=like`,
        `like_${this.classId}`,
        'popup=1,width=768,height=576,top=0,left=0'
      );
    },
  },
};
</script>
<style scoped>
#speech-bubble:after {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-right-color: #d7ecec;
  border-left: 0;
  margin-top: -20px;
  margin-left: -20px;
}

@media screen and (max-width: 992px) {
  #speech-bubble:after {
    top: 0;
    left: 50%;
    border: 20px solid transparent;
    border-bottom-color: #d7ecec;
    border-top: 0;
    margin-left: -20px;
    margin-top: -20px;
  }
}
</style>
