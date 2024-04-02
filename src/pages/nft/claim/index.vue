<template>
  <main class="relative p-[12px]">
    <div class="flex justify-center item-start gap-[32px] w-full mb-[60px]">
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
          <div class="flex flex-col gap-[16px] mb-[24px]">
            <NFTBookCoverWithFrame :src="NFTImageUrl" />
            <Label class="text-[28px] font-600" :text="NFTName" />
            <div class="grid grid-cols-2">
              <div class="flex flex-col">
                <Label
                  preset="h6"
                  :text="$t('nft_claim_NFT_author')"
                  class=" text-medium-gray"
                />
                <Label preset="h5" :text="iscnWorkAuthor" />
              </div>
              <div class="flex flex-col">
                <Label
                  preset="h6"
                  :text="$t('nft_claim_NFT_author')"
                  class=" text-medium-gray"
                />
                <Label preset="h5" :text="creatorDisplayName" />
              </div>
            </div>
            <p class="w-full line-clamp-3">{{ NFTDescription }}</p>
          </div>
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
        :header-text="
          $t('nft_claim_welcome_title_gift', { name: giftInfo.fromName })
        "
        :content-text="$t('nft_claim_welcome_text')"
      >
        <template #header-prepend>
          <IconGift class="w-[48px]" />
        </template>
        <template #header-append>
          <div
            class="flex flex-col items-start gap-[12px] text-dark-gray mt-[12px]"
          >
            <div
              class="border-[1px] border-shade-gray rounded-[20px] rounded-bl-[8px] shadow-md pl-[32px] pr-[24px] py-[12px] w-full min-w-[220px]"
            >
              <Label
                preset="h5"
                :text="
                  $t('nft_claim_welcome_title_gift_toName', {
                    name: giftInfo.toName,
                  })
                "
              />
              <span class="text-[18px] font-200">{{ giftInfo.message }}</span>
            </div>
            <Label preset="h5" :text="giftInfo.fromName" />
          </div>
        </template>
        <template #footer>
          <ButtonV2
            :text="$t('nft_claim_welcome_button_claim')"
            @click="handleClickNext"
          />
        </template>
      </NFTClaimMainSection>

      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.WELCOME && isPhysicalOnly"
        :key="`${state}-isPhysicalOnly`"
        :header-text="$t('nft_claim_welcome_title')"
        :content-text="$t('nft_claim_welcome_text_physical_only')"
      >
        <template #header-prepend>
          <IconCircleCheck class="w-[48px]" />
        </template>
        <template #footer>
          <ButtonV2
            class="px-[32px]"
            preset="tertiary"
            :text="$t('nft_book_gift_page_view_class_button')"
            @click="handleClickViewClass"
          />
        </template>
      </NFTClaimMainSection>

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
        :header-text="$t('nft_claim_login_title')"
        :content-text="$t('nft_claim_login_content')"
      >
        <template #content-append>
          <div class="flex flex-col gap-[16px]">
            <div
              v-for="item of loginContentArray"
              :key="item.title"
              class="flex gap-[24px] items-center"
            >
              <div
                class="p-[16px] flex justify-center items-center rounded-[12px] bg-like-cyan-pale text-like-green min-w-[56px]"
              >
                <component :is="item.icon" />
              </div>
              <div class="flex flex-col items-start">
                <Label :text="item.title" class="text-[18px] font-600" />
                <p class="text-[16px] font-200">{{ item.content }}</p>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div
            v-if="isLoginLoading"
            class="flex flex-col items-start justify-start w-full"
          >
            <ProgressIndicator />
            <Label
              class="text-medium-gray w-full mt-[4px]"
              preset="p6"
              :text="$t('nft_claim_login_button_loading')"
            />
          </div>
          <div
            v-else
            class="flex justify-start items-start gap-[24px] w-full mt-[12px]"
          >
            <!-- HACK: The sign-up method might result in the wallet connect dialog not being displayed -->
            <!-- HACK: so we temporarily using the sign-in method instead -->
            <ButtonV2
              :content-class="['px-[56px]']"
              :text="$t('nft_claim_login_button_sign_up')"
              @click="handleClickSignIn"
            />
            <ButtonV2
              preset="tertiary"
              :content-class="['px-[12px]']"
              :text="$t('nft_claim_login_button_sign_in')"
              @click="handleClickSignIn"
            />
          </div>
        </template>
      </NFTClaimMainSection>

      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.ID_CONFIRMATION"
        :key="state"
        :step="2"
        :total-step="3"
        :header-text="$t('nft_claim_confirmation_title')"
        :content-text="isNewAccount ? $t('nft_claim_confirmation_content') : ''"
      >
        <template #content-append>
          <div class="flex flex-col items-start gap-[8px] mt-[-32px]">
            <div
              class="flex items-center gap-[16px] px-[20px] py-[16px] rounded-[12px] bg-shade-gray"
            >
              <Identity
                :avatar-url="walletUserAvatar"
                :avatar-size="48"
                :is-lazy-loaded="true"
              />
              <div class="flex flex-col gap-[8px]">
                <Label
                  v-if="loginUserDisplayName"
                  preset="h5"
                  :text="loginUserDisplayName"
                />
                <Label preset="h6" :text="claimingAddress" />
              </div>
            </div>
            <Label
              preset="p6"
              class="text-medium-gray"
              :text="$t('nft_claim_login_title_identity_check')"
            />
          </div>
        </template>
        <template #footer>
          <ButtonV2
            :content-class="['px-[56px]']"
            :text="$t('nft_claim_confirmation_button_confirm')"
            @click="handleClickNext"
          />
        </template>
      </NFTClaimMainSection>

      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.MESSAGE"
        :key="state"
        :step="3"
        :total-step="3"
        :header-text="$t('nft_claim_message_title')"
      >
        <template #content-append>
          <div class="flex flex-col items-start gap-[2px] w-full">
            <Label
              preset="p6"
              class="text-medium-gray"
              :text="$t('nft_claim_message_input_label')"
            />
            <TextField
              v-model="collectorMessage"
              class="w-full bg-transparent border-0 focus-visible:outline-none"
              :placeholder="
                $t('nft_collect_modal_leave_message_to_name', {
                  name: creatorDisplayName,
                })
              "
              @input.once="onInputCollectorMessage"
            />
          </div>
        </template>
        <template #footer>
          <ButtonV2
            :content-class="['px-[56px]']"
            :text="$t('nft_claim_confirmation_button_confirm')"
            @click="claim"
          />
        </template>
      </NFTClaimMainSection>

      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.CLAIMING"
        :key="state"
        :step="3"
        :total-step="3"
      >
        <template #content-append>
          <div class="flex flex-col items-center justify-center w-full">
            <Label preset="h5" :text="$t('nft_claim_claiming_content')" />
            <ProgressIndicator />
          </div>
        </template>
      </NFTClaimMainSection>

      <NFTClaimMainSection
        v-else-if="state === NFT_CLAIM_STATE.CLAIMED"
        :key="state"
        :header-text="
          isAutoDeliver
            ? $t('nft_claim_claimed_title_autoDelivery')
            : $t('nft_claim_claimed_title_manualDelivery')
        "
        :content-text="
          isAutoDeliver
            ? $t('nft_claim_claimed_content_autoDelivery', {
                publisher: creatorDisplayName,
                name: NFTName,
              })
            : $t('nft_claim_claimed_content_manualDelivery')
        "
      >
        <template #stepper-append>
          <NFTClaimMessageBlock
            v-if="isAutoDeliver && creatorMessage"
            class="ml-[-62px] mt-[32px]"
            :avatar-url="creatorAvatar"
            :creator-display-name="creatorDisplayName"
            :message="creatorMessage"
          />
        </template>
        <template #header-prepend>
          <Label
            preset="h3"
            :text="$t('nft_claim_claimed_title_congratulations')"
          />
        </template>
        <template #footer>
          <ButtonV2
            v-if="shouldShowStartReadingButton"
            :content-class="['px-[48px]']"
            :text="$t('nft_claim_claimed_button_start_reading')"
            @click="handleStartReading"
          />
          <ButtonV2
            :content-class="['px-[48px]']"
            preset="tertiary"
            :text="$t('nft_claim_claimed_button_view_collection')"
            @click="handleViewCollection"
          />
        </template>
      </NFTClaimMainSection>
    </div>
    <div v-if="canViewContentDirectly" class="flex justify-end w-full">
      <div v-for="id in classIds" :key="id">
        <NFTClaimOptionList
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
} from '~/util/nft';

import alertMixin from '~/mixins/alert';
import walletMixin from '~/mixins/wallet';
import nftMixin from '~/mixins/nft';
import nftOrCollectionMixin from '~/mixins/nft-or-collection';
import walletLoginMixin from '~/mixins/wallet-login';

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
  mixins: [
    alertMixin,
    walletMixin,
    nftMixin,
    nftOrCollectionMixin,
    walletLoginMixin,
  ],
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
      // eslint-disable-next-line no-console
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
      creatorMessage: '',
      claimingAddressInput: '',
      claimingAddress: '',
      claimingFreeEmail: '',
      giftInfo: null,
      isPhysicalOnly: false,
      isAutoDeliver: false,
      NFT_CLAIM_STATE,
      isLoginLoading: false,
      isClaimLoading: false,
      isNewAccount: false,
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
      return (
        this.getUserInfoByAddress(this.iscnOwner)?.displayName ||
        this.$t('nft_claim_author')
      );
    },
    creatorAvatar() {
      return this.getUserInfoByAddress(this.iscnOwner)?.avatar;
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
    loginContentArray() {
      return [
        {
          title: this.$t('nft_claim_login_title_collection'),
          content: this.$t('nft_claim_login_content_collection'),
          icon: 'IconFolder',
        },
        {
          title: this.$t('nft_claim_login_title_identity'),
          content: this.$t('nft_claim_login_content_identity'),
          icon: 'IconIdentity',
        },
        {
          title: this.$t('nft_claim_login_title_community'),
          content: this.$t('nft_claim_login_content_community'),
          icon: 'IconCommunity',
        },
      ];
    },
    loginUserDisplayName() {
      return this.getLikerInfo?.displayName;
    },
    shouldShowStartReadingButton() {
      return (
        this.state === NFT_CLAIM_STATE.CLAIMED &&
        this.isAutoDeliver &&
        this.nftId
      );
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
      const {
        giftInfo,
        isPhysicalOnly,
        status,
        autoMemo,
        isAutoDeliver,
      } = data;
      this.giftInfo = giftInfo;
      this.isPhysicalOnly = isPhysicalOnly;
      this.isAutoDeliver = isAutoDeliver;
      this.creatorMessage = autoMemo;
      this.status = status;
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
    if (this.status === 'completed') {
      if (!this.giftInfo && !this.isPhysicalOnly) {
        this.state = NFT_CLAIM_STATE.CLAIMED;
      }
    }
  },
  methods: {
    isValidAddress,
    parseNFTMetadataURL,
    getIscnData(classId) {
      const metadata = this.getNFTClassMetadataById(classId);
      const iscnId =
        metadata?.parent?.iscnIdPrefix || metadata?.parent?.iscn_id_prefix;
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
        this.isClaimLoading = true;
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
        this.state = NFT_CLAIM_STATE.CLAIMED;

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
      } finally {
        this.isClaimLoading = false;
      }
    },
    async claim() {
      if (this.shouldBlockClaim) {
        this.state = NFT_CLAIM_STATE.ERROR;
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
        this.isClaimLoading = true;
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
      } finally {
        this.isClaimLoading = true;
      }
    },
    async claimNFTBookPurchase() {
      try {
        if (this.claimPromise) return;
        this.state = NFT_CLAIM_STATE.CLAIMING;
        this.isClaimLoading = true;
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
        this.state = NFT_CLAIM_STATE.CLAIMED;

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
      } finally {
        this.isClaimLoading = false;
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
    async handleClickSignUp() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_sign_up`,
        this.primaryKey,
        1
      );
      this.isLoginLoading = true;
      if (!this.getAddress) {
        const isConnected = await this.connectWallet({
          isOpenAuthcore: true,
        });
        if (isConnected || this.loginAddress) {
          this.state = NFT_CLAIM_STATE.ID_CONFIRMATION;
        }
        this.isLoginLoading = false;
      } else {
        await this.initIfNecessary();
      }
      this.isLoginLoading = false;
    },
    async handleClickSignIn() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_sign_in`,
        this.primaryKey,
        1
      );
      this.isLoginLoading = true;
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected || this.loginAddress) {
          this.state = NFT_CLAIM_STATE.ID_CONFIRMATION;
        }
        this.isLoginLoading = false;
      } else {
        await this.initIfNecessary();
        if (this.loginAddress) {
          this.state = NFT_CLAIM_STATE.ID_CONFIRMATION;
        }
      }
      this.isLoginLoading = false;
    },

    handleStartReading() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_start_reading`,
        this.primaryKey,
        1
      );

      if (this.nftId) {
        this.$router.push(
          this.localeLocation({
            name: 'nft-class-classId-nftId',
            params: { classId: this.classId, nftId: this.nftId },
          })
        );
      } else {
        this.$router.push(
          this.localeLocation({
            name: 'id',
            params: { id: this.claimingAddress },
            query: { tab: 'collected' },
          })
        );
      }
    },
    handleViewCollection() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_view_collection`,
        this.primaryKey,
        1
      );
      this.$router.push(
        this.localeLocation({
          name: 'id',
          params: { id: this.claimingAddress },
          query: { tab: 'collected' },
        })
      );
    },
    handleClickViewClass() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_click_physical_view_class_page',
        this.primaryKey,
        1
      );
      this.$router.push(this.viewInfoLocation);
    },
  },
};
</script>
