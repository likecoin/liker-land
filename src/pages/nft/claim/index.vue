<template>
  <main
    :class="[
      'relative',
      'mt-[-1px]',

      'pt-[68x]',
      'laptop:px-[32px]',
      'desktop:px-[40px]',

      'pb-[160px]',
      'laptop:pb-[24px]',
    ]"
  >
    <!--phone version cover -->
    <div
      :class="[
        'fixed',
        'inset-x-0',
        'z-1',

        'flex',
        'items-center',
        'justify-start',
        'gap-[12px]',
        'px-[24px]',
        'pb-[16px]',

        'bg-gray-f7',
        'shadow-md',

        'laptop:hidden',
      ]"
    >
      <NFTBookCover
        :container-classes="['min-h-[44px] w-[44px]']"
        :src="NFTImageUrl"
      />
      <div class="flex flex-col items-start">
        <p class="text-[12px] font-400 text-medium-gray">
          {{ $t('nft_claim_claim_header_title') }}
        </p>
        <p class="text-[16px] font-600 line-clamp-1">
          {{ NFTName }}
        </p>
      </div>
    </div>

    <div
      :class="[
        'relative',
        'flex',
        'flex-col',
        'laptop:flex-row',

        'justify-center',
        'items-start',
        'laptop:gap-[32px]',
        'w-full',
        'mb-[60px]',
      ]"
    >
      <NFTWidgetBaseCard
        class="hidden laptop:block w-full max-w-[260px] desktopLg:max-w-[426px]"
      >
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
            <NFTBookCoverWithFrame
              :src="NFTImageUrl"
              class-aspect-ratio="aspect-[1]"
            />
            <Label class="text-[24px] font-600" :text="NFTName" />
            <div class="flex items-center justify-evenly">
              <div v-if="iscnWorkAuthor" class="flex flex-col w-full">
                <Label
                  preset="h6"
                  :text="$t('nft_claim_NFT_author')"
                  class=" text-medium-gray font-[500]"
                />
                <p class="text-[16px] font-[500] w-full break-words">
                  {{ iscnWorkAuthor }}
                </p>
              </div>
              <div v-if="creatorDisplayName" class="flex flex-col w-full">
                <Label
                  preset="h6"
                  :text="$t('identity_type_publisher')"
                  class=" text-medium-gray font-[500]"
                />
                <p class="text-[16px] font-[500] w-full break-words">
                  {{ creatorDisplayName }}
                </p>
              </div>
            </div>
            <p class="w-full text-[14px] line-clamp-3 font-[400]">
              {{ NFTDescription }}
            </p>
          </div>
        </NuxtLink>
      </NFTWidgetBaseCard>
      <NFTClaimMainSection
        v-if="state === NFT_CLAIM_STATE.ERROR"
        :key="state"
        :header-text="$t('error_page_not_found_description_widget')"
        :content-text="error"
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
        :format-download-links="
          canViewContentDirectly ? formatDownloadLinks : []
        "
        :should-display-download-options="shouldDisplayDownloadOptions"
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
                class="text-[16px] laptop:text-[18px] font-600"
                :text="
                  $t('nft_claim_welcome_title_gift_toName', {
                    name: giftInfo.toName,
                  })
                "
              />
              <span class="text-[16px] laptop:text-[18px] font-200">{{
                giftInfo.message
              }}</span>
            </div>
            <Label
              class="text-[16px] laptop:text-[18px] font-600"
              :text="giftInfo.fromName"
            />
          </div>
        </template>
        <template #footer>
          <ButtonV2
            class="phoneLg:w-full"
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
        :format-download-links="
          canViewContentDirectly ? formatDownloadLinks : []
        "
      >
        <template #header-prepend>
          <IconCircleCheck class="w-[48px]" />
        </template>
        <template #footer>
          <ButtonV2
            class="px-[32px] phoneLg:w-full phoneLg:max-w-[480px]"
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
        :format-download-links="
          canViewContentDirectly ? formatDownloadLinks : []
        "
        :should-display-download-options="shouldDisplayDownloadOptions"
      >
        <template #header-prepend>
          <IconCircleCheck class="w-[48px]" />
        </template>
        <template #header-append>
          <Label
            class="text-like-green text-[18px] font-600 desktop:text-[24px]"
            :text="$t('nft_claim_NFT_name', { name: NFTName })"
          />
        </template>
        <template #footer>
          <ButtonV2
            class="phoneLg:w-full max-w-[480px]"
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
              <div class="flex flex-col items-start font-200">
                <Label :text="item.title" class="text-[16px] font-600" />
                <p class="text-[14px] laptop:text-[16px]">{{ item.content }}</p>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div
            v-if="isLoginLoading"
            class="flex flex-col items-center justify-start w-full"
          >
            <ProgressIndicator />
            <Label
              class="text-medium-gray w-full mt-[4px] text-center"
              preset="p6"
              align="center"
              :text="$t('nft_claim_login_button_loading')"
            />
          </div>
          <div
            v-else
            :class="[
              'flex',
              'flex-col',
              'laptop:flex-row',

              'justify-start',
              'items-center',
              'laptop:items-start',
              'gap-[24px]',

              'w-full',
              'mt-[12px]',
            ]"
          >
            <!-- HACK: The sign-up method might result in the wallet connect dialog not being displayed -->
            <!-- HACK: so we temporarily using the sign-in method instead -->
            <ButtonV2
              class="phoneLg:w-full phoneLg:max-w-[480px]"
              :content-class="['px-[56px]']"
              :text="$t('nft_claim_login_button_sign_up')"
              @click="handleClickSignIn"
            />
            <ButtonV2
              class="phoneLg:w-full phoneLg:max-w-[480px]"
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
          <div
            :class="[
              'flex',
              'flex-col',
              'items-start',
              'gap-[8px]',
              'mt-0',
              'laptop:mt-[-32px]',
              'w-full',
              'phoneLg:w-full',
            ]"
          >
            <div
              class="flex items-center w-full overflow-clip gap-[16px] px-[20px] py-[16px] rounded-[12px] bg-shade-gray"
            >
              <Identity
                class="flex-shrink-0 "
                :avatar-url="walletUserAvatar"
                :avatar-size="48"
                :is-lazy-loaded="true"
              />
              <div
                class="flex flex-col w-[80%] justify-center gap-[8px] whitespace-normal"
              >
                <Label
                  v-if="loginUserDisplayName"
                  class="break-words"
                  preset="h5"
                  :text="loginUserDisplayName"
                />
                <p
                  v-if="claimingAddress"
                  class="break-words text-[16px] text-medium-gray w-full"
                >
                  {{ claimingAddress }}
                </p>
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
            class="phoneLg:w-full phoneLg:max-w-[480px]"
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
          <div
            class="flex flex-col items-start gap-[4px] w-full laptop:mt-[-32px]"
          >
            <Label
              preset="p6"
              class="text-dark-gray"
              :text="$t('nft_claim_message_input_label')"
            />
            <TextField
              v-model="collectorMessage"
              class="w-full bg-transparent border-0 focus-visible:outline-none"
              :placeholder="$t('nft_claim_message_placeholder')"
              @input.once="onInputCollectorMessage"
            />
          </div>
        </template>
        <template #footer>
          <ButtonV2
            class="phoneLg:w-full phoneLg:max-w-[480px]"
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
          <div
            class="flex flex-col gap-[4px] items-center justify-center w-full"
          >
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
            class="hidden laptop:block ml-[-80px] mt-[32px]"
            :avatar-url="creatorAvatar"
            :creator-display-name="creatorDisplayName"
            :message="creatorMessage"
          />
        </template>
        <template #header-prepend>
          <Label
            class="text-[18px] laptop:text-[24px] font-600"
            :text="$t('nft_claim_claimed_title_congratulations')"
          />
        </template>
        <template #content-append>
          <NFTClaimMessageBlock
            v-if="isAutoDeliver && creatorMessage"
            class="laptop:hidden"
            :avatar-url="creatorAvatar"
            :creator-display-name="creatorDisplayName"
            :message="creatorMessage"
          />
        </template>
        <template #footer>
          <ButtonV2
            v-if="shouldShowStartReadingButton"
            class="phoneLg:w-full phoneLg:max-w-[480px]"
            :content-class="['px-[48px]']"
            :text="$t('nft_claim_claimed_button_start_reading')"
            @click="handleStartReading"
          />
          <ButtonV2
            :content-class="['px-[48px]']"
            class="phoneLg:w-full phoneLg:max-w-[480px]"
            preset="tertiary"
            :text="$t('nft_claim_claimed_button_view_collection')"
            @click="handleViewCollection"
          />
        </template>
      </NFTClaimMainSection>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

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
import { ellipsis } from '~/util/ui';

import alertMixin from '~/mixins/alert';
import walletMixin from '~/mixins/wallet';
import nftMixin from '~/mixins/nft';
import nftOrCollectionMixin from '~/mixins/nft-or-collection';
import walletLoginMixin from '~/mixins/wallet-login';
import collectionMixin from '~/mixins/nft-collection';

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
  filters: {
    ellipsis,
  },
  mixins: [
    alertMixin,
    walletMixin,
    nftMixin,
    collectionMixin,
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
      collectorMessage: '',
      creatorMessage: '',
      claimingAddressInput: '',
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
      'getNFTBookStoreInfoByClassId',
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
    priceIndex() {
      return this.$route.query.price_index;
    },
    token() {
      return this.$route.query.claiming_token;
    },
    isNFTBook() {
      return this.$route.query.type === 'nft_book';
    },
    shouldBlockClaim() {
      return (
        !this.claimingAddress ||
        [NFT_CLAIM_STATE.CLAIMING, NFT_CLAIM_STATE.CLAIMED].includes(this.state)
      );
    },
    creatorDisplayName() {
      if (this.collectionId) {
        return (
          this.getUserInfoByAddress(this.collectionOwner)?.displayName ||
          ellipsis(this.collectionOwner)
        );
      }
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
    formatDownloadLinks() {
      return this.classIds?.map(id => ({
        canViewNFTBookBeforeClaim: this.getCanViewNFTBookBeforeClaimByClassId(
          id
        ),
        url:
          this.getIscnData(id)?.contentMetadata.url ||
          this.getNFTClassMetadataById(id)?.external_url,
        id,
        contentUrls: this.getIscnData(id)?.contentMetadata.sameAs,
        iscnUrl: this.getIscnData(id)?.contentMetadata.url,
        isNftBook: this.checkNftIsNFTBook(id),
        isContentViewable: true,
        isDownloadable: !this.getIsHideNFTBookDownload(id),
      }));
    },
    shouldDisplayDownloadOptions() {
      return (
        this.state === NFT_CLAIM_STATE.WELCOME &&
        this.canViewContentDirectly &&
        !this.isPhysicalOnly
      );
    },
    claimingAddress() {
      return this.getAddress || this.loginAddress;
    },
  },
  watch: {
    walletEmail(newValue) {
      this.claimingFreeEmail = newValue;
    },
    claimingAddress(newValue) {
      if (!newValue && !(this.status === 'completed')) {
        this.navigateToState(NFT_CLAIM_STATE.LOGIN);
      } else if (newValue) {
        this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
      }
    },
  },
  async mounted() {
    const { redirect, free, from, state, ...query } = this.$route.query;
    let price;
    if (this.paymentId) {
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
        if (this.collectionId) {
          await this.lazyFetchNFTCollectionInfo();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    } else {
      const { prices } = this.getNFTBookStoreInfoByClassId(this.classId);
      const data = prices[this.priceIndex];
      const { isPhysicalOnly, autoMemo, isAutoDeliver } = data;
      this.isPhysicalOnly = isPhysicalOnly;
      this.isAutoDeliver = isAutoDeliver;
      this.creatorMessage = autoMemo;
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

    if (this.status === 'completed') {
      this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
    }

    if (state === NFT_CLAIM_STATE.LOGIN && this.claimingAddress) {
      this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
    }
  },
  methods: {
    ...mapActions(['fetchCollectedNFTClassesByAddress']),
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
    async startFreePurchase() {
      try {
        this.isClaimLoading = true;
        this.navigateToState(NFT_CLAIM_STATE.CLAIMING);
        if (!this.claimingFreeEmail && !this.claimingAddress) {
          this.alertPromptError(
            this.$t('nft_free_claim_enter_email_or_address')
          );
          this.navigateToState(NFT_CLAIM_STATE.WELCOME);
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
        this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
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
        this.navigateToState(NFT_CLAIM_STATE.ERROR);
      } finally {
        this.isClaimLoading = false;
      }
    },
    async claim() {
      if (this.shouldBlockClaim) {
        this.navigateToState(NFT_CLAIM_STATE.ERROR);
        return;
      }
      logTrackerEvent(this, 'NFT', 'nft_claim_claim_button_clicked', '', 1);

      if (this.isFreePurchase) {
        await this.startFreePurchase();
      } else if (this.isNFTBook) {
        await this.claimNFTBookPurchase();
      } else {
        await this.claimFiatPurchase();
      }

      if (this.isAutoDeliver) {
        await this.fetchCollectedNFTClassesByAddress(this.claimingAddress);
      }
    },
    async claimFiatPurchase() {
      try {
        if (this.claimPromise) return;
        this.navigateToState(NFT_CLAIM_STATE.CLAIMING);
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
        this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
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
        this.navigateToState(NFT_CLAIM_STATE.ERROR);
      } finally {
        this.isClaimLoading = true;
      }
    },
    async claimNFTBookPurchase() {
      try {
        if (this.claimPromise) return;
        this.navigateToState(NFT_CLAIM_STATE.CLAIMING);
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
        this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_nft_book_claimed',
          this.primaryKey
        );
      } catch (error) {
        const errorMessage = error.response?.data || error.message;
        if (errorMessage === 'PAYMENT_ALREADY_CLAIMED') {
          this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
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
        this.navigateToState(NFT_CLAIM_STATE.ERROR);
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
            this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
            break;
          }
          this.navigateToState(NFT_CLAIM_STATE.LOGIN);
          break;

        case NFT_CLAIM_STATE.LOGIN:
          this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);

          break;

        case NFT_CLAIM_STATE.ID_CONFIRMATION:
          this.navigateToState(NFT_CLAIM_STATE.MESSAGE);

          break;

        case NFT_CLAIM_STATE.MESSAGE:
          this.navigateToState(NFT_CLAIM_STATE.CLAIMING);

          break;

        case NFT_CLAIM_STATE.CLAIMING:
          this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
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
      if (!this.claimingAddress) {
        const isConnected = await this.connectWallet({
          isOpenAuthcore: true,
        });
        if (isConnected || this.loginAddress) {
          this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
        }
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
      if (this.claimingAddress) {
        this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
        return;
      }
      this.isLoginLoading = true;
      if (!this.claimingAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected || this.loginAddress) {
          this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
        }
      } else {
        await this.initIfNecessary();
        if (this.loginAddress) {
          this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
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
    navigateToState(state) {
      this.state = state;
      this.$router.push({ query: { ...this.$route.query, state } });
    },
  },
};
</script>
