<template>
  <tr
    :class="[
      'group',
      {
        'hidden laptop:table-row': !isActive,
      }
    ]"
  >
    <td class="w-[64px] py-[8px]">
      <div :class="priceLabelClass">
        <hr
          v-if="isActive"
          class="
            absolute
            top-1/2
            inset-x-0
            border-[1px] border-like-cyan-light
            -mr-[12px]
            laptop:-ml-[18px]
            translate-y-[-50%]
          "
        >
        <span class="relative">{{ priceLabel }}</span>
      </div>
    </td>
    <td class="pl-[12px] py-[4px]">
      <div
        :class="slotContainerClass"
        @click="handleClick"
      >
        <div
          :class="[
            'grid',
            'grid-cols-10',
            'gap-[12px]',
            'pl-[12px]',
            'pr-[48px]',
            'py-[8px]',
          ]"
        >
          <NFTCampaignPricingSlot
            v-for="i in total"
            :key="i"
            :type="getSlotType(i)"
          />
        </div>
        <div :class="hoverLabelClass">
          <hr v-if="!isActive" :class="hoverLabelStrikethroughClass">
          <span class="mx-[8px]">{{ getHoverLabel }}</span>
          <hr v-if="!isActive" :class="hoverLabelStrikethroughClass">
        </div>
        <div
          v-if="isActive"
          class="
            flex
            items-center
            absolute
            inset-y-0
            right-0
            mr-[16px]
            text-[12px] text-medium-gray
            leading-[5/3]
          "
        >
          {{ available }} left
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'next',
    },
    price: {
      type: Number,
      default: 0,
    },
    available: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    isActive() {
      return this.type === 'active';
    },
    isPast() {
      return this.type === 'past';
    },
    priceLabel() {
      return `${this.price} $LIKE`;
    },
    priceLabelClass() {
      return [
        'relative',
        'rounded-full',
        'text-center',
        'text-[10px]',
        'leading-[2]',
        'font-600',
        'group-hover',
      ].concat(this.priceLabelClassForType);
    },
    priceLabelClassForType() {
      switch (this.type) {
        case 'past':
          return ['text-medium-gray'];
        case 'active':
          return ['text-like-green', 'bg-like-cyan-light'];
        case 'future':
          return ['text-dark-gray'];
        default:
          return [];
      }
    },
    slotContainerClass() {
      return [
        'relative',
        'flex',
        'items-center',
        'rounded-[8px]',
        this.isActive ? 'bg-white' : 'bg-shade-gray',
        'outline-[2px]',
        {
          outline: this.isActive,
          'outline-like-cyan-light': this.isActive,
        },
      ];
    },
    getHoverLabel() {
      switch (this.type) {
        case 'past':
          return 'Sold Out';
        case 'active':
          return 'Collect Now';
        case 'future':
          return 'Upcoming Price';
        default:
          return '';
      }
    },
    hoverLabelClass() {
      return [
        'group-hover:opacity-100',
        'transition-all',
        'absolute',
        'inset-0',
        'flex',
        'px-[8px]',
        'items-center',
        'justify-center',
        'text-[12px]',
        'font-600',
        this.isActive ? 'text-like-green' : 'text-medium-gray',
        {
          'opacity-0': !this.isPast,
          'cursor-pointer': this.isActive,
          'bg-like-cyan-pale': this.isActive,
          'active:bg-like-cyan-light': this.isActive,
          'bg-opacity-[0.8]': this.isActive,
        },
      ];
    },
    hoverLabelStrikethroughClass() {
      return [
        'flex',
        'grow',
        this.isPast ? 'border-solid' : 'border-dashed',
        {
          'border-[0.5px]': !this.isActive,
        },
      ];
    },
  },
  methods: {
    getSlotType(i) {
      if (this.isActive) {
        return this.total - this.available + 1 <= i ? 'active' : 'past';
      }
      return this.type;
    },
    handleClick() {
      if (this.isActive) {
        this.$emit('collect');
      }
    },
  },
};
</script>
