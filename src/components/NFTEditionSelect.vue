<template>
  <div
    :class="[
      isSoldAllOut ? 'bg-white' : 'bg-like-green',
      'rounded-[24px]',
      isSingleItem || isSoldAllOut ? 'px-[20px] py-[8px]' : 'p-[12px] sm:p-[24px] pt-[4px] sm:pt-[16px] pb-[14px]',
    ]"
  >
    <table
      v-if="!isSingleItem && !isSoldAllOut"
      class="border-separate border-spacing-y-[8px] mb-[8px]"
    >
      <tbody>
        <NFTEditionSelectItem
          v-for="(item, index) in items"
          :key="index"
          :name="item.name"
          :price-label="item.priceLabel"
          :stock="item.stock"
          :is-selected="item.value === selectedValue"
          @click="handleClickPriceSelectItem(item)"
        />
      </tbody>
    </table>

    <div
      :class="[
        'flex',
        'justify-between',
        'items-center',
        'gap-[12px] sm:gap-x-[24px]',
        'flex-col sm:flex-row',
      ]"
    >
      <ButtonV2
        v-if="!isSingleItem && !isSoldAllOut"
        preset="plain"
        class="text-white underline"
        :text="$t('nft_edition_select_compare_button_text')"
        @click="handleClickCompareItemsButton"
      />
      <template v-else>
        <span
          v-if="!isSoldAllOut"
          class="text-white"
        >{{ priceLabel }}</span>
        <NFTStockLabel :stock="stock" />
      </template>

      <ButtonV2
        v-if="isSoldAllOut"
        preset="outline"
        :text="$t('nft_edition_select_notify_button_text')"
        @click="handleClickNotifyButton"
      >
        <template #prepend>
          <NotifyIcon class="w-[16px]" />
        </template>
      </ButtonV2>
      <ButtonV2
        v-else
        preset="secondary"
        :text="$t('nft_edition_select_confirm_button_text')"
        @click="handleClickCollectButton"
      >
        <template #prepend>
          <NFTWidgetIconInsertCoin class="w-[16px]" />
        </template>
      </ButtonV2>
    </div>
  </div>
</template>

<script>
import ButtonV2 from './ButtonV2';
import NotifyIcon from './Icon/Notify';
import NFTEditionSelectItem from './NFTEditionSelectItem';
import NFTStockLabel from './NFTStockLabel';
import NFTWidgetIconInsertCoin from './NFTWidget/Icon/InsertCoin';

export default {
  name: 'NFTPriceSelect',
  components: {
    ButtonV2,
    NotifyIcon,
    NFTEditionSelectItem,
    NFTStockLabel,
    NFTWidgetIconInsertCoin,
  },
  props: {
    items: {
      type: Array,
      validator(items) {
        if (!items.length) return true;
        return items.every(
          item =>
            item.value &&
            item.name &&
            item.priceLabel &&
            !Number.isNaN(item.stock) &&
            item.stock >= 0
        );
      },
      default: () => [],
    },
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedValue: this.value || this.items[0]?.value,
    };
  },
  computed: {
    isSingleItem() {
      return this.items.length === 1;
    },
    selectedItem() {
      return this.items.find(item => item.value === this.value);
    },
    stock() {
      return this.selectedItem?.stock;
    },
    priceLabel() {
      return this.selectedItem?.priceLabel;
    },
    isSoldAllOut() {
      return this.items.every(item => item.stock === 0);
    },
  },
  methods: {
    handleClickPriceSelectItem({ value }) {
      this.selectedValue = value;
      this.$emit('update:value', value);
    },
    handleClickCollectButton() {
      this.$emit('click-collect', this.selectedValue);
    },
    handleClickNotifyButton() {
      this.$emit('click-notify');
    },
    handleClickCompareItemsButton() {
      this.$emit('click-compare');
    },
  },
};
</script>
