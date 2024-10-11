<template>
  <main>
    <div
      class="flex items-center flex-col-reverse laptop:flex-row laptop:justify-center laptop:item-start gap-[45px] w-full mb-[60px] px-[12px]"
    >
      <NFTWidgetBaseCard class="w-full max-w-[426px]">
        <NuxtLink :to="viewInfoLocation" target="_blank">
          <div class="flex flex-col gap-[16px] mb-[24px]">
            <NFTBookCoverWithFrame :src="productImageUrl" />
            <Label class="text-[28px] font-600" :text="productTitle" />
            <div class="grid grid-cols-2">
              <div v-if="iscnWorkAuthor" class="flex flex-col">
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
                  :text="$t('identity_type_publisher')"
                  class=" text-medium-gray"
                />
                <Label preset="h5" :text="creatorDisplayName" />
              </div>
            </div>
            <p class="w-full line-clamp-3">{{ productDescription }}</p>
          </div>
        </NuxtLink>
      </NFTWidgetBaseCard>
      <NFTClaimMainSection
        :header-text="$t('nft_claim_welcome_title_send_gift')"
        :content-text="$t('nft_claim_welcome_text_send_gift')"
      >
        <template #header-prepend>
          <IconGift class="w-[48px]" />
        </template>
        <template #header-append>
          <Label
            class="text-like-green"
            preset="h5"
            :text="$t('nft_claim_NFT_name', { name: productTitle })"
          />
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
    </div>
  </main>
</template>

<script>
import { mapActions } from 'vuex';

import {
  logTrackerEvent,
  logPurchaseFlowEvent,
  logPurchaseNFTBookEvent,
} from '~/util/EventLogger';
import { getNFTClassCollectionType, nftClassCollectionType } from '~/util/nft';
import {
  getNFTBookPaymentStatusEndpoint,
  getNFTBookCartStatusEndpoint,
} from '~/util/api';
import nftOrCollectionMixin from '~/mixins/nft-or-collection';

export default {
  name: 'NFTGiftSuccessPage',
  mixins: [nftOrCollectionMixin],
  data() {
    return {
      classId: this.$route.query.class_id,
      collectionId: this.$route.query.collection_id,
      cartItems: [],
      priceIndex: this.$route.query.price_index,
    };
  },
  computed: {
    cartId() {
      return this.$route.query.cart_id;
    },
    paymentId() {
      return this.$route.query.payment_id;
    },
    token() {
      return this.$route.query.claiming_token;
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
    cartItemsCount() {
      return this.cartItems.length || 1;
    },
  },
  async mounted() {
    const { redirect, from, ...query } = this.$route.query;
    if (!this.classId && !this.collectionId && !this.cartId) {
      this.$nuxt.error({
        statusCode: 400,
        message: this.t('nft_gift_missing_qs'),
      });
      return;
    }
    let price;
    let priceIndex;

    if (this.cartId) {
      const { data } = await this.$api.get(
        getNFTBookCartStatusEndpoint({
          cartId: this.cartId,
          token: this.token,
        })
      );
      ({ price } = data);
      const {
        classIdsWithPrice = [],
        collectionIdsWithPrice = [],
        classIds = [],
        collectionIds = [],
      } = data;
      this.cartItems = classIdsWithPrice.concat(collectionIdsWithPrice);
      if (classIds.length) {
        [this.classId] = classIds;
      } else if (collectionIds.length) {
        [this.collectionId] = collectionIds;
      }
      if (query.type === 'nft_book') this.clearBookProductShoppingCart();
    } else {
      const { data } = await this.$api.get(
        getNFTBookPaymentStatusEndpoint({
          classId: this.classId,
          collectionId: this.collectionId,
          paymentId: this.paymentId,
        })
      );
      ({ price, priceIndex } = data);
    }
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
              await this.lazyFetchNFTCollectionInfoByCollectionId({
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
        message: this.$t('nft_gift_class_not_found'),
      });
      return;
    }
    if (redirect && query.type === 'nft_book') {
      const items = this.cartItems.length
        ? this.cartItems.map(item => {
            const { classId, collectionId, price, quantity = 1 } = item;
            const name = classId
              ? this.getNFTClassMetadataById(classId)?.name
              : this.getNFTCollectionInfoByCollectionId(collectionId)?.name[
                  this.collectionLocale
                ];
            return {
              name,
              classId,
              collectionId,
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
      logTrackerEvent(
        this,
        'NFT',
        'nft_gift_purchase_success',
        this.productId,
        1
      );
      this.$router.replace({
        ...this.$route,
        query,
      });
    }
  },
  methods: {
    ...mapActions(['clearBookProductShoppingCart']),
    handleClickViewDetails() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_gift_view_details_clicked',
        this.productId,
        1
      );
    },
    handleClickViewClass() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_gift_view_class_button_clicked',
        this.productId,
        1
      );
      this.$router.push(this.viewInfoLocation);
    },
  },
};
</script>
