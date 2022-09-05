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
              :avatar-url="userAvatar"
              :avatar-size="88"
              :is-avatar-outlined="isUserCivicLiker"
            />
            <NuxtLink :class="['flex', 'mt-[8px]']" :to="`/${iscnOwner}`">
              <Label preset="h3" :class="['text-like-green', 'mt-[18px]']">
                {{ userDisplayName | ellipsis }}
              </Label>
            </NuxtLink>
            <template v-if="userDescription">
              <hr :class="['w-full', 'border-shade-gray', 'my-[24px]']">
              <Label preset="p6" :class="['break-all', 'font-200']">
                {{ userDescription }}
              </Label>
            </template>
            <ButtonV2
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
            'bg-like-cyan-pale',
            'gap-[24px]',
            'desktop:col-span-2',
          ]"
        >
          <Label preset="h3" class="text-like-green font-600" :text="shareTitle" />
          <div class="w-[480px]">
            <div
              class="rounded-[18px] p-[3px] bg-cover"
              style="
                background-image: url('/images/gradient/like-gradient-lighter-blur.svg');
              "
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
                <div class="flex items-center justify-between mt-[16px] w-full">
                  <div class="flex items-center">
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
                    <ProgressIndicator v-if="isCollecting" />
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
import { getLIKEPrice, getAddressLikerIdMinApi } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { LIKECOIN_BUTTON_BASE } from '~/constant';
import { ellipsis } from '~/util/ui';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import navigationListenerMixin from '~/mixins/navigation-listener';

export default {
  layout: 'default',
  filters: {
    ellipsis,
  },
  mixins: [nftMixin, navigationListenerMixin, walletMixin],
  data() {
    return {
      userInfo: null,
      isLoading: true,

      currentPrice: 0,
      isCollecting: false,
    };
  },
  computed: {
    classId() {
      return this.$route.params.classId;
    },
    isUserCivicLiker() {
      return !!(
        this.userInfo &&
        (this.userInfo.isCivicLikerTrial ||
          this.userInfo.isSubscribedCivicLiker)
      );
    },
    userDisplayName() {
      return (this.userInfo && this.userInfo.displayName) || this.referrer;
    },
    userDescription() {
      return this.userInfo && this.userInfo.description;
    },
    userAvatar() {
      return (
        (this.userInfo && this.userInfo.avatar) ||
        `https://avatars.dicebear.com/api/identicon/${this.referrer}.svg`
      );
    },
    isCreator() {
      return this.referrer === this.iscnOwner;
    },
    isCollector() {
      return Object.prototype.hasOwnProperty.call(
        this.ownerInfo,
        this.referrer
      );
    },
    shareTitle() {
      return this.isCreator
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
      this.updateUerInfo(),
    ]);
    if (
      this.referrer &&
      this.referrer !== this.iscnOwner &&
      !Object.prototype.hasOwnProperty.call(this.ownerInfo, this.referrer)
    ) {
      this.invalidToShare();
      return;
    }
    this.isLoading = false;
  },
  methods: {
    async handleCollect() {
      logTrackerEvent(this, 'NFT', 'NFTCollect(DetailsPage)', this.classId, 1);
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.handleCollect();
        }
        return;
      }
      try {
        this.isCollecting = true;
        this.updateUserCollectedCount(this.classId, this.getAddress);
        await this.collectNFT();
      } catch (error) {
        // no need to handle error
      } finally {
        this.isCollecting = false;
      }
    },
    async updateUerInfo() {
      try {
        const userInfo = await this.$api.get(
          getAddressLikerIdMinApi(this.referrer),
          {
            validateStatus: code => code < 500 && code !== 400,
          }
        );
        this.userInfo = userInfo.data;
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
      this.$router.push({
        name: 'nft-class-classId',
        params: { classId: this.classId },
        query: undefined,
      });
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
    invalidToShare() {
      logTrackerEvent(
        this,
        'NFT',
        'NFTViewDetails(invalidToShare)',
        this.classId,
        1
      );
      this.$router.push({
        name: 'nft-class-classId',
        params: { classId: this.classId },
      });
    },
    async getLIKEPrice() {
      try {
        const { data } = await this.$api.get(getLIKEPrice());
        this.currentPrice = data.likecoin.usd;
      } catch (error) {
        this.alertPromptError('LIKE_PRICE_IS_TEMPORARY_UNAVAILABLE');
      }
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
