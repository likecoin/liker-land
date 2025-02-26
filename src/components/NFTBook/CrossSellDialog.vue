<template>
  <Dialog
    :open="open || isKeepingDialogOpen"
    panel-container-class="phone:w-full laptop:w-full max-w-[400px]"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg px-[24px]"
    header-text=""
    :is-disabled-backdrop-click="false"
    :has-close-button="false"
  >
    <div class="flex flex-col items-center">
      <Label
        preset="h4"
        class="text-dark-gray"
        :text="title || $t('nft_book_cross_sell_title')"
      />

      <NuxtLink
        class="mt-[24px] group"
        :to="viewInfoLocation"
        target="_blank"
        @click.native="handleProductCoverClick"
      >
        <NFTBookCover
          class="h-[200px] group-hover:scale-105 transition-transform"
          :src="productImageUrl"
        />
      </NuxtLink>

      <NuxtLink
        class="mt-[16px] group"
        :to="viewInfoLocation"
        target="_blank"
        @click.native="handleProductTitleClick"
      >
        <Label
          class="text-like-green group-hover:underline"
          preset="h5"
          :text="productName"
        />
      </NuxtLink>
      <Label class="mt-[4px]" preset="p6" :text="productPriceWithFormat" />

      <p class="mt-[16px] text-[14px] line-clamp-2">{{ productDescription }}</p>

      <footer
        class="flex flex-col items-stretch justify-center w-full mt-[20px] gap-[12px]"
      >
        <ButtonV2
          preset="secondary"
          :text="$t('nft_book_cross_sell_action_accept')"
          :is-disabled="isKeepingDialogOpen"
          @click.prevent="handleAccept"
        />
        <ButtonV2
          preset="plain"
          :text="$t('nft_book_cross_sell_action_reject')"
          :is-disabled="isKeepingDialogOpen"
          @click.prevent="handleReject"
        />
      </footer>
    </div>
  </Dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { NFT_BOOK_PLATFORM_LIKER_LAND } from '~/constant';

import { getNFTBookPurchaseLink } from '~/util/api';
import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';

import nftOrCollectionMixin from '~/mixins/nft-or-collection';
import couponMixin from '~/mixins/coupon';

export default {
  name: 'NFTBookCrossSellDialog',
  mixins: [nftOrCollectionMixin, couponMixin],
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    classId: {
      type: String,
      default: undefined,
    },
    collectionId: {
      type: String,
      default: undefined,
    },
    platform: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isKeepingDialogOpen: false,
    };
  },
  computed: {
    ...mapGetters(['getGaClientId', 'getGaSessionId', 'shoppingCartBookItems']),
  },
  watch: {
    open: {
      immediate: true,
      handler(open) {
        if (open) {
          this.lazyFetchProductInfo();
          logTrackerEvent(
            this,
            'NFT',
            'nft_book_cross_sell_dialog_show',
            this.productId,
            1
          );
        }
      },
    },
  },
  methods: {
    ...mapActions(['addBookProductToShoppingCart', 'uiPromptSuccessAlert']),
    handleProductCoverClick() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_book_cross_sell_dialog_p_cover_click',
        this.productId,
        1
      );
    },
    handleProductTitleClick() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_book_cross_sell_dialog_p_title_click',
        this.productId,
        1
      );
    },
    async gotoCheckoutPage({
      link,
      customPriceInDecimal,
      purchaseEventParams,
    }) {
      try {
        const { url, paymentId } = await this.$axios.$post(
          link,
          {
            gaClientId: this.getGaClientId,
            gaSessionId: this.getGaSessionId,
            coupon: this.getApplicableCoupon({
              checkoutPrice: customPriceInDecimal,
            }),
            customPriceInDecimal,
            utmCampaign: this.utmCampaign,
            utmSource: `${this.utmSource}_cross-sell`,
            utmMedium: this.utmMedium,
            referrer: this.documentReferrer,
            email: this.walletEmail,
            gadClickId: this.gadClickId,
            gadSource: this.gadSource,
            fbClickId: this.fbClickId,
          },
          {
            headers: {
              Authorization: this.getAccessToken
                ? `Bearer ${this.getAccessToken}`
                : undefined,
            },
          }
        );
        logPurchaseFlowEvent(this, 'begin_checkout', {
          ...purchaseEventParams,
          paymentId,
        });
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('Failed to get checkout link');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.uiPromptErrorAlert(error.toString());
      } finally {
        this.isKeepingDialogOpen = false;
      }
    },
    async handleAccept() {
      if (this.isKeepingDialogOpen) return;

      logTrackerEvent(
        this,
        'NFT',
        'nft_book_cross_sell_dialog_accept',
        this.productId,
        1
      );

      // NOTE: Custom price is not supported for now
      if (this.isCollection) {
        const hasStock = this.collection?.stock;
        if (!hasStock || this.collectionPrice === 0) {
          this.handleReject();
          return;
        }

        const customPriceInDecimal = this.collectionPrice * 100;
        const purchaseEventParams = {
          items: [
            {
              name: this.collectionName,
              price: this.collectionPrice,
              collection: this.collectionId,
              quantity: 1,
            },
          ],
          price: this.collectionPrice,
          currency: 'USD',
          isNFTBook: true,
        };

        this.isKeepingDialogOpen = true;
        this.$emit('accept');

        logPurchaseFlowEvent(this, 'add_to_cart', purchaseEventParams);

        if (this.shoppingCartBookItems.length < 1) {
          const link = getNFTBookPurchaseLink({
            collectionId: this.collectionId,
            platform: this.platform,
          });
          await this.gotoCheckoutPage({
            link,
            customPriceInDecimal,
            purchaseEventParams,
          });
          return;
        }

        this.addBookProductToShoppingCart({
          collectionId: this.collectionId,
          from: NFT_BOOK_PLATFORM_LIKER_LAND,
          customPriceInDecimal,
          coupon: this.$route.query.coupon,
        });
      } else {
        // NOTE: Only support single edition for now
        const priceIndex = 0;
        const edition = this.getEditionByIndex(priceIndex);
        const hasStock = edition?.stock;
        if (!hasStock || !this.nftIsCollectable || edition.price === 0) {
          this.handleReject();
          return;
        }

        const customPriceInDecimal = edition.price * 100;
        const purchaseEventParams = {
          items: [
            {
              name: this.nftName,
              price: edition.price,
              classId: this.classId,
              priceIndex,
              quantity: 1,
            },
          ],
          price: edition.price,
          currency: 'USD',
          isNFTBook: true,
        };

        this.isKeepingDialogOpen = true;
        this.$emit('accept');

        logPurchaseFlowEvent(this, 'add_to_cart', purchaseEventParams);

        if (this.shoppingCartBookItems.length < 1) {
          const link = getNFTBookPurchaseLink({
            classId: this.classId,
            priceIndex: edition.index,
            platform: this.platform,
          });
          await this.gotoCheckoutPage({
            link,
            customPriceInDecimal,
            purchaseEventParams,
          });
          return;
        }

        this.addBookProductToShoppingCart({
          classId: this.classId,
          priceIndex: edition.index,
          from: NFT_BOOK_PLATFORM_LIKER_LAND,
          customPriceInDecimal,
          coupon: this.$route.query.coupon,
        });
      }
      logTrackerEvent(this, 'BookCart', 'BookCartAddItem', this.productId, 1);
      this.uiPromptSuccessAlert(this.$t('cart_item_added'));
      this.isKeepingDialogOpen = false;
    },
    handleReject() {
      if (this.isKeepingDialogOpen) return;

      logTrackerEvent(
        this,
        'NFT',
        'nft_book_cross_sell_dialog_reject',
        this.productId,
        1
      );
      this.$emit('reject');
    },
  },
};
</script>
