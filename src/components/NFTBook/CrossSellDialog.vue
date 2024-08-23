<template>
  <Dialog
    :open="open"
    panel-container-class="phone:w-full laptop:w-full max-w-[400px]"
    panel-component="CardV2"
    panel-class="overflow-y-scroll shadow-lg px-[12px]"
    header-text=""
    @close="handleClose"
  >
    <div class="flex flex-col items-center">
      <Label
        preset="h4"
        class="text-dark-gray"
        :text="$t('nft_book_cross_sell_title')"
      />

      <NFTBookCover class="mt-[24px] h-[200px]" :src="productImageUrl" />

      <Label class="mt-[8px]" preset="h5" :text="productName" />
      <Label class="mt-[4px]" preset="p6" :text="productPriceWithFormat" />

      <p class="mt-[16px] line-clamp-2">{{ productDescription }}</p>

      <footer
        class="flex flex-col items-stretch justify-center w-full mt-[20px] gap-[12px]"
      >
        <ButtonV2
          preset="secondary"
          :text="$t('nft_book_cross_sell_action_accept')"
          @click.prevent="handleAccept"
        />
        <ButtonV2
          preset="plain"
          :text="$t('nft_book_cross_sell_action_reject')"
          @click.prevent="handleReject"
        />
      </footer>
    </div>
  </Dialog>
</template>

<script>
import { mapActions } from 'vuex';

import { NFT_BOOK_PLATFORM_LIKER_LAND } from '~/constant';

import { logTrackerEvent, logPurchaseFlowEvent } from '~/util/EventLogger';

import nftOrCollectionMixin from '~/mixins/nft-or-collection';

export default {
  name: 'NFTBookCrossSellDialog',
  mixins: [nftOrCollectionMixin],
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
    handleAccept() {
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

        this.addBookProductToShoppingCart({
          collectionId: this.collectionId,
          from: NFT_BOOK_PLATFORM_LIKER_LAND,
          customPriceInDecimal: this.collectionPrice,
          coupon: this.$route.query.coupon,
        });

        logPurchaseFlowEvent(this, 'add_to_cart', {
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
        });
      } else {
        // NOTE: Only support single edition for now
        const edition = this.getEditionByIndex(0);
        const hasStock = edition?.stock;
        if (!hasStock || !this.nftIsCollectable || edition.price === 0) {
          this.handleReject();
          return;
        }

        this.addBookProductToShoppingCart({
          classId: this.classId,
          priceIndex: edition.index,
          from: NFT_BOOK_PLATFORM_LIKER_LAND,
          customPriceInDecimal: edition.price,
          coupon: this.$route.query.coupon,
        });

        logPurchaseFlowEvent(this, 'add_to_cart', {
          items: [
            {
              name: this.NFTName,
              price: edition.price,
              classId: this.classId,
              quantity: 1,
            },
          ],
          price: edition.price,
          currency: 'USD',
          isNFTBook: true,
        });
      }
      logTrackerEvent(this, 'BookCart', 'BookCartAddItem', this.productId, 1);
      this.uiPromptSuccessAlert(this.$t('cart_item_added'));
      this.$emit('accept');
    },
    handleReject() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_book_cross_sell_dialog_reject',
        this.productId,
        1
      );
      this.$emit('reject');
    },
    handleClose() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_book_cross_sell_dialog_close',
        this.productId,
        1
      );
      this.$emit('reject');
      this.$emit('close');
    },
  },
};
</script>
