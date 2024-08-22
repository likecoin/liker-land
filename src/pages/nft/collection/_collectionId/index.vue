<template>
  <Page class="overflow-hidden">
    <CardV2 v-if="isLoading" class="absolute top-[40%]">{{
      $t('nft_details_page_label_loading')
    }}</CardV2>
    <div v-else class="px-[12px] laptop:px-[24px] pb-[120px] w-full">
      <div class="flex flex-col gap-[24px] w-full max-w-[962px] mx-auto">
        <NFTCollectionItemCard
          :collection-id="collectionId"
          preset="details"
          @click-avatar="handleNFTCardClickAvatar"
        >
          <template #column-edition-select>
            <Separator />

            <NFTEditionSelect
              v-if="collectionIsBook"
              class="self-stretch"
              :items="[formattedCollection]"
              :should-show-notify-button="false"
              @click-collect="handleCollectFromEditionSelector"
              @click-add-to-cart="handleClickAddToCart"
              @click-gift="handleGiftFromEditionSelector"
              @input-custom-price="handleInputCustomPrice"
            />
          </template>
        </NFTCollectionItemCard>

        <div
          class="max-w-[962px] mx-auto flex gap-[24px] justify-center flex-wrap"
        >
          <div>
            <Label
              :text="$t('nft_collection_content_label')"
              preset="h3"
              align="center"
              class="text-like-collection mt-[38px] mb-[24px]"
            />
            <NFTBookShelf
              class="mt-[48px]"
              :items="shelfItems"
              @click-item="onClickShelfItem"
              @click-item-avatar="onClickShelfItemAvatar"
            />
          </div>
        </div>
      </div>
    </div>
    <NFTBookGiftDialog
      :open="isGiftDialogOpen"
      @submit="handleGiftSubmit"
      @close="() => (isGiftDialogOpen = false)"
    />
    <NFTBookTippingDialog
      :open="isTippingDialogOpen"
      :creator-avatar="collectionCreatorAvatar"
      :display-name="collectionCreatorDisplayNameFull"
      :currency="defaultCurrency"
      :price="formattedNFTPriceInUSD"
      :collection-id="collectionId"
      @on-submit="handleSubmitTipping"
      @on-skip="handleSkipTipping"
      @close="handleCloseTippingDialog"
    />
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getNFTBookPurchaseLink } from '~/util/api';
import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import {
  EXTERNAL_HOST,
  NFT_BOOK_PLATFORM_LIKER_LAND,
  USD_TO_HKD_RATIO,
} from '~/constant';
import { parseNFTMetadataURL } from '~/util/nft';

import nftCollectionMixin from '~/mixins/nft-collection';
import clipboardMixin from '~/mixins/clipboard';
import navigationListenerMixin from '~/mixins/navigation-listener';
import utmMixin from '~/mixins/utm';

export default {
  name: 'NFTCollectionDetailsPage',
  mixins: [
    clipboardMixin,
    nftCollectionMixin,
    navigationListenerMixin,
    utmMixin,
  ],
  layout: 'default',
  data() {
    return {
      isLoading: true,
      isGiftDialogOpen: false,
      customPrice: 0,
      isTippingDialogOpen: false,
      isOpeningCheckoutPage: false,
      isAddingToCart: false,
    };
  },
  async fetch({ route, store, error }) {
    const { collectionId } = route.params;
    try {
      await store.dispatch('lazyFetchNFTCollectionInfoByCollectionId', {
        collectionId,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        error({
          statusCode: 404,
          message: 'NFT_COLLECTION_NOT_FOUND',
        });
      } else {
        // eslint-disable-next-line no-console
        console.error(err);
        error({
          statusCode: 500,
          message: 'NFT_COLLECTION_FETCH_ERROR',
        });
      }
    }
  },
  head() {
    let title = this.collectionName || this.$t('nft_details_page_title');
    if (this.collectionIsBook) {
      title += ` - ${this.$t('nft_details_page_title_book')}`;
    } else if (!title.includes(this.$t('nft_details_page_title_article'))) {
      title += ` - ${this.$t('nft_details_page_title_article')}`;
    }
    const description =
      this.collectionDescription || this.$t('nft_details_page_description');
    const ogImage =
      this.collectionImageUrl ||
      `${EXTERNAL_HOST}/images/og/${
        this.$i18n.locale !== 'en' ? 'default-zh.jpg' : 'default.jpg'
      }`;
    const meta = [
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
        content: ogImage,
      },
    ];
    return {
      title,
      meta,
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassMetadataById',
      'getGaClientId',
      'getGaSessionId',
      'getShoppingCartBookProductQuantity',
    ]),
    collectionId() {
      return this.$route.params.collectionId;
    },
    platform() {
      return this.$route.query.from || NFT_BOOK_PLATFORM_LIKER_LAND;
    },
    quantity() {
      return this.$route.query.quantity || 1;
    },
    shelfItems() {
      return this.classIds.map(id => ({ classId: id }));
    },
    defaultCurrency() {
      return this.collection?.defaultPaymentCurrency;
    },
    purchaseEventParams() {
      const customPriceInDecimal = this.customPrice
        ? this.formatCustomPrice(this.customPrice, this.collectionPrice)
        : undefined;
      const totalPrice =
        (customPriceInDecimal || this.collectionPrice) * this.quantity;
      return {
        items: [
          {
            name: this.collectionName,
            price: customPriceInDecimal || this.collectionPrice,
            collection: this.collectionId,
            quantity: this.quantity,
          },
        ],
        price: totalPrice,
        currency: 'USD',
        isNFTBook: true,
      };
    },
  },
  mounted() {
    try {
      this.lazyGetUserInfoByAddress(this.collectionOwner);
    } catch (error) {
      if (!error.response?.status === 404) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    } finally {
      this.isLoading = false;
    }
    this.lazyFetchNFTCollectionPaymentPriceInfo();
    const { hash } = this.$route;
    if (hash) {
      this.$nextTick(() => {
        try {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch {
          // No-op
        }
      });
    }
    logPurchaseFlowEvent(this, 'view_item', {
      items: [
        {
          name: this.collectionName,
          collectionId: this.collectionId,
          price: this.collectionPrice,
        },
      ],
      price: this.collectionPrice,
      currency: 'USD',
    });
  },
  methods: {
    ...mapActions([
      'addBookProductToShoppingCart',
      'uiPromptSuccessAlert',
      'uiPromptErrorAlert',
    ]),
    parseNFTMetadataURL,
    handleNFTCardClickAvatar() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_class_details_card_avatar_clicked',
        this.collectionId,
        1
      );
    },
    handleInputCustomPrice(price) {
      this.customPrice = Number(price);
    },
    handleClickAddToCart() {
      if (this.getShoppingCartBookProductQuantity(this.collectionId) > 0) {
        this.handleAddToCart();
        return;
      }
      this.isAddingToCart = true;
      this.checkTippingAvailability();
    },
    handleAddToCart() {
      this.isAddingToCart = false;
      const hasStock = this.collection?.stock;
      if (!hasStock) return;
      const customPriceInDecimal = this.customPrice
        ? this.formatCustomPrice(this.customPrice, this.collectionPrice)
        : undefined;
      if (this.collectionPrice === 0 && !this.customPrice) {
        this.uiPromptErrorAlert(this.$t('cart_item_free_not_supported'));
        return;
      }
      logPurchaseFlowEvent(this, 'add_to_cart', this.purchaseEventParams);
      logTrackerEvent(
        this,
        'BookCart',
        'collection_class_add_to_cart',
        this.collectionId,
        1
      );
      this.addBookProductToShoppingCart({
        collectionId: this.collectionId,
        from: this.platform,
        customPriceInDecimal,
        coupon: this.$route.query.coupon,
      });
      this.uiPromptSuccessAlert(this.$t('cart_item_added'));
    },
    async handleCollectFromEdition(giftInfo = undefined) {
      const hasStock = this.collection?.stock;
      if (!hasStock) return;

      if (hasStock) {
        try {
          this.isOpeningCheckoutPage = true;
          logPurchaseFlowEvent(this, 'add_to_cart', this.purchaseEventParams);
          logPurchaseFlowEvent(
            this,
            'begin_checkout',
            this.purchaseEventParams
          );
          if (this.collectionPrice === 0 && !this.customPrice) {
            this.$router.push(
              this.localeLocation({
                name: 'nft-claim',
                query: {
                  collection_id: this.collectionId,
                  type: 'nft_book',
                  free: true,
                  from: 'liker_land_waived',
                },
              })
            );
          } else {
            const customPriceInDecimal = this.customPrice
              ? this.formatCustomPrice(this.customPrice, this.collectionPrice)
              : undefined;
            const gaClientId = this.getGaClientId;
            const gaSessionId = this.getGaSessionId;
            const link = getNFTBookPurchaseLink({
              collectionId: this.collectionId,
              platform: this.platform,
            });
            const { url } = await this.$axios.$post(link, {
              gaClientId,
              giftInfo,
              gaSessionId,
              coupon: this.$route.query.coupon,
              customPriceInDecimal,
              utmCampaign: this.utmCampaign,
              utmSource: this.utmSource,
              utmMedium: this.utmMedium,
              referrer: document.referrer,
              email: this.walletEmail,
            });
            if (url) {
              window.location.href = url;
            } else {
              throw new Error('Failed to get purchase link');
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } finally {
          this.isOpeningCheckoutPage = false;
        }
      }
    },
    handleCollectFromEditionSelector() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_edition_selector_collect',
        this.classId,
        1
      );
      this.checkTippingAvailability();
    },
    checkTippingAvailability() {
      const hasStock = this.collection?.stock;
      if (!hasStock) return;
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_tipping_check',
        this.collection,
        1
      );
      const allowCustomPrice = this.collection?.isAllowCustomPrice;
      // Missing isAllowCustomPrice in collection
      if (allowCustomPrice) {
        this.isTippingDialogOpen = true;
        logTrackerEvent(
          this,
          'NFT',
          'nft_collection_details_tipping_open',
          this.currentId,
          1
        );
        return;
      }
      if (this.isAddingToCart) {
        this.handleAddToCart();
      } else {
        this.handleCollectFromEdition();
      }
    },
    formatCustomPrice(customPrice, editionPrice) {
      let newPrice = parseFloat(customPrice);
      if (this.defaultCurrency === 'HKD') {
        newPrice /= USD_TO_HKD_RATIO.toFixed(1);
      }
      return Math.floor((newPrice + editionPrice) * 100);
    },
    async handleGiftSubmit({ giftInfo }) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_gift_submit',
        this.collectionId,
        1
      );
      await this.handleCollectFromEdition(giftInfo);
      this.isGiftDialogOpen = false;
    },
    handleGiftFromEditionSelector() {
      this.isGiftDialogOpen = true;
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_edition_selector_gift',
        this.collectionId,
        1
      );
    },
    onClickShelfItem(classId) {
      logTrackerEvent(
        this,
        'nft_collection',
        'nft_collection_click_shelf_item',
        classId,
        1
      );
    },
    onClickShelfItemAvatar(classId) {
      logTrackerEvent(
        this,
        'nft_collection',
        'nft_book_shelf_click_avatar',
        classId,
        1
      );
    },
    handleSubmitTipping(price) {
      this.customPrice = Number(price);
      logTrackerEvent(
        this,
        'nft_collection',
        'nft_collection_details_tipping_submit',
        this.collectionId,
        1
      );
      if (this.isAddingToCart) {
        this.handleAddToCart();
      } else {
        this.handleCollectFromEdition();
      }
      this.isTippingDialogOpen = false;
    },
    handleSkipTipping() {
      logTrackerEvent(
        this,
        'nft_collection',
        'nft_collection_details_tipping_skip',
        this.collectionId,
        1
      );
      this.customPrice = 0;
      if (this.isAddingToCart) {
        this.handleAddToCart();
      } else {
        this.handleCollectFromEdition();
      }
      this.isTippingDialogOpen = false;
    },
    handleCloseTippingDialog() {
      this.isTippingDialogOpen = false;
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_tipping_close',
        this.classId,
        1
      );
    },
  },
};
</script>
