<template>
  <div
    :class="[
      'grid',
      'grid-cols-12',
      'gap-[1em]',
      'sm:pl-[1em]',
      'sm:pr-[0.5em]',
      'py-[1.5em]',
      { 'animate-pulse': isFetching },
    ]"
  >
    <div
      :class="[
        'col-span-1 laptop:col-span-2',
        'flex',
        'flex-col laptop:flex-row',
        'items-start',
        'gap-[.5em]',
      ]"
    >
      <span class="min-w-[2em] text-gray-9b">{{ index }}</span>
      <NuxtLink class="hidden laptop:block" :to="viewInfoLocation">
        <NFTCover
          class="rounded-[4px] overflow-hidden shrink"
          :src="productImageUrl"
        />
      </NuxtLink>
    </div>
    <!--
    <div class="col-span-6 laptop:col-span-5">
    -->
    <div class="col-span-8 laptop:col-span-7">
      <NuxtLink class="block laptop:hidden mb-[.75em]" :to="viewInfoLocation">
        <NFTCover
          class="rounded-[4px] overflow-hidden shrink"
          :src="productImageUrl"
        />
      </NuxtLink>
      <div class="line-clamp-2 font-[600]">
        <NuxtLink :to="viewInfoLocation">{{ productName }}</NuxtLink>
      </div>
      <div class="line-clamp-2 mt-[.5em] text-gray-9b">
        <NuxtLink :to="viewInfoLocation">{{ productDescription }}</NuxtLink>
      </div>
      <NuxtLink
        class="flex items-center group text-like-green mt-[.5rem]"
        :to="
          productOwner
            ? localeLocation({
                name: 'id',
                params: { id: productOwner },
                query: { tab: 'created' },
              })
            : ''
        "
      >
        <Identity
          :avatar-url="productCreator"
          :avatar-size="32"
          :is-avatar-disabled="true"
          :is-avatar-outlined="isCreatorCivicLiker"
          :is-lazy-loaded="true"
        />
        <span class="ml-[8px] group-hover:underline font-[600]">{{
          productCreatorDisplayName | ellipsis
        }}</span>
      </NuxtLink>
    </div>
    <div class="col-span-2 text-center text-like-green font-proxima font-[600]">
      {{ (customPrice || productPrice) | formatNumberWithUSD }}
    </div>
    <!--
    <div class="col-span-2 text-center">{{ quantity }}</div>
    -->
    <div class="col-span-1 flex justify-end mt-[-.25em]">
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
</template>

<script>
import { ellipsis, formatNumberWithUSD } from '~/util/ui';

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
      default: 0,
    },
  },
  data() {
    return {
      isFetching: false,
    };
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
      this.$emit('remove', this.productId);
    },
  },
};
</script>
