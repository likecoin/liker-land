<template>
  <tr
    :class="[
      'group',
      'rounded-[16px]',
      'text-[16px]',
      'align-middle',
      isInStock ? 'cursor-pointer' : 'opacity-50 pointer-events-none',
    ]"
    @click="$emit('click', $event)"
  >
    <td
      :class="[
        'w-[64px]',
        'pl-[8px] sm:pl-[14px]',
        'pr-[8px] sm:pr-[24px]',
        'py-[14px]',
        'border-r-0',
        'rounded-l-[16px]',
        cellClasses,
      ]"
    >
      <svg
        class="w-[24px] h-[24px] text-like-cyan-light"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <circle
          :class="['transition-opacity', { 'opacity-0': !isSelected }]"
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
        />
      </svg>
    </td>
    <td
      :class="['pr-[12px]', 'border-x-0', 'text-like-cyan-light', cellClasses]"
    >
      <div>{{ name }}</div>
      <div
        :class="[
          'sm:hidden',
          'text-white',
          'flex',
          'items-center',
          'justify-start',
          'w-full',
          'gap-[12px]',
        ]"
      >
        <span>
          {{ priceLabel }}
        </span>
        <div
          v-if="discountInfo"
          class="flex justify-start items-center gap-[4px]"
        >
          <span
            class="text-shade-gray line-through font-400 text-[12px] text-right"
          >
            {{ discountInfo.originalPriceLabel }}
          </span>
          <span class="text-like-cyan-light font-400 text-[12px] text-right">
            {{
              $t('nft_collect_modal_method_like_discount', {
                percentage: discountInfo.discountPercentage,
              })
            }}
          </span>
        </div>
      </div>
    </td>
    <td
      :class="[
        'phone:hidden',
        'pr-[12px]',
        'border-x-0',
        'text-white',
        'text-right',
        cellClasses,
      ]"
    >
      <div class="flex items-center justify-end w-full gap-[12px]">
        <div
          v-if="discountInfo"
          class="flex justify-end items-center gap-[4px]"
        >
          <span
            class="text-shade-gray line-through font-400 text-[12px] text-right"
          >
            {{ discountInfo.originalPriceLabel }}
          </span>
          <span class="text-like-cyan-light font-400 text-[12px] text-right">
            {{
              $t('nft_collect_modal_method_like_discount', {
                percentage: discountInfo.discountPercentage,
              })
            }}
          </span>
        </div>
        <span>{{ priceLabel }}</span>
      </div>
    </td>
    <td
      :class="[
        'pr-[8px] sm:pr-[14px]',
        'border-l-0',
        'rounded-r-[16px]',
        'text-right',
        cellClasses,
      ]"
    >
      <NFTStockLabel :stock="stock" />
    </td>
  </tr>
</template>

<script>
import { formatNumberWithUSD, formatNumberWithUnit } from '~/util/ui';
import { USD_TO_HKD_RATIO } from '~/constant';
import NFTStockLabel from './NFTStockLabel';

export default {
  name: 'NFTPriceSelectItem',
  components: {
    NFTStockLabel,
  },
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
      default: 0,
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
        discountPercentage: `-${discountPercentage}`,
      };
    },
  },
};
</script>
