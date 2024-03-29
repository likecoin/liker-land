<template>
  <main>
    <div class="w-full max-w-[400px] mx-auto p-[1rem] laptop:p-0 pt-0">
      <NFTWidgetBaseCard>
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
    </div>

    <MobileStickyCard
      class="flex flex-col justify-center items-center w-full laptop:max-w-[400px] mx-auto py-[1.5rem]"
    >
      <template v-if="state === 'PHYSICAL_ONLY'">
        <Label v-if="text" class="mb-[16px]" :text="text" align="center" />
      </template>
      <template v-else-if="giftInfo && state === 'GIFTING'">
        <div class="flex flex-col mt-[12px] mb-[18px]">
          <Label
            class="text-like-green"
            :text="
              $t('nft_claim_claimed_gift_title', { name: giftInfo.fromName })
            "
          >
            <template #prepend>
              <IconGift class="w-[32px]" />
            </template>
          </Label>
        </div>
        <div
          class="w-full flex flex-col gap-[8px] px-[12px] py-[8px] rounded-[12px] bg-shade-gray"
        >
          <Label
            class="text-dark-gray"
            :text="
              $t('nft_claim_claimed_gift_toName', { name: giftInfo.toName })
            "
          />
          <Label
            class="text-dark-gray"
            align="center"
            :text="giftInfo.message"
          />
          <Label
            class="text-medium-gray mt-[8px]"
            align="right"
            :text="
              $t('nft_claim_claimed_gift_fromName', { name: giftInfo.fromName })
            "
          />
        </div>
        <ButtonV2
          class="self-center mt-[24px]"
          :text="$t('nft_claim_claim')"
          preset="secondary"
          @click="handleClickNext"
        />
      </template>
      <template v-else>
        <div v-if="!claimingAddress" class="w-full">
          <template v-if="walletIsLoggingIn">
            <ProgressIndicator />
            <Label
              class="text-medium-gray w-full mt-[4px]"
              preset="p6"
              align="center"
              :text="$t('auth_required_view_hint_label_loading')"
            />
          </template>
          <template v-else>
            <template v-if="isFreePurchase">
              <div
                v-if="state === 'INITIAL'"
                class="flex flex-col justify-center w-full"
              >
                <Label
                  class="text-medium-gray"
                  preset="p6"
                  :text="$t('nft_free_claim_email_label')"
                  align="center"
                />
                <div
                  class="flex w-full py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]"
                >
                  <input
                    v-model="claimingFreeEmail"
                    class="w-full bg-transparent border-0 focus-visible:outline-none"
                    :placeholder="$t('nft_free_claim_enter_email')"
                    type="email"
                  />
                </div>
                <div class="flex justify-center w-full">
                  <ButtonV2
                    class="self-center mt-[24px]"
                    :text="$t('nft_free_claim_claim')"
                    preset="secondary"
                    @click="startFreePurchase"
                  />
                </div>
              </div>
              <Label
                v-else
                class="text-medium-gray"
                preset="p6"
                :text="$t('nft_free_claim_check_email_label')"
                align="center"
              />
            </template>
            <div v-else class="flex flex-col justify-center w-full">
              <Label
                class="text-medium-gray"
                preset="p6"
                :text="$t('nft_claim_enter_address_label')"
                align="center"
              />
              <div class="flex justify-center w-full gap-[12px] mt-[6px]">
                <TextField
                  v-model="claimingAddressInput"
                  class="w-full"
                  :error-message="errorMessage"
                  required
                  :placeholder="$t('nft_claim_enter_address_placeholder')"
                />
                <ButtonV2
                  v-if="!claimingAddressInput"
                  class="flex-shrink-0"
                  :text="$t('settings_page_content_with_auth_login_button')"
                  preset="secondary"
                  @click="onClickLogin"
                />
              </div>
              <ButtonV2
                class="self-center mt-[24px]"
                :text="
                  $t(
                    canViewContentDirectly
                      ? 'nft_claim_access_nft_book'
                      : 'nft_claim_claim'
                  )
                "
                preset="secondary"
                :is-disabled="
                  !claimingAddressInput ||
                    !isValidAddress(claimingAddressInput) ||
                    errorMessage
                "
                @click="onEnterClaimingAddress"
              />
            </div>
          </template>
        </div>
        <div v-else class="flex flex-col justify-center w-full">
          <Label v-if="text" class="mb-[16px]" :text="text" align="center" />
          <template v-if="state === 'INITIAL'">
            <Label
              preset="p6"
              class="text-medium-gray mb-[6px]"
              :text="$t('nft_collect_modal_leave_message')"
            />
            <div
              class="flex w-full py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]"
            >
              <IconMessage class="text-dark-gray" />
              <input
                v-model="collectorMessage"
                class="w-full bg-transparent border-0 focus-visible:outline-none"
                :placeholder="
                  $t('nft_collect_modal_leave_message_to_name', {
                    name: creatorDisplayName,
                  })
                "
                type="input"
                @input.once="onInputCollectorMessage"
              />
            </div>
            <ButtonV2
              class="self-center mt-[24px]"
              :text="$t('nft_claim_claim')"
              preset="secondary"
              @click="claim"
            />
          </template>
          <ProgressIndicator
            v-else-if="state === 'CLAIMING'"
            class="self-center"
          />
          <template v-else-if="state === 'CLAIMED'">
            <ButtonV2
              :text="$t('nft_claim_claimed_view_button')"
              preset="tertiary"
              @click="handleClickView"
            />
          </template>

          <ButtonV2
            v-else-if="state === 'ERROR'"
            :text="$t('nft_claim_claimed_retry_button')"
            preset="outline"
            @click="handleClickRetry"
          />
        </div>
        <div
          v-if="canViewContentDirectly"
          class="flex items-center justify-center gap-[4px] mt-[18px]"
        >
          <Label
            class="text-medium-gray text-[12px]"
            :text="$t('nft_claim_claimed_download')"
          />
          <div v-for="id in classIds" :key="id">
            <NFTWidgetBaseCard v-if="isCollection">
              <NuxtLink
                :to="
                  localeLocation({
                    name: 'nft-class-classId',
                    params: { classId: id },
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
                  :title="getNFTClassMetadataById(id).name"
                  :description="getNFTClassMetadataById(id).description"
                  :img-src="
                    parseNFTMetadataURL(getNFTClassMetadataById(id).image)
                  "
                />
              </NuxtLink>
            </NFTWidgetBaseCard>
            <NFTViewOptionList
              v-if="getCanViewNFTBookBeforeClaimByClassId(id)"
              :url="
                getIscnData(id)?.contentMetadata.url ||
                  getNFTClassMetadataById(id)?.external_url
              "
              :class-id="id"
              :content-urls="getIscnData(id)?.contentMetadata.sameAs"
              :iscn-url="getIscnData(id)?.contentMetadata.url"
              :is-nft-book="checkNftIsNFTBook(id)"
              :is-content-viewable="true"
              :is-content-downloadable="!getIsHideNFTBookDownload(id)"
              @view-content-url="handleClickViewContentDirectly"
            />
          </div>
        </div>
      </template>
    </MobileStickyCard>
    <div
      v-if="state === 'CLAIMED'"
      class="flex flex-col gap-[12px] w-full max-w-[996px] mx-auto my-[48px]"
    >
      <Label
        preset="h5"
        class="text-dark-gray"
        align="center"
        :text="$t('nft_recommendation_title')"
      />
      <NFTPageRecommendation
        class="w-full "
        :iscn-owner="getNFTClassMetadataById(classId)?.iscn_owner"
        :should-show-follow-button="false"
        :should-show-iscn-owner="false"
        :recommended-list="[]"
        :is-book-nft="true"
        :is-loading="isRecommendationLoading"
        @item-click="handleRecommendedItemClick"
        @item-collect="handleRecommendedItemCollect"
        @slide-next.once="handleRecommendationSlideNext"
        @slide-prev.once="handleRecommendationSlidePrev"
        @slider-move.once="handleRecommendationSliderMove"
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
  GIFTING: 'GIFTING',
  INITIAL: 'INITIAL',
  CLAIMING: 'CLAIMING',
  CLAIMED: 'CLAIMED',
  PHYSICAL_ONLY: 'PHYSICAL_ONLY',
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
      state: NFT_CLAIM_STATE.INITIAL,
      error: '',
      isFreePurchase: this.$route.query.free,
      priceIndex: this.$route.query.price_index,
      collectorMessage: '',
      claimingAddressInput: '',
      claimingAddress: '',
      claimingFreeEmail: '',
      giftInfo: null,
      isPhysicalOnly: false,
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
    errorMessage() {
      if (
        this.claimingAddressInput &&
        !LIKE_ADDRESS_REGEX.test(this.claimingAddressInput)
      ) {
        return this.$t('nft_claim_enter_address_errorMessage');
      }
      return '';
    },
  },
  watch: {
    walletEmail() {
      this.claimingFreeEmail = this.walletEmail;
    },
    async getAddress() {
      this.claimingAddressInput = this.getAddress;
      if (this.isFreePurchase) this.claimingAddress = this.getAddress;
      if (this.claimingAddress) {
        await this.fetchRecommendInfo();
      }
    },
    async loginAddress() {
      this.claimingAddressInput = this.loginAddress;
      this.claimingAddress = this.loginAddress;
      if (this.claimingAddress) {
        await this.fetchRecommendInfo();
      }
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
      if (this.isPhysicalOnly) {
        this.state = NFT_CLAIM_STATE.PHYSICAL_ONLY;
      } else if (this.giftInfo) {
        this.state = NFT_CLAIM_STATE.GIFTING;
      }
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
    this.claimingAddressInput = this.loginAddress || this.getAddress;
    if (this.isFreePurchase) {
      this.claimingAddress = this.claimingAddressInput;
    }
    if (this.claimingAddress) {
      await this.fetchRecommendInfo();
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
          this.state = NFT_CLAIM_STATE.INITIAL;
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
    handleClickNext() {
      this.state = NFT_CLAIM_STATE.INITIAL;
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
  },
};
</script>
