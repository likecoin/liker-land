<template>
  <div :class="rootClasses">
    <table
      v-if="(!isSingleItem || (isSingleItem && items[0].name)) && !isAllSoldOut"
      class="border-separate border-spacing-y-[8px] mb-[8px] w-full"
    >
      <tbody>
        <NFTEditionSelectItem
          v-for="(item, index) in items"
          :key="index"
          :name="item.name"
          :currency="item.currency"
          :price-label="item.priceLabel"
          :stock="item.stock"
          :is-selected="item.value === selectedValue"
          :current-price="item.price"
          :default-price="item.defaultPrice"
          @click="handleClickPriceSelectItem(item)"
        />
      </tbody>
    </table>

    <div
      :class="[
        'flex',
        'flex-wrap',
        'justify-end',
        'items-stretch sm:items-center',
        'gap-[12px]',
        'flex-col sm:flex-row',
      ]"
    >
      <ButtonV2
        v-if="!isAllSoldOut"
        preset="plain"
        class="text-white underline max-638:order-1"
        :text="
          $t(
            isSingleItem
              ? 'nft_edition_view_edition_button_text'
              : 'nft_edition_select_compare_button_text'
          )
        "
        @click="handleClickCompareItemsButton"
      />
      <template v-if="isSingleItem || isAllSoldOut">
        <span v-if="isSingleItem && !items[0].name" class="text-white">{{
          priceLabel
        }}</span>
        <NFTStockLabel
          v-if="items.length > 1 || isAllSoldOut"
          :stock="stock"
          :is-dark="!isAllSoldOut"
        />
      </template>

      <ButtonV2
        v-if="
          !isAllSoldOut &&
            selectedItem.price > 0 &&
            !selectedItem.isPhysicalOnly
        "
        :is-disabled="!selectedItem"
        preset="secondary"
        :text="$t('nft_edition_select_confirm_button_text_gift')"
        @click="handleClickGiftButton"
      >
        <template #prepend>
          <IconGift class="w-[16px]" />
        </template>
      </ButtonV2>
      <ButtonV2
        v-if="!isAllSoldOut"
        :is-disabled="!selectedItem"
        preset="secondary"
        :text="$t('nft_edition_select_confirm_button_text_purchase')"
        @click="handleClickCollectButton"
      >
        <template #prepend>
          <NFTWidgetIconInsertCoin class="w-[16px]" />
        </template>
      </ButtonV2>
      <ButtonV2
        v-if="
          !isAllSoldOut && selectedItem.price > 0 && !selectedItem.hasShipping
        "
        :is-disabled="!selectedItem"
        preset="secondary"
        :text="$t('nft_edition_select_confirm_button_text_add_to_cart')"
        @click="handleClickAddToCartButton"
      >
        <template #prepend>
          <IconAdd class="w-[16px]" />
        </template>
      </ButtonV2>
      <ButtonV2
        v-else-if="shouldShowNotifyButton"
        preset="outline"
        :text="$t('nft_edition_select_notify_button_text')"
        @click="handleClickNotifyButton"
      >
        <template #prepend>
          <NotifyIcon class="w-[16px]" />
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
  name: 'NFTEditionSelect',
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
            item.value >= 0 &&
            item.name &&
            item.priceLabel &&
            !Number.isNaN(item.stock) &&
            item.stock >= 0
        );
      },
      default: () => [],
    },
    value: {
      type: Number,
      default: 0,
    },
    shouldShowNotifyButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    // NOTE: If the selected item is out of stock, select another item.
    const items = [...this.items];
    let selectedItem = items.find(item => item.value === this.value);
    if (!selectedItem || selectedItem.stock <= 0) {
      selectedItem = items.find(
        item =>
          selectedItem && item.index !== selectedItem.index && item.stock > 0
      );
    }
    return {
      selectedValue: selectedItem?.value || this.value,
    };
  },
  computed: {
    rootClasses() {
      const classes = [
        this.isAllSoldOut ? 'bg-gray-f7' : 'bg-like-green',
        'rounded-[16px]',
      ];
      if (this.isAllSoldOut) {
        classes.push('p-[24px]');
      } else if (this.isSingleItem) {
        classes.push('px-[20px]', 'py-[20px] sm:pt-[16px] sm:pb-[24px]');
      } else {
        classes.push(
          'p-[12px] sm:p-[24px]',
          'pt-[4px] sm:pt-[16px]',
          'pb-[16px]'
        );
      }
      return classes;
    },
    isSingleItem() {
      return this.items.length === 1;
    },
    selectedItem() {
      return this.items.find(item => item.value === this.selectedValue);
    },
    stock() {
      return this.selectedItem?.stock;
    },
    priceLabel() {
      return this.selectedItem?.priceLabel;
    },
    isAllSoldOut() {
      return this.items.every(
        item => item.stock === 0 || item.priceLabel === undefined
      );
    },
  },
  mounted() {
    if (this.selectedValue !== this.value) {
      this.$emit('update:value', this.selectedValue);
    }
  },
  methods: {
    handleClickPriceSelectItem({ value }) {
      if (this.selectedValue === value) return;
      this.selectedValue = value;
      this.$emit('change', value);
      this.$emit('update:value', value);
      this.$emit('reset-custom-price');
    },
    handleClickGiftButton() {
      this.$emit('click-gift', this.selectedValue);
    },
    handleClickCollectButton() {
      this.$emit('click-collect', this.selectedValue);
    },
    handleClickAddToCartButton() {
      this.$emit('click-add-to-cart', this.selectedValue);
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
