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
          @clickTooltip="handleNFTCardClickTooltip"
        >
          <template #column-left>
            <ButtonV2
              preset="outline"
              :class="[
                'w-full',
                '!h-[32px]',
                '!rounded-[10px]',
                'border-[#EBEBEB]',
              ]"
              size="tiny"
              @click="handleShareButtonClick"
            >
              <IconShare class="w-[16px] text-dark-gray" />
              <p
                class="ml-[8px] text-[12px] text-dark-gray"
                v-text="$t('nft_details_page_button_share')"
              />
            </ButtonV2>
            <ButtonV2
              preset="outline"
              class="w-full !h-[32px] !rounded-[10px] border-[#EBEBEB]"
              size="tiny"
              :is-disabled="isAllSoldOut"
              @click="handleGiftButtonClick"
            >
              <IconGift class="w-[16px] text-dark-gray" />
              <p
                class="ml-[8px] text-[12px] text-dark-gray"
                v-text="$t('nft_edition_select_confirm_button_text_gift')"
              />
            </ButtonV2>
          </template>

          <template #column-edition-select>
            <div
              class="hidden laptop:block border-b-[1px] border-[#EBEBEB] w-full my-[16px]"
            />
            <NFTEditionSelect
              v-if="collectionIsBook"
              class="self-stretch"
              :is-all-sold-out="isAllSoldOut"
              :items="[formattedCollection]"
              :should-show-notify-button="false"
              @click-collect="handleCollectFromEditionSelector"
              @click-add-to-cart="handleClickAddToCart"
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
        <NFTPageRecommendation
          :collection-id="collectionId"
          @header-avatar-click="handleRecommendationHeaderAvatarClick"
          @follow-button-click="handleFollowButtonClick"
          @item-click="handleRecommendedItemClick"
          @item-collect="handleRecommendedItemCollect"
          @slide-next.once="handleRecommendationSlideNext"
          @slide-prev.once="handleRecommendationSlidePrev"
          @slider-move.once="handleRecommendationSliderMove"
        />
      </div>
    </div>
    <NFTBookGiftDialog
      :open="isGiftDialogOpen"
      :items="[formattedCollection]"
      @submit="handleGiftSubmit"
      @close="handleGiftClose"
    />
    <NFTBookTippingDialog
      :open="isTippingDialogOpen"
      :creator-avatar="collectionCreatorAvatar"
      :display-name="collectionCreatorDisplayNameFull"
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
  IS_TESTNET,
  EXTERNAL_HOST,
  NFT_BOOK_PLATFORM_LIKER_LAND,
} from '~/constant';
import { parseNFTMetadataURL } from '~/util/nft';

import nftCollectionMixin from '~/mixins/nft-collection';
import clipboardMixin from '~/mixins/clipboard';
import navigationListenerMixin from '~/mixins/navigation-listener';
import utmMixin from '~/mixins/utm';
import alertMixin from '~/mixins/alert';
import couponMixin from '~/mixins/coupon';

export default {
  name: 'NFTCollectionDetailsPage',
  mixins: [
    clipboardMixin,
    nftCollectionMixin,
    navigationListenerMixin,
    utmMixin,
    alertMixin,
    couponMixin,
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
        hid: 'og:url',
        property: 'og:url',
        content: `${EXTERNAL_HOST}${this.$route.path}`,
      },

      {
        hid: 'og:image',
        property: 'og:image',
        content: ogImage,
      },
    ];
    const schemas = [];
    if (this.collectionPrice) {
      schemas.push({
        '@context': 'http://schema.org',
        '@type': ['Product', 'ProductCollection'],
        url: `${EXTERNAL_HOST}/nft/collection/${this.collectionId}`,
        productID: this.collectionId,
        name: this.collectionName,
        description: this.collectionDescription,
        image: ogImage,
        datePublished: this.collection?.timestamp,
        includesObject: this.classIds.map(id => {
          const {
            name: className,
            description: classDescription,
            image: classImage,
            iscn_owner: classOwner,
          } = this.getNFTClassMetadataById(id);
          return {
            '@context': 'http://www.schema.org',
            '@type': 'TypeAndQuantityNode',
            typeOfGood: {
              '@context': 'http://www.schema.org',
              '@type': this.collectionIsBook ? 'Book' : 'CreativeWork',
              name: className,
              description: classDescription,
              image: classImage,
              url: `${EXTERNAL_HOST}/nft/class/${id}`,
              author: classOwner
                ? {
                    '@context': 'http://www.schema.org',
                    '@type': 'Person',
                    url: `${EXTERNAL_HOST}/${classOwner}`,
                    identifier: classOwner,
                  }
                : undefined,
              brand: this.collectionIsBook
                ? {
                    '@context': 'http://www.schema.org',
                    '@type': 'Brand',
                    url: `${EXTERNAL_HOST}/about/nft-book`,
                    name: 'NFT Book',
                  }
                : {
                    '@context': 'http://www.schema.org',
                    '@type': 'Brand',
                    url: `${EXTERNAL_HOST}/about/writing-nft`,
                    name: 'Writing NFT',
                  },
            },
            amountOfThisGood: '1',
            unitCode: 'C62',
          };
        }),
        offers: {
          '@context': 'http://www.schema.org',
          '@type': 'Offer',
          price: this.collectionPrice,
          priceCurrency: 'USD',
          seller: {
            '@context': 'http://www.schema.org',
            '@type': 'Person',
            url: `${EXTERNAL_HOST}/${this.collectionOwner}`,
            identifier: this.collectionOwner,
          },
          availability: this.collection?.stock
            ? 'LimitedAvailability'
            : 'OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          checkoutPageURLTemplate: getNFTBookPurchaseLink({
            collectionId: this.collectionId,
          }),
        },
      });
      // disable og product for testnet to avoid pixel auto fetch
      if (!IS_TESTNET) {
        [
          {
            hid: 'og:price:amount',
            property: 'og:price:amount',
            content: this.collectionPrice,
          },
          {
            hid: 'product:price:amount',
            property: 'product:price:amount',
            content: this.collectionPrice,
          },
          {
            hid: 'og:price:currency',
            property: 'og:price:currency',
            content: 'USD',
          },
          {
            hid: 'product:price:currency',
            property: 'product:price:currency',
            content: 'USD',
          },
          {
            hid: 'og:availability',
            property: 'og:availability',
            content: this.collection?.stock ? 'in stock' : 'out of stock',
          },
          {
            hid: 'product:brand',
            property: 'product:brand',
            content: 'NFT Book',
          },
          {
            hide: 'product:locale',
            property: 'product:locale',
            content: this.$i18n.locale,
          },
          {
            hid: 'product:catalog_id',
            property: 'product:catalog_id',
            content: this.collectionId,
          },
          {
            hid: 'product:retailer_item_id',
            property: 'product:retailer_item_id',
            content: this.collectionId,
          },
          {
            hid: 'product:category',
            property: 'product:category',
            content: 543542,
          },
          {
            hid: 'product:condition',
            property: 'product:condition',
            content: 'new',
          },
          {
            hid: 'product:custom_label_0',
            property: 'product:custom_label_0',
            content: this.collectionOwner,
          },
        ].forEach(m => meta.push(m));
      }
    }
    return {
      title,
      meta,
      script: schemas.length
        ? [
            {
              hid: 'schema',
              innerHTML: JSON.stringify(schemas),
              type: 'application/ld+json',
              body: true,
            },
          ]
        : [],
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassMetadataById',
      'getGaClientId',
      'getGaSessionId',
      'getShoppingCartBookProductQuantity',
      'getAccessToken',
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
        isNFTBook: this.collectionIsBook,
      };
    },
    isAllSoldOut() {
      return (
        this.formattedCollection?.stock === 0 ||
        this.formattedCollection?.priceLabel === undefined
      );
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
      isNFTBook: this.collectionIsBook,
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
          const customPriceInDecimal = this.customPrice
            ? this.formatCustomPrice(this.customPrice, this.collectionPrice)
            : undefined;
          const gaClientId = this.getGaClientId;
          const gaSessionId = this.getGaSessionId;
          const link = getNFTBookPurchaseLink({
            collectionId: this.collectionId,
            platform: this.platform,
          });
          const { url, paymentId } = await this.$axios.$post(
            link,
            {
              gaClientId,
              giftInfo,
              gaSessionId,
              coupon: this.getApplicableCoupon({
                checkoutPrice: customPriceInDecimal,
              }),
              customPriceInDecimal,
              utmCampaign: this.utmCampaign,
              utmSource: this.utmSource,
              utmMedium: this.utmMedium,
              referrer: this.documentReferrer,
              gadClickId: this.gadClickId,
              gadSource: this.gadSource,
              fbClickId: this.fbClickId,
              email: this.walletEmail,
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
            ...this.purchaseEventParams,
            paymentId,
          });
          if (url) {
            window.location.href = url;
          } else {
            throw new Error('Failed to get purchase link');
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
      const newPrice = parseFloat(customPrice);
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
    handleShareButtonClick() {
      this.shareURLPath({
        title: this.collectionName,
        text: this.collectionDescription,
        path: this.nftCollectionDetailsPageSharePath,
        alertMessage: this.$t('tooltip_share_done'),
      });
      logTrackerEvent(this, 'NFT', 'share', this.collectionId, 1, {
        content_type: 'collection',
        item_id: this.collectionId,
      });
    },
    handleGiftButtonClick() {
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
    handleGiftClose() {
      this.isGiftDialogOpen = false;
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_gift_close',
        this.classId,
        1
      );
    },
    async handleFollowButtonClick(productOwner) {
      await this.handleClickFollow({
        followOwner: productOwner,
      });
      this.alertPromptSuccess(
        this.$t('portfolio_subscription_success_alert', {
          creator: this.getUserInfoByAddress(productOwner)?.displayName,
        })
      );
      if (this.walletFollowees?.includes(productOwner)) {
        logTrackerEvent(
          this,
          'NFT',
          'nft_collection_details_click_unfollow',
          this.collectionId,
          1
        );
      } else {
        logTrackerEvent(
          this,
          'NFT',
          'nft_collection_details_click_follow',
          this.collectionId,
          1
        );
      }
    },
    handleRecommendationHeaderAvatarClick() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_recommend_header_avatar_click',
        this.collection_id,
        1
      );
    },
    handleRecommendedItemClick(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_recommend_item_click',
        classId,
        1
      );
    },
    handleRecommendedItemCollect(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_recommend_item_collect',
        classId,
        1
      );
    },
    handleRecommendationSlideNext() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_recommendation_clicked_next',
        this.collection_id,
        1
      );
    },
    handleRecommendationSlidePrev() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_recommendation_clicked_prev',
        this.collection_id,
        1
      );
    },
    handleRecommendationSliderMove() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_recommendation_moved_slider',
        this.collection_id,
        1
      );
    },
    handleNFTCardClickTooltip() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_collection_details_card_tooltip_clicked',
        this.collectionId,
        1
      );
    },
  },
};
</script>
