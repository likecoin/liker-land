<template>
  <Page
    :class="[
      'w-full',
      'max-w-[960px]',
      'mx-auto',
      'laptop:px-[2em]',
      'pb-[8em]',
      'text-[0.75em] sm:text-[1em]',
    ]"
  >
    <h1
      :class="[
        'w-full',
        'mb-[12px] sm:mb-[0.5em]',
        'px-[12px] sm:px-[24px] laptop:px-[0]',
        'text-[#3AB7A2]',
        'text-[1.5rem] sm:text-[3rem]',
        'text-left',
        'font-proxima',
        'font-[600]',
      ]"
    >
      {{ $t('shopping_cart_title') }}
    </h1>

    <CardV2
      v-if="shoppingCartBookItems.length"
      class="w-full laptop:px-[2em] phoneLg:rounded-[0] phoneLg:px-[12px] phoneLg:py-[16px]"
    >
      <header
        :class="[
          'grid',
          'grid-cols-12',
          'gap-[8px] sm:gap-[1em]',
          'p-[0.5em]',
          'pl-[1em] phone:pl-[0]',
          'border-b-gray-d8',
          'border-b',
          'text-gray-9b',
        ]"
      >
        <div class="col-start-1 col-end-8">
          {{ $t('shopping_cart_list_header_item') }}
        </div>

        <div class="col-start-8 col-end-10 text-center">
          {{ $t('shopping_cart_list_header_quantity') }}
        </div>

        <div class="col-start-10 col-end-12 text-center">
          {{ $t('shopping_cart_list_header_price') }}
        </div>
      </header>
      <ul>
        <li
          v-for="(item, index) in shoppingCartBookItems"
          :key="item.productId"
          :class="['border-b', 'border-b-gray-d8']"
        >
          <ShoppingCartListRow
            :index="index + 1"
            :class-id="item.classId"
            :price-index="item.priceIndex"
            :collection-id="item.collectionId"
            :quantity="item.quantity"
            :custom-price="item.customPriceInDecimal / 100"
            :from="item.from"
            @remove="handleClickRemoveButton"
          />
        </li>
      </ul>
      <footer
        class="grid grid-cols-6 items-center gap-[1em] mt-[1em] text-right"
      >
        <div class="col-span-3 sm:col-span-4 text-gray-4a">
          {{ $t('shopping_cart_list_total_price') }}
        </div>
        <div
          class="col-span-3 sm:col-span-2 text-like-green font-proxima font-[600] leading-1 text-[2em]"
        >
          {{ totalNFTPriceInUSD | formatNumberWithUSD }}
        </div>
      </footer>

      <div class="flex justify-end mt-[2em]">
        <div class="flex gap-[1em]">
          <ButtonV2
            v-if="giftInfo"
            class="min-w-[120px]"
            preset="outline"
            :text="$t('nft_edition_select_confirm_button_text_gift')"
            @click="handleClickGiftButton"
          >
            <template #prepend>
              <IconGift class="w-[16px]" />
            </template>
          </ButtonV2>
          <EventModalCollectMethodButton
            :title="$t('shopping_cart_checkout_button_by_card')"
            type="stripe"
            :price="formattedFiatPrice"
            @click="_ => handleClickCheckoutByFiatButton()"
          />
        </div>
      </div>
    </CardV2>

    <CardV2
      v-else
      :class="[
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'w-full',
        'min-h-[20vh]',
      ]"
    >
      <div>{{ $t('shopping_cart_empty_notice') }}</div>
      <ButtonV2
        class="mt-[2em]"
        preset="secondary"
        :text="$t('shopping_cart_empty_notice_button')"
        :to="localeLocation({ name: 'store' })"
        @click="handleClickEmptyNoticeButton"
      />
    </CardV2>
    <NFTBookGiftDialog
      :open="isGiftDialogOpen"
      :prefill-gift-info="giftInfo"
      @submit="handleGiftSubmit"
      @close="handleGiftClose"
    />
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';
import { formatNumberWithUSD } from '~/util/ui';
import { getNFTBookCartPurchaseLink } from '~/util/api';

import nftMixin from '~/mixins/nft';
import alertMixin from '~/mixins/alert';

export default {
  name: 'ShoppingCartPage',
  filters: {
    formatNumberWithUSD,
  },
  mixins: [nftMixin, alertMixin],
  data() {
    return {
      isGiftDialogOpen: false,
      giftInfo: null,
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassMetadataById',
      'getNFTClassPaymentPriceById',
      'getNFTCollectionInfoByCollectionId',
      'shoppingCartBookProductList',
      'shoppingCartBookItems',
    ]),
    purchaseEventParams() {
      let { locale } = this.$i18n;
      if (locale === 'zh-Hant') {
        locale = 'zh';
      }
      return {
        price: this.totalNFTPriceInUSD,
        currency: 'USD',
        items: this.shoppingCartBookItems.map(item => {
          const { classId, collectionId } = item;
          const name = classId
            ? this.getNFTClassMetadataById(classId)?.name
            : this.getNFTCollectionInfoByCollectionId(collectionId)?.name[
                locale
              ];
          return {
            name,
            ...item,
          };
        }),
        isNFTBook: true,
      };
    },
    productIdList() {
      return this.shoppingCartBookProductList.map(item => item.productId);
    },
    totalNFTPriceInUSD() {
      return this.shoppingCartBookItems.reduce((totalPrice, item) => {
        const priceInfo = this.getNFTClassPaymentPriceById(
          item.productId,
          item.classId ? item.priceIndex : undefined
        );
        const unitPrice =
          item.customPriceInDecimal / 100 || priceInfo?.fiatPrice;
        return totalPrice + (unitPrice * item.quantity || 0);
      }, 0);
    },
    formattedFiatPrice() {
      return formatNumberWithUSD(this.totalNFTPriceInUSD);
    },
  },
  mounted() {
    logPurchaseFlowEvent(this, 'view_cart', this.purchaseEventParams);
    this.parseCartItemFromQueryString();
  },
  methods: {
    ...mapActions([
      'clearBookProductShoppingCart',
      'addBookProductToShoppingCart',
      'removeBookProductFromShoppingCart',
      'lazyGetNFTClassMetadata',
      'lazyFetchNFTBookInfoByClassId',
      'lazyFetchNFTCollectionInfoByCollectionId',
    ]),
    parseCartItemFromQueryString() {
      const { query } = this.$route;
      const {
        class_id: classId,
        price_index: priceIndex,
        collection_id: collectionId,
        gift_to_email: giftToEmail,
        from,
        checkout,
      } = query;
      let {
        gift_to_name: giftToName,
        gift_message: giftMessage,
        gift_from_name: giftFromName,
      } = query;
      if (giftToEmail) {
        if (!giftToName) [giftToName] = giftToEmail.split('@');
        if (!giftMessage) giftMessage = 'Enjoy your book!';
        if (!giftFromName) giftFromName = 'Liker Land Bookstore';
        this.giftInfo = {
          toEmail: giftToEmail,
          toName: giftToName,
          message: giftMessage,
          fromName: giftFromName,
        };
      }
      if (!classId && !collectionId) {
        return;
      }
      let classIds = [];
      if (classId) {
        classIds = Array.isArray(classId) ? classId : [classId];
      }
      let priceIndexes = [];
      if (priceIndex) {
        priceIndexes = Array.isArray(priceIndex) ? priceIndex : [priceIndex];
      }
      let collectionIds = [];
      if (collectionId) {
        collectionIds = Array.isArray(collectionId)
          ? collectionId
          : [collectionId];
      }
      if (!classIds.length && !collectionIds.length) {
        return;
      }
      this.clearBookProductShoppingCart();
      classIds.forEach((id, index) => {
        const priceIndex = priceIndexes[index];
        this.addBookProductToShoppingCart({
          classId: id,
          priceIndex: Number(priceIndex) || 0,
          from,
        });
      });
      collectionIds.forEach(id => {
        this.addBookProductToShoppingCart({
          collectionId: id,
          from,
        });
      });
      if (checkout === '1') {
        this.handleClickCheckoutByFiatButton();
      }
    },
    handleClickRemoveButton(item) {
      const { productId } = item;
      logPurchaseFlowEvent(this, 'remove_from_cart', {
        items: [item],
        price: item.price * item.quantity,
        currency: 'USD',
        isNFTBook: true,
      });
      logTrackerEvent(this, 'BookCart', 'BookCartRemoveItem', productId, 1);
      this.removeBookProductFromShoppingCart({ productId });
    },
    async handleGiftSubmit({ giftInfo }) {
      logTrackerEvent(this, 'BookCart', 'BookCartGiftSubmit', '', 1);
      this.giftInfo = giftInfo;
      await this.handleClickCheckoutByFiatButton();
      this.isGiftDialogOpen = false;
    },
    handleGiftClose() {
      this.isGiftDialogOpen = false;
      logTrackerEvent(this, 'BookCart', 'BookCartGiftClose', '', 1);
    },
    handleClickGiftButton() {
      this.isGiftDialogOpen = true;
      logTrackerEvent(this, 'BookCart', 'BookCartGiftClick', '', 1);
    },
    async handleClickCheckoutByFiatButton(giftInfo = this.giftInfo) {
      try {
        logTrackerEvent(
          this,
          'BookCart',
          'BookCartBeginCheckout',
          this.productIdList,
          1
        );
        logPurchaseFlowEvent(this, 'begin_checkout', this.purchaseEventParams);
        const gaClientId = this.getGaClientId;
        const gaSessionId = this.getGaSessionId;
        const link = getNFTBookCartPurchaseLink();
        const { url } = await this.$axios.$post(link, {
          gaClientId,
          gaSessionId,
          utmCampaign: this.utmCampaign,
          utmSource: this.utmSource,
          utmMedium: this.utmMedium,
          referrer: this.documentReferrer,
          gadClickId: this.gadClickId,
          gadSource: this.gadSource,
          items: this.shoppingCartBookItems,
          email: this.walletEmail,
          giftInfo,
        });
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('Failed to get purchase link');
        }
      } catch (error) {
        console.error(error);
        this.alertPromptError(error);
      }
    },
    handleClickEmptyNoticeButton() {
      logTrackerEvent(
        this,
        'BookCart',
        'shopping_cart_click_empty_notice_button',
        this.getAddress,
        1
      );
    },
  },
};
</script>
