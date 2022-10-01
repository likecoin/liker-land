<template>
  <tr
    :class="[
      'group',
      {
        'hidden laptop:table-row': !isActive && shouldCollapseInMobile,
      }
    ]"
  >
    <td class="w-[64px]">
      <div :class="priceLabelClass">
        <hr
          v-if="isActive && shouldShowIndicator"
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
        <span class="relative">{{ priceLabel }}</span>&nbsp;
        <span class="relative text-[0.8em] leading-[1.5]">LIKE</span>
      </div>
    </td>
    <td class="pl-[12px] py-[4px]">
      <div
        :class="slotContainerClass"
        @click="handleClick"
      >
        <div
          :class="[
            'flex',
            'flex-wrap',
            'gap-[10px]',
            'items-center',
            'pl-[8px]',
            'laptop:pl-[12px]',
            'pr-[48px]',
            'py-[8px]',
          ]"
        >
          <div
            v-for="i in total"
            :key="i"
            :class="[
              'relative',
              'border-l-[0.5px]',
              i > 1 && i % 10 === 1
                ? 'border-dark-gray border-opacity-[0.4] border-dashed pl-[5px] -ml-[5px]'
                : 'border-transparent',
            ]"
          >
            <!-- Show the number of the slot for every 10 slots -->
            <span
              v-if="i > 1 && i % 10 === 1"
              :class="[
                'absolute',
                'right-full',
                'bottom-full',

                'translate-x-1/2',

                'text-dark-gray',
                'text-[5px]',
                'text-center',
                'font-bold',

                'opacity-[0.4]',
              ]"
            >{{ i - 1 }}</span>
            <NFTSupplySlot :type="getSlotType(i)" />
          </div>
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
            mr-[6px]
            laptop:mr-[12px]
            text-[10px]
            laptop:text-[12px]
            text-medium-gray
            leading-[5/3]
          "
        >{{ available }} left</div>
      </div>
    </td>
  </tr>
</template>

<script>
import NFTSupplySlot from './Slot';

export default {
  components: {
    NFTSupplySlot,
  },
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
    shouldShowIndicator: {
      type: Boolean,
      default: false,
    },
    shouldCollapseInMobile: {
      type: Boolean,
      default: false,
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
      return `${Math.ceil(this.price).toLocaleString('en-US')}`;
    },
    priceLabelClass() {
      return [
        'relative',
        'flex',
        'flex-wrap',
        'justify-center',
        'items-center',
        'rounded-[10px]',
        'text-center',
        'text-[10px]',
        'leading-[1]',
        'p-[4px]',
        'min-h-[20px]',
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
        {
          'shadow-[0_0_0_2px_#aaf1e7]': this.isActive,
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
        'rounded-[8px]',
        'items-center',
        'justify-center',
        'text-[12px]',
        'font-600',
        this.isActive ? 'text-like-green' : 'text-medium-gray',
        this.isActive ? 'bg-like-cyan-pale' : 'bg-light-gray',
        this.isActive ? 'bg-opacity-[0.8]' : 'bg-opacity-[0.5]',
        {
          'opacity-0': !this.isPast,
          'cursor-pointer': this.isActive,
          'active:bg-like-cyan-light': this.isActive,
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
