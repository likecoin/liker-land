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
      <NFTBookCover class="max-h-[44px] max-w-[44px]" :src="productImageUrl" />
      <div class="flex flex-col items-start">
        <p class="text-[12px] font-400 text-medium-gray">
          {{ $t('nft_claim_claim_header_title') }}
        </p>
        <p class="text-[16px] font-600 line-clamp-1">
          {{ productTitle }}
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
              :src="productImageUrl"
              class-aspect-ratio="aspect-[1]"
            />
            <Label class="text-[24px] font-600" :text="productTitle" />
            <div
              :class="[
                'flex',
                'flex-col desktopLg:flex-row',
                'justify-evenly',
                'gap-[12px]',
              ]"
            >
              <div v-if="classAuthorName" class="flex flex-col w-full">
                <Label
                  preset="h6"
                  :text="$t('nft_claim_NFT_author')"
                  class=" text-medium-gray font-[500]"
                />
                <p class="text-[16px] font-[500] w-full break-words">
                  {{ classAuthorName }}
                </p>
              </div>
              <div v-if="classPublisher" class="flex flex-col w-full">
                <Label
                  preset="h6"
                  :text="$t('identity_type_publisher')"
                  class=" text-medium-gray font-[500]"
                />
                <p class="text-[16px] font-[500] w-full break-words">
                  {{ classPublisher }}
                </p>
              </div>
              <div
                v-if="creatorDisplayName && !nftIsOwnerHidden"
                class="flex flex-col w-full"
              >
                <Label
                  preset="h6"
                  :text="
                    classPublisher
                      ? $t('identity_type_distributor')
                      : $t('identity_type_publisher')
                  "
                  class=" text-medium-gray font-[500]"
                />
                <p class="text-[16px] font-[500] w-full break-words">
                  {{ creatorDisplayName }}
                </p>
              </div>
            </div>
            <p class="w-full text-[14px] line-clamp-3 font-[400]">
              {{ productDescription }}
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
        <template v-if="cartItemsCount > 1" #content-prepend>
          <div class="flex w-full gap-[16px]">
            <NFTBookCoverWithFrame
              v-for="item in cartItems"
              :key="item.classId || item.collectionId"
              class="w-full"
              :src="getNFTImageUrl(item)"
              class-aspect-ratio="aspect-[1]"
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
        :header-text="$t('nft_claim_welcome_title', { name: productTitle })"
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
        :header-text="$t('nft_claim_welcome_title', { name: productTitle })"
        :content-text="$t('nft_claim_welcome_text')"
        :format-download-links="
          canViewContentDirectly ? formatDownloadLinks : []
        "
        :should-display-download-options="shouldDisplayDownloadOptions"
      >
        <template #header-prepend>
          <IconCircleCheck class="w-[48px]" />
        </template>
        <template v-if="cartItemsCount > 1" #content-prepend>
          <div class="flex w-full gap-[16px]">
            <NFTBookCoverWithFrame
              v-for="item in cartItems"
              :key="item.classId || item.collectionId"
              class="w-full max-w-[128px]"
              :src="getNFTImageUrl(item)"
              class-aspect-ratio="aspect-[1]"
            />
          </div>
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
            <ButtonV2
              class="phoneLg:w-full phoneLg:max-w-[480px]"
              :content-class="['px-[56px]']"
              :text="$t('nft_claim_login_button_sign_up')"
              @click="handleClickSignUp"
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
              :class="[
                'flex',
                'phone:flex-col',
                'items-start phone:items-center',
                'gap-[16px] phone:gap-[8px]',

                'w-full',
                'px-[20px]',
                'py-[16px]',

                'rounded-[12px]',
                'bg-shade-gray',
              ]"
            >
              <Identity
                class="flex-shrink-0"
                :avatar-url="walletUserAvatar"
                :avatar-size="48"
                :is-lazy-loaded="true"
              />
              <ul class="space-y-[4px] overflow-hidden phone:text-center">
                <li
                  v-if="loginUserDisplayName"
                  class="text-like-green text-[16px] font-[600] break-words"
                  v-text="loginUserDisplayName"
                />
                <li
                  v-if="claimingEmail"
                  class="text-[14px] break-all"
                  v-text="claimingEmail"
                />
                <li
                  v-if="claimingAddress"
                  :class="[
                    'px-[8px]',
                    'py-[4px]',

                    'text-dark-gray',
                    'text-[8px]',
                    'font-mono',
                    'truncate',

                    'rounded-[4px]',
                    'bg-gray-d8',
                  ]"
                  v-text="claimingAddress"
                />
              </ul>
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
            ? $tc('nft_claim_claimed_title_autoDelivery', cartItemsCount, {
                count: cartItemsCount,
              })
            : $tc('nft_claim_claimed_title_manualDelivery', cartItemsCount, {
                count: cartItemsCount,
              })
        "
        :content-text="
          cartItemsCount > 1
            ? $t('nft_claim_claimed_content_mixedDelivery')
            : isAutoDeliver
            ? $t('nft_claim_claimed_content_autoDelivery', {
                publisher: creatorDisplayName,
                name: productName,
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
        <template v-if="cartItemsCount > 1" #content-prepend>
          <div class="flex w-full gap-[16px]">
            <NFTBookCoverWithFrame
              v-for="item in cartItems"
              :key="item.classId || item.collectionId"
              class="w-full max-w-[128px]"
              :src="getNFTImageUrl(item)"
              class-aspect-ratio="aspect-[1]"
            />
          </div>
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
          <ProgressIndicator v-if="isViewCollectionLoading" />
          <div v-else class="flex items-center w-full gap-[12px]">
            <ButtonV2
              v-if="shouldShowStartReadingButton"
              class="phoneLg:w-full phoneLg:max-w-[480px]"
              :content-class="['px-[48px]']"
              :text="$t('nft_claim_claimed_button_start_reading')"
              @click="handleStartReading"
            />
            <ButtonV2
              v-if="claimingAddress"
              :content-class="['px-[48px]']"
              class="phoneLg:w-full phoneLg:max-w-[480px]"
              preset="tertiary"
              :text="$t('nft_claim_claimed_button_view_collection')"
              @click="handleViewCollection"
            />
            <ProgressIndicator v-else-if="isLoginLoading" />
            <ButtonV2
              v-else
              :content-class="['px-[48px]']"
              class="phoneLg:w-full phoneLg:max-w-[480px]"
              preset="tertiary"
              :text="$t('nft_claim_claimed_button_view_collection_sign_in')"
              @click="handleClickSignIn"
            />
          </div>
        </template>
      </NFTClaimMainSection>
    </div>

    <NFTBookCrossSellDialog
      :open="isCrossSellDialogOpen"
      :class-id="crossSellClassId"
      :collection-id="crossSellCollectionId"
      @accept="handleCrossSellAccept"
      @reject="handleCrossSellReject"
    />
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
  getStripeFiatPaymentStatus,
  getNFTBookPaymentStatusEndpoint,
  getFreeNFTBookPurchaseEndpoint,
  getNFTBookCartStatusEndpoint,
  getNFTBookCartClaimEndpoint,
} from '~/util/api';
import { isValidAddress } from '~/util/cosmos';
import {
  getNFTClassCollectionType,
  nftClassCollectionType,
  parseNFTMetadataURL,
  parseAutoMemo,
} from '~/util/nft';
import { ellipsis } from '~/util/ui';
import { NFT_BOOK_PLATFORM_LIKER_LAND } from '~/constant';
import alertMixin from '~/mixins/alert';
import crossSellMixin from '~/mixins/cross-sell';
import walletMixin from '~/mixins/wallet';
import nftOrCollectionMixin from '~/mixins/nft-or-collection';
import walletLoginMixin from '~/mixins/wallet-login';
import { sleep } from '~/util/misc';

const NFT_CLAIM_STATE = {
  WELCOME: 'WELCOME',
  LOGIN: 'LOGIN',
  ID_CONFIRMATION: 'ID_CONFIRMATION',
  MESSAGE: 'MESSAGE',
  CLAIMING: 'CLAIMING',
  CLAIMED: 'CLAIMED',
  ERROR: 'ERROR',
};

const MAX_ATTEMPT = 3;

export default {
  name: 'NFTClaimPage',
  filters: {
    ellipsis,
  },
  mixins: [
    alertMixin,
    crossSellMixin,
    walletMixin,
    nftOrCollectionMixin,
    walletLoginMixin,
  ],
  data() {
    return {
      nftId: '',
      error: '',
      isFreePurchase: !!this.$route.query.free,
      collectorMessage: '',
      creatorMessage: '',
      claimingAddressInput: '',
      quantity: 1,
      giftInfo: null,
      isPhysicalOnly: false,
      isAutoDeliver: false,
      NFT_CLAIM_STATE,
      isLoginLoading: false,
      isClaimLoading: false,
      isNewAccount: false,
      classId: this.$route.query.class_id,
      collectionId: this.$route.query.collection_id,
      cartItems: [],
      isViewCollectionLoading: false,
    };
  },
  computed: {
    ...mapGetters([
      'getGaClientId',
      'getGaSessionId',
      'getNFTClassMetadataById',
      'getISCNMetadataById',
      'getCanViewNFTBookBeforeClaimByClassId',
      'getNFTBookStoreInfoByClassId',
      'getNFTCollectionInfoByCollectionId',
      'getIsHideNFTBookDownload',
      'getNFTClassOwnerInfoById',
      'walletMethodType',
    ]),
    state: {
      get() {
        return (
          NFT_CLAIM_STATE[(this.$route.query.state || '').toUpperCase()] ||
          NFT_CLAIM_STATE.WELCOME
        );
      },
      set(value) {
        if (this.$route.query.state !== value) {
          this.$router.replace({
            query: {
              ...this.$route.query,
              state: value,
            },
          });
        }
      },
    },
    cartId() {
      return this.$route.query.cart_id;
    },
    paymentId() {
      return this.$route.query.payment_id;
    },
    priceIndex() {
      return this.$route.query.price_index;
    },
    platform() {
      return this.$route.query.from || NFT_BOOK_PLATFORM_LIKER_LAND;
    },
    token() {
      return this.$route.query.claiming_token;
    },
    isNFTBook() {
      return this.$route.query.type === 'nft_book';
    },
    cartItemsCount() {
      return this.cartItems.length || 1;
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
        this.getUserInfoByAddress(this.classOwner)?.displayName ||
        this.$t('nft_claim_author')
      );
    },
    creatorAvatar() {
      return this.getUserInfoByAddress(this.classOwner)?.avatar;
    },
    productTitle() {
      let title = this.productName;
      if (this.cartItemsCount && this.cartItemsCount > 1) {
        title = this.$tc('nft_claim_title', this.cartItemsCount - 1, {
          name: this.productName,
          count: this.cartItemsCount - 1,
        });
      }
      return title;
    },
    canViewContentDirectly() {
      return (
        !this.isFreePurchase &&
        this.classIds?.some(classId =>
          this.getCanViewNFTBookBeforeClaimByClassId(classId)
        )
      );
    },
    loginContentArray() {
      return [
        {
          title: this.$t('nft_claim_login_title_collection'),
          icon: 'IconFolder',
        },
        {
          title: this.$t('nft_claim_login_title_identity'),
          icon: 'IconIdentity',
        },
        {
          title: this.$t('nft_claim_login_title_community'),
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
        externalUrl:
          this.getIscnData(id)?.contentMetadata.url ||
          this.getNFTClassMetadataById(id)?.external_url,
        id,
        contentUrls: this.getIscnData(id)?.contentMetadata.sameAs,
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
      return this.getSessionWallet;
    },
    claimingEmail() {
      return this.walletEmail || this.walletEmailUnverified;
    },
  },
  watch: {
    claimingAddress(newValue) {
      if (this.state === NFT_CLAIM_STATE.CLAIMED) {
        // For the case where the user is already claimed and went back to the page
        this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
        return;
      }
      if (
        !newValue &&
        !(
          this.status === 'completed' ||
          this.status === 'done' ||
          this.status === 'pending' ||
          this.status === 'pendingNFT'
        )
      ) {
        this.navigateToState(NFT_CLAIM_STATE.LOGIN);
      } else if (newValue) {
        this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
      }
    },
  },
  async mounted() {
    const { redirect, from, state, ...query } = this.$route.query;
    if (
      (!this.classId && !this.collectionId && !this.cartId) ||
      !this.token ||
      !this.paymentId
    ) {
      this.$nuxt.error({
        statusCode: 400,
        message: this.$t('nft_claim_missing_qs'),
      });
      return;
    }
    let price;
    let { priceIndex } = this;
    if (this.cartId) {
      const { data } = await this.$api.get(
        getNFTBookCartStatusEndpoint({
          cartId: this.cartId,
          token: this.token,
        })
      );
      ({ price, priceIndex } = data);
      const {
        classIdsWithPrice = [],
        collectionIdsWithPrice = [],
        classIds = [],
        collectionIds = [],
        status,
        giftInfo,
      } = data;
      this.cartItems = classIdsWithPrice.concat(collectionIdsWithPrice);
      if (classIds.length) {
        [this.classId] = classIds;
      } else if (collectionIds.length) {
        [this.collectionId] = collectionIds;
      }
      this.status = status;
      this.giftInfo = giftInfo;
      if (query.type === 'nft_book') {
        await this.restoreAuthSession();
        this.clearBookProductShoppingCart();
      }
    } else if (this.paymentId) {
      if (this.isNFTBook) {
        try {
          const { data } = await this.$api.get(
            getNFTBookPaymentStatusEndpoint({
              classId: this.classId,
              collectionId: this.collectionId,
              paymentId: this.paymentId,
              token: this.token,
            })
          );
          ({ price, priceIndex } = data);
          const {
            giftInfo,
            isPhysicalOnly,
            status,
            autoMemo,
            isAutoDeliver,
            quantity,
          } = data;
          this.giftInfo = giftInfo;
          this.isPhysicalOnly = isPhysicalOnly;
          this.isAutoDeliver = isAutoDeliver;
          this.creatorMessage = parseAutoMemo(autoMemo);
          this.status = status;
          this.quantity = quantity;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      } else {
        try {
          const { data } = await this.$api.get(
            getStripeFiatPaymentStatus({
              paymentId: this.paymentId,
              token: this.token,
            })
          );
          this.status = data.status;
          price = data.fiatPrice;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    }

    const free = this.isFreePurchase || !price;

    try {
      if (this.cartItems.length) {
        await Promise.all(
          this.cartItems.map(async item => {
            if (item.classId) {
              await this.lazyGetNFTClassMetadata(item.classId);
              const classCollectionType = getNFTClassCollectionType(
                this.getNFTClassMetadataById(item.classId)
              );
              if (classCollectionType === nftClassCollectionType.NFTBook) {
                await this.lazyFetchNFTBookInfoByClassId(item.classId);
              }
            } else if (item.collectionId) {
              this.lazyFetchNFTCollectionInfoByCollectionId({
                collectionId: item.collectionId,
              });
            }
          })
        );
      } else if (this.collectionId) {
        await this.lazyFetchNFTCollectionInfoByCollectionId({
          collectionId: this.collectionId,
        });
      } else if (this.classId) {
        await this.lazyGetNFTClassMetadata(this.classId);
        const classCollectionType = getNFTClassCollectionType(
          this.getNFTClassMetadataById(this.classId)
        );
        if (classCollectionType === nftClassCollectionType.NFTBook) {
          await this.lazyFetchNFTBookInfoByClassId(this.classId);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      this.$nuxt.error({
        statusCode: 404,
        message: this.$t('nft_claim_class_not_found'),
      });
      return;
    }

    if (!free && !this.giftInfo && redirect && query.type === 'nft_book') {
      const items = this.cartItems.length
        ? this.cartItems.map(item => {
            const {
              classId,
              collectionId,
              price,
              priceIndex,
              quantity = 1,
            } = item;
            const name = classId
              ? this.getNFTClassMetadataById(classId)?.name
              : this.getNFTCollectionInfoByCollectionId(collectionId)?.name[
                  this.collectionLocale
                ];
            return {
              name,
              classId,
              collectionId,
              priceIndex,
              price,
              quantity,
            };
          })
        : [
            {
              name: this.productName,
              classId: this.classId,
              collectionId: this.collectionId,
              priceIndex,
              price,
              quantity: this.quantity,
            },
          ];

      logPurchaseFlowEvent(this, 'purchase', {
        items,
        price,
        currency: 'USD',
        isNFTBook: true,
        paymentId: this.paymentId,
      });
      items.forEach(item => {
        logPurchaseNFTBookEvent(this, {
          name: item.name,
          currency: 'USD',
          collectionId: item.collectionId,
          classId: item.classId,
          price: item.price,
          quantity: item.quantity || 1,
        });
      });
      const newQueryItems = Object.values(query);
      const currentQueryItems = Object.values(this.$route.query);
      const queryUpdated =
        newQueryItems.length !== currentQueryItems.length ||
        !newQueryItems.every(
          (value, index) => value === currentQueryItems[index]
        );
      if (queryUpdated) {
        this.$router.replace({
          ...this.$route,
          query,
        });
      }
    }

    if (
      this.status === 'completed' ||
      this.status === 'done' ||
      this.status === 'pending' ||
      this.status === 'pendingNFT'
    ) {
      this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
    } else if (
      !free &&
      this.status !== 'paid' && // nft book
      this.status !== 'pendingClaim' // wnft
    ) {
      this.alertPromptError(
        this.$t('nft_free_claim_error_message', {
          error: `Payment status is ${this.status}`,
        })
      );
      this.navigateToState(NFT_CLAIM_STATE.ERROR);
    } else if (this.state !== NFT_CLAIM_STATE.CLAIMED && this.claimingAddress) {
      this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
    }

    if (this.hasCrossSell) {
      logTrackerEvent(
        this,
        'NFT',
        this.isCrossSellEnabled
          ? 'nft_claim_cross_sell_enabled'
          : 'nft_claim_cross_sell_disabled',
        this.classId,
        1
      );
    }
  },
  methods: {
    ...mapActions([
      'restoreAuthSession',
      'clearBookProductShoppingCart',
      'fetchNFTOwners',
    ]),
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
    getNFTImageUrl({ classId, collectionId }) {
      let image = '';
      if (collectionId) {
        image = this.getNFTCollectionInfoByCollectionId(collectionId)?.image;
      } else {
        image = this.getNFTClassMetadataById(classId)?.image;
      }
      return image ? parseNFTMetadataURL(image) : '';
    },
    async startFreePurchase() {
      try {
        this.isClaimLoading = true;
        this.navigateToState(NFT_CLAIM_STATE.CLAIMING);
        if (!this.claimingEmail && !this.claimingAddress) {
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
            platform: this.platform,
          }),
          {
            email: this.claimingEmail,
            wallet: this.claimingAddress,
            loginMethod: this.walletMethodType,
            message: this.collectorMessage,
            gaClientId: this.getGaClientId,
            gaSessionId: this.getGaSessionId,
            utmCampaign: this.utmCampaign,
            utmSource: this.utmSource,
            utmMedium: this.utmMedium,
            referrer: this.documentReferrer,
            gadClickId: this.gadClickId,
            gadSource: this.gadSource,
            fbClickId: this.fbClickId,
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
          this.productId
        );
      } catch (error) {
        const errorMessage = error.response?.data || error.message;
        if (errorMessage === 'ALREADY_PURCHASED') {
          this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
          return;
        }

        // eslint-disable-next-line no-console
        console.error(error);
        this.error = errorMessage;
        logTrackerEvent(
          this,
          'NFT',
          'nft_free_nft_book_purchase_error',
          this.productId
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

      if (this.isAutoDeliver || this.cartId) {
        this.fetchCollectedNFTClassesByAddress({
          address: this.claimingAddress,
          nocache: true,
        });
        if (this.classId) {
          this.fetchNFTOwners({
            classId: this.classId,
            nocache: true,
          });
        }
        if (this.cartItems?.length) {
          this.cartItems.forEach(item => {
            if (item.classId) {
              this.fetchNFTOwners({
                classId: item.classId,
                nocache: true,
              });
            }
          });
        }
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
          this.productId
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.error = error.response?.data || error.message;
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_fiat_purchase_claim_error',
          this.productId
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
        const endpoint = this.cartId
          ? getNFTBookCartClaimEndpoint({
              cartId: this.cartId,
              token: this.token,
            })
          : getNFTBookClaimEndpoint({
              classId: this.classId,
              collectionId: this.collectionId,
              paymentId: this.paymentId,
              token: this.token,
            });
        this.claimPromise = this.$api.post(endpoint, {
          paymentId: this.paymentId,
          wallet: this.claimingAddress,
          message: this.collectorMessage,
          loginMethod: this.walletMethodType,
        });
        const { data } = await this.claimPromise;
        this.claimPromise = undefined;
        this.nftId = data.nftId;
        if (this.nftId || data.allItemsAutoClaimed) {
          this.isAutoDeliver = true;
        } else if (
          data.newClaimedNFTs &&
          !data.newClaimedNFTs.length &&
          data.errors?.length
        ) {
          throw new Error(data.errors[0].error);
        }
        this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
        logTrackerEvent(
          this,
          'NFT',
          'nft_claim_nft_book_claimed',
          this.productId
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
          this.productId
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
        this.productId
      );
    },
    handleClickNext() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_next_from_${this.state}`,
        this.productId,
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
          if (this.cartId && this.cartItemsCount > 1) {
            // skip buyer message for cart claim for now
            this.claim();
          } else {
            this.navigateToState(NFT_CLAIM_STATE.MESSAGE);
          }

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
        this.productId,
        1
      );
      try {
        this.isLoginLoading = true;
        if (!this.claimingAddress) {
          const isConnected = await this.connectWallet({
            isOpenAuthcore: true,
            isSignUp: true,
          });
          if (isConnected || this.loginAddress) {
            this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
          }
        } else {
          await this.initIfNecessary();
        }
      } finally {
        this.isLoginLoading = false;
      }

      this.isLoginLoading = false;
    },
    async handleClickSignIn() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_sign_in`,
        this.productId,
        1
      );
      if (this.claimingAddress) {
        this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
        return;
      }
      if (!this.claimingAddress) {
        this.isLoginLoading = true;
        await this.connectWallet();
        if (this.claimingAddress) {
          if (this.state === NFT_CLAIM_STATE.CLAIMED) {
            this.navigateToState(NFT_CLAIM_STATE.CLAIMED);
            return;
          }
          this.navigateToState(NFT_CLAIM_STATE.ID_CONFIRMATION);
        }
      }
      this.isLoginLoading = false;
    },

    async handleStartReading() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_start_reading`,
        this.productId,
        1
      );

      if (this.nftId) {
        await this.ensureClassIdInCollected();
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
    async ensureClassIdInCollected() {
      if (this.classId && this.isAutoDeliver) {
        this.isViewCollectionLoading = true;
        let collectedNFTs = this.getCollectedNFTClassesByAddress(
          this.claimingAddress
        );
        let ownCount =
          this.getNFTClassOwnerInfoById(this.classId)[this.claimingAddress]
            ?.length || 0;

        if (
          !collectedNFTs?.some(item => item.classId === this.classId) ||
          !ownCount
        ) {
          for (let attempts = 0; attempts < MAX_ATTEMPT; attempts += 1) {
            try {
              const fetchPromises = [
                this.fetchCollectedNFTClassesByAddress({
                  address: this.claimingAddress,
                  nocache: true,
                }),
              ];

              if (ownCount === 0) {
                fetchPromises.push(
                  this.fetchNFTOwners({ classId: this.classId, nocache: true })
                );
              }

              // eslint-disable-next-line no-await-in-loop
              await Promise.all(fetchPromises);

              collectedNFTs = this.getCollectedNFTClassesByAddress(
                this.claimingAddress
              );
              ownCount =
                this.getNFTClassOwnerInfoById(this.classId)[
                  this.claimingAddress
                ]?.length || 0;

              if (
                collectedNFTs?.some(item => item.classId === this.classId) &&
                ownCount > 0
              ) {
                break;
              }
              // eslint-disable-next-line no-await-in-loop
              await sleep(1000);
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }
        }
        this.isViewCollectionLoading = false;
      }
    },
    async handleViewCollection() {
      logTrackerEvent(
        this,
        'NFT',
        `nft_claim_click_view_collection`,
        this.productId,
        1
      );
      await this.ensureClassIdInCollected();
      this.$router.push(
        this.localeLocation({
          name: 'bookshelf',
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
        this.productId,
        1
      );
      this.$router.push(this.viewInfoLocation);
    },
    navigateToState(state) {
      this.state = state;

      if (state === NFT_CLAIM_STATE.CLAIMED) {
        // Delay 1s to avoid blocking the claimed success message
        setTimeout(() => {
          if (this.isFreePurchase && this.hasCrossSell) {
            this.setUTMProps({ utmCampaign: `cross_claim_${this.productId}` });
            this.openCrossSellDialog();
          }
        }, 1000);
      }
    },
    handleCrossSellAccept() {
      this.closeCrossSellDialog();
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_cross_sell_accept',
        this.productId,
        1
      );
    },
    handleCrossSellReject() {
      this.closeCrossSellDialog();
      logTrackerEvent(
        this,
        'NFT',
        'nft_claim_cross_sell_reject',
        this.productId,
        1
      );
    },
  },
};
</script>
