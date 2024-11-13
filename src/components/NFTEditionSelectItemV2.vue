<template>
  <div
    :class="[
      'group',
      isInStock ? 'cursor-pointer' : 'opacity-50 pointer-events-none',
      'rounded-[16px]',
      preset === 'dialog' ? 'w-full' : 'w-full desktop:w-[48%]',
      'py-[18px] px-[24px]',
      isSelected ? 'bg-[#E5F0F2]' : 'bg-gray-f7',
      isSelected
        ? 'border-[2px] border-like-green'
        : 'border-shade-gray border-[1px] hover:border-[#d1d1d1] transition-all duration-75',
      'flex items-center justify-between gap-[16px]',
    ]"
    @click="$emit('click', $event)"
  >
    <div class="flex items-center gap-[16px]">
      <div class="relative">
        <div
          class="w-[20px] h-[20px] rounded-full bg-white border-shade-gray border-[1px]"
        />
        <IconCircleCheck
          v-if="isSelected"
          class="text-like-green w-[20px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div class="flex flex-col gap-[4px]">
        <div class="flex gap-[8px] items-center">
          <NFTDiscountLabel v-if="discountInfo" :discount-info="discountInfo" />
          <NFTStockLabel :stock="stock" />
        </div>
        <div class="text-like-green text-[16px] font-500">{{ name }}</div>
      </div>
    </div>

    <div class="flex flex-col whitespace-nowrap">
      <div v-if="discountInfo" class="text-like-green text-[12px]">
        {{ discountInfo.originalPriceLabel }}
      </div>
      <div class="text-like-green text-[16px] font-500">
        {{ priceLabel }}
      </div>
    </div>
  </div>
</template>

<script>
import { formatNumberWithUSD, formatNumberWithUnit } from '~/util/ui';
import { USD_TO_HKD_RATIO } from '~/constant';

const PRESET_TYPE = {
  PRIMARY: 'primary',
  DIALOG: 'dialog',
};

export default {
  name: 'NFTEditionSelectItemV2',
  props: {
    name: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    priceLabel: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      default: 0,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
    defaultPrice: {
      type: Number,
      default: 900,
    },
    preset: {
      type: String,
      default: PRESET_TYPE.PRIMARY,
    },
  },
  computed: {
    isInStock() {
      return this.stock > 0;
    },
    cellClasses() {
      return [
        'group-hover:bg-like-cyan-light/[0.1]',
        'group-active:bg-like-cyan-light/[0.2]',
        'border-[2px]',
        this.isInStock && this.isSelected
          ? 'border-like-cyan-light'
          : 'border-transparent',
        { 'group-hover:border-like-cyan-light/50': !this.isSelected },
        'transition-colors',
      ];
    },
    discountInfo() {
      const originalPrice = this.defaultPrice;
      const { currentPrice } = this;
      if (!currentPrice || originalPrice <= currentPrice) {
        return undefined;
      }

      const discountAmount = originalPrice - currentPrice;
      const discountPercentage = Math.ceil(
        (discountAmount / originalPrice) * 100
      );

      return {
        originalPriceLabel:
          this.currency === 'HKD'
            ? formatNumberWithUnit(
                Number((originalPrice * USD_TO_HKD_RATIO).toFixed(1)),
                'HKD'
              )
            : formatNumberWithUSD(originalPrice),
        discountPercentage,
      };
    },
  },
};
</script>
