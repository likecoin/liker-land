<template>
  <tr
    :class="[
      'group',
      'rounded-[16px]',
      'text-[16px]',
      'align-middle',
      isInStock ? 'cursor-pointer' : 'opacity-50 pointer-events-none'
    ]"
    @click="$emit('click', $event)"
  >
    <td
      :class="[
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
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
        />
        <circle
          :class="[
            'transition-opacity',
            { 'opacity-0': !isSelected },
          ]"
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
        />
      </svg>
    </td>
    <td
      :class="[
        'pr-[12px]',
        'border-x-0',
        'text-like-cyan-light',
        cellClasses,
      ]"
    >
      <div>{{ name }}</div>
      <div
        :class="[
          'sm:hidden',
          'text-white',
        ]"
      >{{ priceLabel }}</div>
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
    >{{ priceLabel }}</td>
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
  },
};
</script>
