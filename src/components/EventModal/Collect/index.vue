<template>
  <TxModal
    :is-open="isOpen"
    :has-close-button="isShowCloseButton"
    :header-text="headerText"
    preset="collect"
    :processing-title="$t('collect_modal_processing_title')"
    :complete-title="$t('collect_modal_complete_title')"
    @close="handleClose"
  >
    <template #header-prepend>
      <IconPrice />
    </template>

    <template #top>
      <NFTPageOwning
        v-if="
          (!uiTxNFTStatus ||
            ['insufficient', 'failed'].includes(uiTxNFTStatus)) &&
            hasConnectedWallet
        "
        class="mb-[10px] phone:mt-0"
        :collected-count="userCollectedCount"
      />
    </template>

    <template #message>
      <transition name="fade">
        <client-only v-if="isCompleted || isProcessing">
          <model-viewer
            v-if="nftModelURL"
            :alt="nftClassCollectionName"
            :src="nftModelURL"
            class="mt-[12px] w-full h-[300px] max-h-[30vh]"
            auto-rotate
            auto-rotate-delay="0"
            :poster="modelLoadingImage"
            :exposure="modelExposure"
            :rotation-per-second="isCompleted ? '10deg' : '90deg'"
            :shadow-intensity="isCompleted ? 1 : 0"
            :camera-controls="isCompleted ? true : undefined"
            camera-orbit="90deg 60deg 100m"
            @click.once="onClickModelViewer"
          />
        </client-only>
      </transition>
      <Label v-if="isAddedToShoppingCart" preset="p5" align="center">{{
        $t('nft_collect_modal_added_to_shopping_cart_description', {
          nft: nftName,
        })
      }}</Label>
      <template v-else-if="isCompleted">
        <Label
          :class="['text-medium-gray', 'mt-[12px]', 'flex-nowrap']"
          preset="h6"
          align="center"
        >
          <i18n :path="completedMessageI18nPath">
            <NuxtLink
              class="font-[600] underline"
              place="portfolio"
              :to="
                localeLocation({
                  name: 'id',
                  params: { id: getAddress },
                })
              "
              >{{
                $t('tx_modal_status_complete_text_collect_portfolio')
              }}</NuxtLink
            >
          </i18n>
        </Label>
        <div
          v-if="!isFollowPromptStateDefault && !isBatchCollect"
          :class="[
            'flex justify-center items-center mt-[16px] rounded-[48px] border-[1px] border-medium-gray',
            'flex-row px-[12px]',
          ]"
        >
          <NFTMessageIdentity
            type="creator"
            class="flex-shrink-0 !px-0"
            :wallet-address="classOwner"
            :avatar-size="40"
          />
          <div class="ml-[24px]">
            <ProgressIndicator v-if="isFollowPromptUpdating" preset="thin" />
            <div
              v-else
              class="relative flex group w-[138px]"
              @click="handleClickFollow"
            >
              <div
                :class="[
                  ...getDefaultClass,
                  isFollowPromptStateAuto
                    ? '!bg-like-cyan-light text-like-green'
                    : '!bg-shade-gray text-dark-gray',
                ]"
              >
                <Label align="center" :text="followPromptButtonText">
                  <template v-if="isFollowPromptStateAuto" #prepend>
                    <IconCheck />
                  </template>
                </Label>
              </div>
              <div
                :class="[
                  ...getDefaultClass,
                  'group-hover:opacity-[100]',
                  'group-active:!bg-medium-gray',
                  'opacity-0',
                  'transition-all',
                  'absolute',
                  'inset-0',
                  isFollowPromptStateAuto
                    ? '!bg-shade-gray text-dark-gray'
                    : '!bg-like-cyan-light text-like-green',
                ]"
              >
                <Label align="center" :text="followPromptButtonHoverText" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <template v-if="isCompleted && !hasConnectedWallet && paymentId">
      <Label
        class="text-like-green mt-[24px]"
        preset="h5"
        align="center"
        :text="$t('tx_modal_status_complete_reference_code')"
      />
      <Label
        class="text-like-green mt-[8px] p-[12px] border-[2px] border-shade-gray rounded-[8px]"
        preset="p5"
        align="center"
        :text="paymentId"
      />
    </template>

    <!-- Button for complete of collecting -->
    <template v-if="isCompleted && hasConnectedWallet" #button>
      <ButtonV2
        v-if="isBatchCollect"
        preset="outline"
        :text="$t('nft_details_page_button_view_portfolio')"
        :to="
          localeLocation({
            name: 'id',
            params: { id: getAddress },
            query: { tab: 'collected' },
          })
        "
        @click.native="handleClose"
      >
        <template #prepend>
          <IconEye class="w-[20px]" />
        </template>
      </ButtonV2>
      <ButtonV2
        v-else
        preset="outline"
        :text="$t('nft_details_page_button_view_details')"
        @click="goToNFTDetails"
      >
        <template #prepend>
          <IconEye class="w-[20px]" />
        </template>
      </ButtonV2>

      <ButtonV2
        v-if="canShare"
        preset="outline"
        class="ml-[12px]"
        :text="$t('nft_details_page_button_share')"
        @click="shareNFTResult"
      >
        <template #prepend>
          <IconShare class="w-[20px]" />
        </template>
      </ButtonV2>
    </template>

    <template v-else-if="isAddedToShoppingCart" #button>
      <ButtonV2
        preset="secondary"
        :text="$t('nft_collect_modal_go_to_shopping_cart_button')"
        :to="localeLocation({ name: 'shopping-cart-wnft' })"
        @click.native="handleClose"
      >
        <template #prepend>
          <LocalMallIcon class="w-[20px]" />
        </template>
      </ButtonV2>
    </template>

    <template v-if="!isAddedToShoppingCart && !uiTxNFTStatus">
      <section
        v-if="paymentMethod === undefined"
        class="flex flex-col items-start mb-[28px]"
      >
        <Separator class="h-[2px] bg-shade-gray self-center phone:hidden" />
        <Label
          preset="p6"
          align="left"
          class="text-medium-gray mt-[12px] mb-[6px]"
          :text="$t('nft_collect_modal_leave_message')"
        />
        <div
          class="flex w-full py-[10px] px-[16px] gap-[12px] bg-shade-gray rounded-[12px]"
        >
          <IconMessage class="text-dark-gray" />
          <input
            id="name"
            ref="input"
            type="input"
            class="w-full bg-transparent border-0 text-dark-gray focus-visible:outline-none"
            :placeholder="
              $t('nft_collect_modal_leave_message_to_name', {
                name: creatorDisplayName,
              })
            "
            name="name"
            @input="onInputCollectMessage"
          />
        </div>
      </section>

      <section v-if="paymentMethod === undefined">
        <Label
          v-if="!nftIsFree && enableStripe"
          class="text-like-green"
          preset="h5"
          align="center"
          :text="$t('nft_collect_modal_subtitle_select_collect_method')"
        />
        <ul
          v-if="nftIsFree"
          class="mt-[16px] flex flex-col gap-[16px] mx-auto max-w-[320px] w-full"
        >
          <li>
            <EventModalCollectMethodButton
              :class="{ 'border-like-cyan': !mintedFreeNFT }"
              :title="$t('nft_collect_modal_method_free')"
              type="free"
              :is-disabled="mintedFreeNFT"
              :price="$t('nft_collect_modal_free')"
              @click="handleSelectPaymentMethod"
            />
          </li>
        </ul>
        <ul
          v-else
          :class="[
            'mt-[16px] flex flex-col gap-[16px] mx-auto max-w-[320px] w-full',
          ]"
        >
          <li v-if="enableStripe">
            <EventModalCollectMethodButton
              :class="{
                'border-like-cyan': canPayByFiat && !hasConnectedWallet,
              }"
              :title="$t('nft_collect_modal_method_stripe')"
              type="stripe"
              :is-disabled="!canPayByFiat"
              :price="formattedNFTPriceInUSD"
              @click="handleSelectPaymentMethod"
            />
          </li>
          <li>
            <EventModalCollectMethodButton
              class="rounded-b-[0]"
              :title="$t('nft_collect_modal_method_like')"
              type="crypto"
              :is-disabled="isDisabledPayByLIKE"
              :discount-info="discountInfo"
              :price="formattedNFTPriceInLIKE"
              @click="handleSelectPaymentMethod"
            />
            <div
              :class="[
                'flex',
                'justify-end',
                'items-center',
                isInsufficientLIKE || !canPayByLIKE
                  ? 'bg-light-gray border-shade-gray'
                  : 'bg-like-cyan-pale border-medium-gray',
                'border-2',
                'border-t-0',
                'rounded-b-[8px]',
                'px-[16px]',
                'py-[4px]',
                hasConnectedWallet && isInsufficientLIKE
                  ? 'text-danger'
                  : 'text-like-green',
                'text-[12px]',
                'text-right',
                'font-[600]',
              ]"
            >
              <i18n
                v-if="hasConnectedWallet"
                path="nft_collect_modal_method_like_available_amount"
              >
                <span
                  v-if="!walletLIKEBalanceFetchPromise"
                  class="font-[400]"
                  place="amount"
                >
                  {{ walletLIKEBalance | formatNumberWithLIKE }}
                </span>
              </i18n>
              <ProgressIndicator
                v-if="walletLIKEBalanceFetchPromise"
                class="ml-[8px] w-[48px] h-[16px]"
              />
              <a
                v-else-if="!hasConnectedWallet || isInsufficientLIKE"
                class="ml-[16px] underline font-[400]"
                :href="purchaseLIKELink"
                target="_blank"
                rel="noopener"
              >
                {{ $t('nft_collect_modal_method_like_purchase_like') }}
              </a>
            </div>
          </li>
          <!--
          <li v-if="isShowAddToShoppingCartButton">
            <Separator class="mx-auto" />
            <EventModalCollectMethodButton
              :title="(
                hasAddedToShoppingCart
                  ? $t('nft_collect_modal_added_to_cart')
                  : $tc('nft_collect_modal_add_to_cart', shoppingCartQuantity, { count: shoppingCartQuantity })
              )"
              type="crypto"
              :price="formattedNFTPriceInLIKE"
              :is-disabled="hasAddedToShoppingCart"
              @click="handleAddToCart"
            >
              <template #prepend>
                <LocalMallIcon :class="['w-[24px]', { 'text-like-green': !hasAddedToShoppingCart }]" />
              </template>
            </EventModalCollectMethodButton>
          </li>
          -->
        </ul>
      </section>
      <section v-else>
        <ProgressIndicator class="mx-auto" />
      </section>
    </template>
  </TxModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import modelLoadingImage from '~/assets/images/nft/model-loading.png';
import LocalMallIcon from '~/assets/icons/local-mall.svg?inline';

import { checkIsLikeCoinAppInAppBrowser } from '~/util/client';
import { logTrackerEvent } from '~/util/EventLogger';
import { formatNumberWithLIKE, oscillate } from '~/util/ui';

import clipboardMixin from '~/mixins/clipboard';
import nftMixin from '~/mixins/nft';
import { EXTERNAL_HOST, W3C_EMAIL_REGEX } from '~/constant';

const FOLLOW_PROMPT_STATE = {
  DEFAULT: 'default', // No need to show any follow UI.
  UNFOLLOW: 'unfollow', // Show a switch button to toggle follow status.
  AUTO: 'auto', // Show auto-followed UI.
};

export default {
  filters: {
    formatNumberWithLIKE,
  },
  components: {
    LocalMallIcon,
  },
  mixins: [clipboardMixin, nftMixin],
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modelLoadingImage,
      paymentMethod: undefined,
      justCollectedNFTId: undefined,
      shouldShowMessageInput: false,
      memo: '',
      email: this.$store.getters.walletEmail || '',
      followPromptState: FOLLOW_PROMPT_STATE.DEFAULT,
      isFollowPromptUpdating: false,
      modelExposure: 0,
      animationTimer: null,
      isAddedToShoppingCart: false,
      canShare: false,
    };
  },
  head() {
    const linkList = [
      {
        rel: 'prefetch',
        href:
          'https://unpkg.com/@google/model-viewer@3.1.1/dist/model-viewer.min.js',
      },
    ];
    if (this.nftModelURL) {
      linkList.push({
        rel: 'prefetch',
        crossorigin: 'anonymous',
        href: this.nftModelURL,
      });
    }
    const script = [];
    if (this.nftModelURL && this.isOpen) {
      script.push({
        type: 'module',
        src:
          'https://unpkg.com/@google/model-viewer@3.1.1/dist/model-viewer.min.js',
        async: 'true',
      });
    }
    return {
      link: linkList,
      script,
    };
  },
  computed: {
    ...mapGetters([
      'getAddress',
      'getShoppingCartNFTClassQuantity',
      'walletFollowees',
      'walletIsLoggingIn',
      'walletInteractedCreators',
    ]),
    enableStripe() {
      return !checkIsLikeCoinAppInAppBrowser(this.$route);
    },
    developerMode() {
      return !!this.$route.query.debug;
    },
    isBatchCollect() {
      return Array.isArray(this.uiTxTargetClassId);
    },
    classId() {
      // Alias for NFT mixin
      return this.isBatchCollect
        ? this.uiTxTargetClassId[0]
        : this.uiTxTargetClassId;
    },
    headerText() {
      return this.paymentMethod === undefined ||
        this.uiTxNFTStatus === 'completed'
        ? this.$t('nft_collect_modal_title_collect')
        : this.$t('nft_collect_modal_title_collecting');
    },
    isShowCloseButton() {
      return (
        (this.paymentMethod === undefined &&
          this.getRouteBaseName(this.$route) !== 'shopping-cart-wnft') ||
        this.uiTxNFTStatus === 'completed' ||
        this.uiTxNFTStatus === 'processing_non_blocking'
      );
    },
    isValidEmail() {
      return W3C_EMAIL_REGEX.test(this.email);
    },
    isProcessing() {
      return (
        this.uiTxNFTStatus === 'processing' ||
        this.uiTxNFTStatus === 'processing_non_blocking'
      );
    },
    isCompleted() {
      return (
        this.uiTxNFTStatus === 'completed' || this.nftTxErrorIsAlreadyCollected
      );
    },
    completedMessageI18nPath() {
      if (this.nftTxErrorIsAlreadyCollected) {
        return this.$t('nft_collect_modal_already_minted');
      }
      return this.hasConnectedWallet
        ? 'tx_modal_status_complete_text_collect'
        : 'tx_modal_status_complete_text_collect_without_wallet';
    },
    isInsufficientLIKE() {
      return this.walletLIKEBalance < this.nftPriceInLIKE;
    },
    canPayByFiat() {
      return this.NFTPrice !== undefined && this.NFTPrice > 0;
    },
    canPayByLIKE() {
      if (this.developerMode) return true;
      const notSupportedPlatforms = [];
      return (
        this.nftPriceInLIKE > 0 &&
        !notSupportedPlatforms.includes(this.walletMethodType)
      );
    },
    mintedFreeNFT() {
      return this.purchaseInfo?.canFreeCollect === false;
    },
    isDisabledPayByLIKE() {
      return (
        this.hasConnectedWallet &&
        (this.isInsufficientLIKE || !this.canPayByLIKE)
      );
    },
    paymentId() {
      return this.$route.query.payment_id;
    },
    creatorDisplayName() {
      return (
        this.getUserInfoByAddress(this.classOwner)?.displayName || 'creator'
      );
    },
    followPromptButtonText() {
      if (this.isFollowPromptUpdating) {
        return this.$t('nft_details_page_label_loading');
      }
      if (this.isFollowPromptStateAuto) {
        return this.$t('settings_following');
      }
      return this.$t('settings_follow_follow');
    },
    followPromptButtonHoverText() {
      if (this.isFollowPromptStateAuto) {
        return this.$t('settings_follow_unfollow');
      }
      return this.$t('settings_follow_follow');
    },
    isFollowPromptStateDefault() {
      return this.followPromptState === FOLLOW_PROMPT_STATE.DEFAULT;
    },
    isFollowPromptStateAuto() {
      return this.followPromptState === FOLLOW_PROMPT_STATE.AUTO;
    },
    getDefaultClass() {
      return [
        'flex',
        'gap-[16px]',
        'box-border',
        'overflow-hidden',
        'justify-center',
        'items-center',
        'transition',
        'duration-200',
        'h-40px',
        'w-full',
        'font-600',
        'px-[16px]',
        'py-[8px]',
        'rounded-[20px]',
        'cursor-pointer',
      ];
    },
    purchaseLIKELink() {
      return 'https://faucet.like.co/purchase';
    },
    isShowAddToShoppingCartButton() {
      return this.canPayByLIKE;
    },
    shoppingCartQuantity() {
      return this.getShoppingCartNFTClassQuantity(this.classId);
    },
    hasAddedToShoppingCart() {
      return this.shoppingCartQuantity > 0;
    },
    discountInfo() {
      if (!this.nftPrediscountedLIKE) {
        return undefined;
      }
      const originalPrice = this.nftPrediscountedLIKE;
      const discountedPrice = this.nftPriceInLIKE;
      if (originalPrice <= discountedPrice) {
        return undefined;
      }

      const discountAmount = originalPrice - discountedPrice;
      const discountPercentage = Math.ceil(
        (discountAmount / originalPrice) * 100
      );

      return {
        originalPriceInLIKE: this.formattedNFTPrediscountedLIKE,
        discountPercentage: `-${discountPercentage}`,
      };
    },
  },
  watch: {
    isOpen(isOpen) {
      if (isOpen && this.classId) {
        // Reset state when open modal
        this.resetState();
      }
    },
    classId(nftClassId) {
      if (nftClassId) {
        // Reset state when NFT Class change
        this.resetState();
      }
    },
    getAddress() {
      if (this.hasConnectedWallet) {
        // Fetch user collected count when wallet change
        this.userCollectedCount = undefined;
        this.fetchUserCollectedCount();
      }
    },
    uiTxNFTStatus() {
      if (this.isProcessing) {
        this.modelExposure = 0;
        this.startExposureAnimation();
        if (this.walletHasLoggedIn) {
          const creator = this.getNFTClassMetadataById(this.classId)
            ?.iscn_owner;
          if (
            this.walletFollowees?.includes(creator) ||
            creator === this.getAddress
          ) {
            this.followPromptState = FOLLOW_PROMPT_STATE.DEFAULT;
          } else if (this.walletInteractedCreators?.includes(creator)) {
            this.followPromptState = FOLLOW_PROMPT_STATE.UNFOLLOW;
          } else {
            this.followPromptState = FOLLOW_PROMPT_STATE.AUTO;
            this.walletFollowCreator(creator);
          }
        }
      }
    },
  },
  mounted() {
    if (this.classId) {
      this.resetState();
    }
    this.canShare = !!navigator.share;
  },
  beforeDestroy() {
    this.stopExposureAnimation();
  },
  methods: {
    ...mapActions([
      'uiCloseTxModal',
      'walletFollowCreator',
      'walletAddInteractedCreator',
      'walletUnfollowCreator',
      'addNFTClassToShoppingCart',
    ]),
    startExposureAnimation(time = performance.now(), lastTime = time) {
      if (this.isProcessing) {
        this.modelExposure = oscillate(0.1, 0.2, 4000, time);
      } else if (this.isCompleted) {
        if (this.modelExposure <= 1) {
          this.modelExposure += (time - lastTime) / 1000;
          this.modelExposure = Math.min(this.modelExposure, 1);
        } else {
          return;
        }
      } else {
        return;
      }
      this.animationTimer = requestAnimationFrame(now => {
        this.startExposureAnimation(now, time);
      });
    },
    stopExposureAnimation() {
      cancelAnimationFrame(this.animationTimer);
    },
    resetState() {
      this.paymentMethod = undefined;
      this.justCollectedNFTId = undefined;
      this.memo = '';
      this.isAddedToShoppingCart = false;

      // Mixin
      this.userCollectedCount = undefined;
      this.fetchNFTPrices();
      this.fetchUserCollectedCount();
    },
    async handleSelectPaymentMethod(method) {
      const { classId } = this;
      this.paymentMethod = method;
      if (this.memo) {
        logTrackerEvent(this, 'NFT', 'NFTCollectorMessage', classId, 1);
      }
      try {
        switch (method) {
          case 'crypto': {
            if (!this.getSessionWallet) {
              const isConnected = await this.connectWallet();
              if (!isConnected) return;
            }
            logTrackerEvent(
              this,
              'NFT',
              'NFTCollectPaymentMethod(LIKE)',
              classId,
              1
            );
            const result = await this.collectNFTWithLIKE(classId, {
              memo: this.memo,
              email: this.email,
            });
            const nftId = result?.nftId || result?.purchased?.[0]?.nftId;
            if (nftId) {
              this.justCollectedNFTId = nftId;
            }
            break;
          }
          case 'stripe':
            logTrackerEvent(
              this,
              'NFT',
              'NFTCollectPaymentMethod(Stripe)',
              classId,
              1
            );
            await this.collectNFTWithStripe(classId, { memo: this.memo });
            break;
          case 'free': {
            if (!this.getSessionWallet) {
              const isConnected = await this.connectWallet();
              if (!isConnected) return;
            }
            logTrackerEvent(
              this,
              'NFT',
              'NFTCollectPaymentMethod(Free)',
              classId,
              1
            );
            const result = await this.collectFreeNFT(classId, {
              memo: this.memo,
            });
            if (result) {
              this.justCollectedNFTId =
                result.nftId || result.purchased?.[0]?.nftId;
            }
            break;
          }
          default:
            break;
        }
      } finally {
        if (classId === this.uiTxTargetClassId) {
          this.paymentMethod = undefined;
        }
      }
    },
    handleAddToCart() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collect_modal_click_add_to_cart',
        this.classId,
        1
      );
      this.addNFTClassToShoppingCart({ classId: this.classId });
      this.isAddedToShoppingCart = true;
    },
    goToNFTDetails() {
      this.$router.push(
        this.localeLocation({
          name: this.justCollectedNFTId
            ? 'nft-class-classId-nftId'
            : 'nft-class-classId',
          params: { classId: this.classId, nftId: this.justCollectedNFTId },
        })
      );
      this.uiCloseTxModal();
    },
    onClickModelViewer() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collect_modal_click_model_viewer',
        this.classId,
        1
      );
    },
    handleClose() {
      this.$emit('close');
      this.shouldShowMessageInput = false;
    },
    handleShowInput() {
      this.shouldShowMessageInput = true;
    },
    onInputCollectMessage(e) {
      this.memo = e.target.value;
    },
    shareNFTResult() {
      logTrackerEvent(this, 'NFT', 'NFTClickShare', this.classId, 1);
      if (navigator?.share) {
        const title = this.$t('nft_collect_modal_share_title', {
          name: this.nftName,
        });
        const text = this.$t('nft_collect_modal_share_text', {
          name: this.nftName,
          creator: this.creatorDisplayName,
        });
        const url = this.justCollectedNFTId
          ? `${EXTERNAL_HOST}/nft/class/${this.classId}/${
              this.justCollectedNFTId
            }`
          : `${EXTERNAL_HOST}/nft/class/${this.classId}`;
        logTrackerEvent(this, 'NFT', 'share', this.classId, 1, {
          item_id: this.classId,
          content_type: 'collect_nft',
        });
        navigator.share({
          title,
          text,
          url,
        });
      }
    },
    async handleClickFollow() {
      try {
        this.isFollowPromptUpdating = true;
        switch (this.followPromptState) {
          case FOLLOW_PROMPT_STATE.AUTO:
            this.followPromptState = FOLLOW_PROMPT_STATE.UNFOLLOW;
            await [this.walletUnfollowCreator(this.classOwner)];
            logTrackerEvent(
              this,
              'NFT',
              'NFTAutoFollow',
              FOLLOW_PROMPT_STATE.UNFOLLOW,
              1
            );
            break;
          case FOLLOW_PROMPT_STATE.UNFOLLOW:
          default:
            this.followPromptState = FOLLOW_PROMPT_STATE.AUTO;
            await this.walletFollowCreator(this.classOwner);
            logTrackerEvent(
              this,
              'NFT',
              'NFTAutoFollow',
              FOLLOW_PROMPT_STATE.AUTO,
              1
            );
            break;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isFollowPromptUpdating = false;
      }
    },
  },
};
</script>
