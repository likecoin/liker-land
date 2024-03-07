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
          <template #column-right>
            <Separator />

            <NFTEditionSelect
              v-if="collectionIsBook"
              class="self-stretch"
              :items="[formattedCollection]"
              :should-show-notify-button="false"
              @click-collect="handleCollectFromEditionSelector"
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
      :creator-avatar="creatorAvatar"
      :display-name="creatorDisplayNameFull"
      :currency="defaultCurrency"
      :class-id="classId"
      @on-submit="handleSubmitTipping"
      @on-skip="handleSkipTipping"
      @close="() => (isTippingDialogOpen = false)"
    />
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';

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
        this.$i18n.locale !== 'en' ? 'default-zh.png' : 'default.png'
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
    ]),
    collectionId() {
      return this.$route.params.collectionId;
    },
    platform() {
      return this.$route.query.from || NFT_BOOK_PLATFORM_LIKER_LAND;
    },
    shelfItems() {
      return this.classIds.map(id => ({ classId: id }));
    },
    defaultCurrency() {
      return this.collection?.defaultPaymentCurrency;
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
    async handleCollectFromEdition(giftInfo = undefined) {
      const hasStock = this.collection?.stock;
      if (!hasStock) return;

      if (hasStock) {
        const purchaseEventParams = {
          items: [
            {
              name: this.collectionName,
              price: this.collectionPrice,
              collection: this.collectionId,
            },
          ],
          price: this.collectionPrice,
          currency: 'USD',
          isNFTBook: true,
        };
        logPurchaseFlowEvent(this, 'add_to_cart', purchaseEventParams);
        logPurchaseFlowEvent(this, 'begin_checkout', purchaseEventParams);
        const customPriceInDecimal =
          this.customPrice === 0
            ? undefined
            : this.formatCustomPrice(this.customPrice, this.collectionPrice);

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
          email: this.walletEmail,
        });
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('Failed to get purchase link');
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

      const allowCustomPrice = this.collection?.isAllowCustomPrice;
      // Missing isAllowCustomPrice in collection
      if (allowCustomPrice) {
        this.isTippingDialogOpen = true;
        return;
      }
      this.handleCollectFromEdition();
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
        this.classId,
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
        this.classId,
        1
      );
    },
    onClickShelfItem(classId) {
      logTrackerEvent(
        this,
        'nft_collection',
        'nft_book_shelf_click_book',
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
      this.handleCollectFromEdition();
    },
    handleSkipTipping() {
      logTrackerEvent(
        this,
        'nft_collection',
        'nft_collection_skip_button_clicked',
        this.collectionId,
        1
      );
      this.isTippingDialogOpen = false;
      this.handleCollectFromEdition();
    },
  },
};
</script>
