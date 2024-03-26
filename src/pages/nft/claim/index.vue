<template>
  <main>
    <div class="flex justify-center item-start gap-[45px] w-full mb-[60px]">
      <NFTWidgetBaseCard class="w-full max-w-[426px]">
        <NuxtLink
          :to="
            localeLocation({
              name: isCollection
                ? 'nft-collection-collectionId'
                : 'nft-class-classId',
              params: { collectionId, classId },
            })
          "
          target="_blank"
        >
          <NFTWidgetContentPreview
            :class="[
              'transition-shadow',
              'cursor-pointer',
              'min-h-[300px]',
              'w-full',
            ]"
            :title="NFTName"
            :description="NFTDescription"
            :img-src="NFTImageUrl"
            @click="handleClickViewDetails"
          />
        </NuxtLink>
      </NFTWidgetBaseCard>
      <NFTClaimMainSection
        v-if="state === NFT_CLAIM_STATE.ERROR"
        :key="state"
        :header-text="`ERRORs`"
      />

      <!-- Edge Case -->
      <!-- <NFTClaimMainSection
        v-else-if="
          state === NFT_CLAIM_STATE.WELCOME && giftInfo && isPhysicalOnly
        "
        :header-text="`GiftInfo`"
      /> -->

      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.WELCOME && giftInfo"
        :key="`${state}-giftInfo`"
        :header-text="`GiftInfo`"
      />
      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.WELCOME && isPhysicalOnly"
        :key="`${state}-isPhysicalOnly`"
        :header-text="`Physical`"
      />
      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.WELCOME"
        :key="state"
        :header-text="$t('nft_claim_welcome_title')"
        :content-text="$t('nft_claim_welcome_text')"
      >
        <template #header-prepend>
          <IconCircleCheck class="w-[48px]" />
        </template>
        <template #header-append>
          <Label
            class="text-like-green"
            preset="h5"
            :text="$t('nft_claim_NFT_name', { name: NFTName })"
          />
        </template>
        <template #footer>
          <ButtonV2
            :text="$t('nft_claim_welcome_button_claim')"
            @click="handleClickNext"
          />
        </template>
      </NFTClaimMainSection>
      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.LOGIN"
        :key="state"
        :step="1"
        :total-step="3"
        :header-text="`login`"
      />
      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.ID_CONFIRMATION"
        :key="state"
        :header-text="`ID_CONFIRMATION`"
      />
      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.MESSAGE"
        :key="state"
        :header-text="`MESSAGE`"
      />
      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.CLAIMED"
        :key="state"
        :header-text="`CLAIMED`"
      />
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';

import {
  logTrackerEvent,
  logPurchaseFlowEvent,
  logPurchaseNFTBookEvent,
} from '~/util/EventLogger';
import {
  postStripeFiatPendingClaim,
  getNFTBookClaimEndpoint,
  getNFTBookPaymentStatusEndpoint,
  getFreeNFTBookPurchaseEndpoint,
} from '~/util/api';
import { isValidAddress } from '~/util/cosmos';
import {
  getNFTClassCollectionType,
  nftClassCollectionType,
  parseNFTMetadataURL,
  LIKE_ADDRESS_REGEX,
} from '~/util/nft';

import alertMixin from '~/mixins/alert';
import walletMixin from '~/mixins/wallet';
import nftMixin from '~/mixins/nft';
import nftOrCollectionMixin from '~/mixins/nft-or-collection';

const NFT_CLAIM_STATE = {
  WELCOME: 'WELCOME',
  LOGIN: 'LOGIN',
  ID_CONFIRMATION: 'ID_CONFIRMATION',
  MESSAGE: 'MESSAGE',
  CLAIMING: 'CLAIMING',
  CLAIMED: 'CLAIMED',
  ERROR: 'ERROR',
};

export default {
  name: 'NFTClaimPage',
  mixins: [alertMixin, walletMixin, nftMixin, nftOrCollectionMixin],
  async asyncData({ query, store, error, i18n }) {
    const {
      class_id: classId,
      collection_id: collectionId,
      payment_id: paymentId,
      claiming_token: token,
      free,
    } = query;
    if (!free && ((!classId && !collectionId) || !token || !paymentId)) {
      error({ statusCode: 400, message: i18n.t('nft_claim_missing_qs') });
      return;
    }
    try {
      if (collectionId) {
        await store.dispatch('lazyFetchNFTCollectionInfoByCollectionId', {
          collectionId,
        });
      } else if (classId) {
        await store.dispatch('lazyGetNFTClassMetadata', classId);
        const classCollectionType = getNFTClassCollectionType(
          store.getters.getNFTClassMetadataById(classId)
        );
        if (classCollectionType === nftClassCollectionType.NFTBook) {
          await store.dispatch('lazyFetchNFTBookInfoByClassId', classId);
        }
      }
    } catch (err) {
      console.error(err);
      error({ statusCode: 404, message: i18n.t('nft_claim_class_not_found') });
    }
  },
  data() {
    return {
      nftId: '',
      state: NFT_CLAIM_STATE.WELCOME,
      error: '',
      isFreePurchase: this.$route.query.free,
      priceIndex: this.$route.query.price_index,
      collectorMessage: '',
      claimingAddressInput: '',
      claimingAddress: '',
      claimingFreeEmail: '',
      giftInfo: null,
      isPhysicalOnly: false,
      NFT_CLAIM_STATE,
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassMetadataById',
      'getISCNMetadataById',
      'getCanViewNFTBookBeforeClaimByClassId',
      'getNFTCollectionInfoByCollectionId',
      'getIsHideNFTBookDownload',
    ]),
    classId() {
      return this.$route.query.class_id;
    },
    collectionId() {
      return this.$route.query.collection_id;
    },
    paymentId() {
      return this.$route.query.payment_id;
    },
    token() {
      return this.$route.query.claiming_token;
    },
    isNFTBook() {
      return this.$route.query.type === 'nft_book';
    },
    text() {
      switch (this.state) {
        case NFT_CLAIM_STATE.CLAIMING:
          return this.$t('nft_claim_claiming');
        case NFT_CLAIM_STATE.CLAIMED:
          if (this.isNFTBook && !this.nftId) {
            return this.$t('nft_claim_claimed_nft_book');
          }
          return this.$t('nft_claim_claimed');
        case NFT_CLAIM_STATE.PHYSICAL_ONLY:
          return this.$t('nft_claim_physical_only');
        case NFT_CLAIM_STATE.ERROR:
          return this.error
            ? this.$t('nft_claim_error_message', { error: this.error })
            : this.$t('nft_claim_error_message_unknown');
        default:
          return '';
      }
    },
    nftIsDownloadHidden() {
      return this.classIds.some(classId =>
        this.getIsHideNFTBookDownload(classId)
      );
    },
    shouldBlockClaim() {
      return (
        !this.claimingAddress ||
        [NFT_CLAIM_STATE.CLAIMING, NFT_CLAIM_STATE.CLAIMED].includes(this.state)
      );
    },
    creatorDisplayName() {
      return this.getUserInfoByAddress(this.NFTOwner)?.displayName || 'creator';
    },
    canViewContentDirectly() {
      return (
        !this.isFreePurchase &&
        this.classIds.some(classId =>
          this.getCanViewNFTBookBeforeClaimByClassId(classId)
        )
      );
    },
    isContentDownloadable() {
      return this.isFreePurchase || !this.nftIsDownloadHidden;
    },
  },
  watch: {
    walletEmail() {
      this.claimingFreeEmail = this.walletEmail;
    },
    getAddress() {
      if (this.isFreePurchase) this.claimingAddress = this.getAddress;
    },
    loginAddress() {
      this.claimingAddress = this.loginAddress;
    },
  },
  async mounted() {
    const { redirect, free, from, ...query } = this.$route.query;
    let price;
    try {
      const { data } = await this.$api.get(
        getNFTBookPaymentStatusEndpoint({
          classId: this.classId,
          collectionId: this.collectionId,
          paymentId: this.paymentId,
        })
      );
      ({ price } = data);
      const { giftInfo, isPhysicalOnly } = data;
      this.giftInfo = giftInfo;
      this.isPhysicalOnly = isPhysicalOnly;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    if (!free && !this.giftInfo && redirect && query.type === 'nft_book') {
      logPurchaseFlowEvent(this, 'purchase', {
        items: [
          {
            name: this.NFTName,
            collectionId: this.collectionId,
            classId: this.classId,
            price,
          },
        ],
        price,
        currency: 'USD',
        isNFTBook: true,
      });
      logPurchaseNFTBookEvent(this, {
        name: this.NFTName,
        currency: 'USD',
        collectionId: this.collectionId,
        classId: this.classId,
        price,
      });
      this.$router.replace({
        ...this.$route,
        query,
      });
    }
    this.claimingAddress = this.loginAddress;
    if (this.isFreePurchase) {
      this.claimingAddress = this.getAddress;
    }
  },
  methods: {
    isValidAddress,
    parseNFTMetadataURL,
    getIscnData(classId) {
      const metadata = this.getNFTClassMetadataById(classId);
      const iscnId =
        metadata.parent?.iscnIdPrefix || metadata.parent?.iscn_id_prefix;
      const data = this.getISCNMetadataById(iscnId);
      if (data instanceof Promise) return undefined;
      return data;
    },
    checkNftIsNFTBook(classId) {
      const metadata = this.getNFTClassMetadataById(classId);
      return (
        getNFTClassCollectionType(metadata) === nftClassCollectionType.NFTBook
      );
    },
    onEnterClaimingAddress() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_nft_book_on_address_entered',
        this.primaryKey
      );
      this.claimingAddress = this.claimingAddressInput;
    },
    async onClickLogin() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_nft_book_on_login_clicked',
        this.primaryKey
      );
      await this.connectWallet();
    },
    async startFreePurchase() {
      try {
        this.state = NFT_CLAIM_STATE.CLAIMING;
        if (!this.claimingFreeEmail && !this.claimingAddress) {
          this.alertPromptError(
            this.$t('nft_free_claim_enter_email_or_address')
          );
          this.state = NFT_CLAIM_STATE.WELCOME;
          return;
        }
        this.claimPromise = this.$api.post(
          getFreeNFTBookPurchaseEndpoint({
            classId: this.classId,
            collectionId: this.collectionId,
            priceIndex: this.priceIndex,
          }),
          {
            email: this.claimingFreeEmail,
            wallet: this.claimingAddress,
          }
        );
        const { data } = await this.claimPromise;
        this.claimPromise = undefined;
        this.nftId = data.nftId;
        if (data.nftId) {
          this.$router.push(
            this.localeLocation({
              name: 'nft-class-classId-nftId',
              params: {
                classId: this.classId,
                nftId: data.nftId,
              },
            })
          );
        } else {
          this.state = NFT_CLAIM_STATE.CLAIMED;
        }
        logTrackerEvent(
          this,
          'NFT',
          'nft_free_nft_book_purchased',
          this.primaryKey
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        logTrackerEvent(
          this,
          'NFT',
          'nft_free_nft_book_purchase_error',
          this.primaryKey
        );
        this.alertPromptError(
          this.$t('nft_free_claim_error_message', {
            error: this.error,
          })
        );
        this.state = NFT_CLAIM_STATE.ERROR;
      }
    },
    async claim() {
      if (this.shouldBlockClaim) {
        return;
      }
      if (this.isFreePurchase) {
        await this.startFreePurchase();
        return;
      }

      logTrackerEvent(this, 'NFT', 'nft_claim_claim_button_clicked', '', 1);

      if (this.isNFTBook) {
        await this.claimNFTBookPurchase();
      } else {
        await this.claimFiatPurchase();
      }
    },
    async claimFiatPurchase() {
      try {
        if (this.claimPromise) return;
        this.state = NFT_CLAIM_STATE.CLAIMING;
        this.claimPromise = this.$api.post(
          postStripeFiatPendingClaim({
            wallet: this.claimingAddress,
            paymentId: this.paymentId,
            token: this.token,
          })
        );
        const { data } = await this.claimPromise;
        this.claimPromise = undefined;
        this.nftId = data.nftId;
        this.state = NFT_CLAIM_STATE.CLAIMED;
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_fiat_purchase_claimed',
          this.primaryKey
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_fiat_purchase_claim_error',
          this.primaryKey
        );
        this.alertPromptError(
          this.$t('settings_email_verify_error_message', {
            error: this.error,
          })
        );
        this.state = NFT_CLAIM_STATE.ERROR;
      }
    },
    async claimNFTBookPurchase() {
      try {
        if (this.claimPromise) return;
        this.state = NFT_CLAIM_STATE.CLAIMING;
        this.claimPromise = this.$api.post(
          getNFTBookClaimEndpoint({
            classId: this.classId,
            collectionId: this.collectionId,
            paymentId: this.paymentId,
            token: this.token,
          }),
          {
            paymentId: this.paymentId,
            wallet: this.claimingAddress,
            message: this.collectorMessage,
          }
        );
        const { data } = await this.claimPromise;
        this.claimPromise = undefined;
        this.nftId = data.nftId;
        if (data.nftId) {
          this.$router.push(
            this.localeLocation({
              name: 'nft-class-classId-nftId',
              params: {
                classId: this.classId,
                nftId: data.nftId,
              },
            })
          );
        } else {
          this.state = NFT_CLAIM_STATE.CLAIMED;
        }
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_nft_book_claimed',
          this.primaryKey
        );
      } catch (error) {
        const errorMessage = error.response?.data || error.message;
        if (errorMessage === 'PAYMENT_ALREADY_CLAIMED') {
          this.state = NFT_CLAIM_STATE.CLAIMED;
          return;
        }

        // eslint-disable-next-line no-console
        console.error(error);
        this.error = errorMessage;
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_nft_book_claim_error',
          this.primaryKey
        );
        this.alertPromptError(
          this.$t('settings_email_verify_error_message', {
            error: this.error,
          })
        );
        this.state = NFT_CLAIM_STATE.ERROR;
      }
    },
    onInputCollectorMessage() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_collector_message_input',
        this.primaryKey
      );
    },
    handleClickViewDetails() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_view_details_clicked',
        this.primaryKey,
        1
      );
    },
    handleClickView() {
      logTrackerEvent(this, 'NFT', 'nft_claim_view_button_clicked', '', 1);
      if (this.collectionId) {
        if (this.claimingAddress) {
          this.$router.push(
            this.localeLocation({
              name: 'id',
              params: { id: this.claimingAddress },
            })
          );
        } else {
          this.$router.push(
            this.localeLocation({
              name: 'nft-collection-collectionId',
              params: {
                collectionId: this.collectionId,
              },
            })
          );
        }
      } else {
        this.$router.push(
          this.localeLocation({
            name: this.nftId ? 'nft-class-classId-nftId' : 'nft-class-classId',
            params: {
              classId: this.classId,
              nftId: this.nftId,
            },
          })
        );
      }
    },
    handleClickRetry() {
      logTrackerEvent(this, 'NFT', 'nft_claim_retry_button_clicked', '', 1);
      this.claim();
    },
    handleClickViewContentDirectly(e, contentUrl, type) {
      logTrackerEvent(
        this,
        'NFT',
        'ClaimViewContentDirect',
        this.primaryKey,
        1
      );
    },
    handleRecommendedItemClick(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_recommend_item_click',
        classId,
        1
      );
    },
    handleRecommendedItemCollect(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_recommend_item_collect',
        classId,
        1
      );
    },
    handleRecommendationSlideNext() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_recommendation_clicked_next',
        this.primaryKey,
        1
      );
    },
    handleRecommendationSlidePrev() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_recommendation_clicked_prev',
        this.primaryKey,
        1
      );
    },
    handleRecommendationSliderMove() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_recommendation_moved_slider',
        this.primaryKey,
        1
      );
    },

    handleClickNext() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_next_from_${this.state}`,
        this.primaryKey,
        1
      );
      switch (this.state) {
        case NFT_CLAIM_STATE.WELCOME:
          if (this.claimingAddress) {
            this.state = NFT_CLAIM_STATE.ID_CONFIRMATION;
            break;
          }
          this.state = NFT_CLAIM_STATE.LOGIN;
          break;

        case NFT_CLAIM_STATE.LOGIN:
          this.state = NFT_CLAIM_STATE.ID_CONFIRMATION;
          break;

        case NFT_CLAIM_STATE.ID_CONFIRMATION:
          this.state = NFT_CLAIM_STATE.MESSAGE;
          break;

        case NFT_CLAIM_STATE.MESSAGE:
          this.state = NFT_CLAIM_STATE.CLAIMING;
          break;

        case NFT_CLAIM_STATE.CLAIMING:
          this.state = NFT_CLAIM_STATE.CLAIMED;
          break;

        default:
          break;
      }
    },
  },
};
</script>
