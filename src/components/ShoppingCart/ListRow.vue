<template>
  <div class="w-ful pb-[1.0em]">
    <div
      :class="[
        'grid',
        'grid-cols-12',
        'gap-[8px] sm:gap-[1em]',
        'sm:pl-[1em]',
        'sm:pr-[0.5em]',
        'pt-[1.5em]',
        { 'animate-pulse': isFetching },
      ]"
    >
      <!-- index -->
      <div class="col-span-1 min-w-[2em] text-gray-9b">
        {{ index }}
      </div>
      <!-- product info -->
      <div
        :class="[
          'col-span-6',

          'flex',
          'items-start',
          'justify-start',
          'gap-[8px] sm:gap-[12px]',
        ]"
      >
        <NuxtLink
          :class="[
            'block',
            'flex-shrink-0',
            'w-full',
            'max-w-[10vw] laptop:max-w-[80px]',
            'object-contain',
          ]"
          :to="viewInfoLocation"
          @click.native="handleClickProductImage"
        >
          <NFTCover
            class="rounded-[4px] overflow-hidden shrink"
            :src="productImageUrl"
          />
        </NuxtLink>
        <div class="flex flex-col flex-shrink gap-[6px] laptop:gap-[8px]">
          <div class="line-clamp-3 text-[14px] font-[600]">
            <NuxtLink
              :to="viewInfoLocation"
              @click.native="handleClickProductName"
              >{{ productName }}</NuxtLink
            >
          </div>
          <div class="text-dark-gray text-[12px] font-[500]">
            {{ purchaseChannel }}
          </div>
          <NuxtLink
            :class="[
              'flex',
              'flex-col laptop:flex-row',
              'items-start laptop:items-center',
              'gap-[4px] laptop:gap-[8px]',
              'group',
              'text-like-green',
            ]"
            :to="
              productOwner
                ? localeLocation({
                    name: 'id',
                    params: { id: productOwner },
                    query: { tab: 'created' },
                  })
                : ''
            "
            @click.native="handleClickProductOwner"
          >
            <Identity
              :class="['!hidden laptop:!flex']"
              :avatar-url="productCreatorAvatar"
              :avatar-size="32"
              :is-avatar-disabled="true"
              :is-avatar-outlined="isCreatorCivicLiker"
              :is-lazy-loaded="true"
            />
            <span
              :class="[
                'font-[400]',
                'text-[12px]',
                'text-medium-gray',
                'laptop:hidden',
              ]"
              >{{ $t('identity_type_publisher') }}</span
            >
            <span class="group-hover:underline font-[600]">{{
              productCreatorDisplayName | ellipsis
            }}</span>
          </NuxtLink>
        </div>
      </div>
      <!-- quantity -->
      <div class="col-span-2 col-start-8 text-center">
        {{ quantity }}
      </div>
      <!-- price -->
      <div
        class="col-start-10 col-end-12 text-center text-like-green font-proxima font-[600]"
      >
        {{ (customPrice || unitPrice) | formatNumberWithUSD }}
      </div>
      <!-- remove button -->
      <div class="col-span-1 flex justify-end -mt-[8px]">
        <ButtonV2
          preset="plain"
          size="mini"
          :circle="true"
          @click="handleClickRemoveButton"
        >
          <IconClose class="w-[20px] text-gray-4a" />
        </ButtonV2>
      </div>
    </div>
    <div
      v-if="tippingAmount"
      class="flex items-center justify-end gap-[0.3em] w-full"
    >
      <IconPriceMini class=" text-airdrop-gold" />
      <p class="text-[12px] text-medium-gray pr-[1em]">
        {{ $t('cart_item_tipping', { amount: tippingAmount }) }}
      </p>
    </div>
  </div>
</template>

<script>
import { ellipsis, formatNumberWithUSD } from '~/util/ui';
import { logTrackerEvent } from '~/util/EventLogger';
import { NFT_BOOK_PLATFORM_LIKER_LAND } from '~/constant';

import nftOrCollection from '~/mixins/nft-or-collection';

export default {
  name: 'ShoppingCartListRow',
  filters: {
    ellipsis,
    formatNumberWithUSD,
  },
  mixins: [nftOrCollection],
  props: {
    classId: {
      type: String,
      default: '',
    },
    priceIndex: {
      type: Number,
      default: 0,
    },
    collectionId: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      required: true,
    },
    customPrice: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isFetching: false,
    };
  },
  computed: {
    purchaseChannel() {
      return this.from && this.from !== NFT_BOOK_PLATFORM_LIKER_LAND
        ? this.$t('cart_purchase_channel', { from: this.from })
        : '';
    },
    tippingAmount() {
      return Math.max(this.customPrice - this.unitPrice, 0);
    },
    unitPrice() {
      const prices = this.getNFTBookStorePricesByClassId(this.classId);
      return prices?.[this.priceIndex]?.price || this.productPrice;
    },
  },
  mounted() {
    this.fetchInfo();
  },
  methods: {
    async fetchInfo() {
      try {
        this.isFetching = true;
        if (this.collectionId) {
          await Promise.all([
            this.lazyFetchNFTCollectionInfo(),
            this.lazyFetchNFTCollectionPaymentPriceInfo(),
          ]);
        } else {
          await Promise.all([
            this.lazyFetchNFTClassAggregatedData(),
            this.lazyFetchNFTBookPaymentPriceInfo(),
          ]);
        }
      } finally {
        this.isFetching = false;
      }
    },
    handleClickRemoveButton() {
      const item = {
        productId: this.productId,
        classId: this.classId,
        priceIndex: this.priceIndex,
        collectionId: this.collectionId,
        name: this.productName,
        quantity: this.quantity || 1,
        price: this.customPrice || this.unitPrice,
      };
      this.$emit('remove', item);
    },
    handleClickProductImage() {
      logTrackerEvent(
        this,
        'shopping_cart',
        'shopping_cart_product_image_click',
        this.productId,
        1
      );
    },
    handleClickProductName() {
      logTrackerEvent(
        this,
        'shopping_cart',
        'shopping_cart_product_name_click',
        this.productId,
        1
      );
    },
    handleClickProductOwner() {
      logTrackerEvent(
        this,
        'shopping_cart',
        'shopping_cart_product_owner_click',
        this.productOwner,
        1
      );
    },
  },
};
</script>
