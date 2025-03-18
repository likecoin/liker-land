<template>
  <div class="flex flex-col gap-[12px] w-full flex-wrap">
    <div
      class="text-[18px] font-500 text-dark-gray w-full"
      v-text="$t('nft_edition_select_section_label')"
    />

    <div class="flex items-stretch gap-[12px] w-full flex-wrap">
      <NFTEditionSelectItemV2
        v-for="(item, index) in items"
        :key="index"
        :name="item.name"
        :price-label="item.priceLabel"
        :stock="item.stock"
        :is-selected="item.value === selectedValue"
        :current-price="item.price"
        :default-price="item.defaultPrice"
        @click="handleClickPriceSelectItem(item)"
      />
    </div>
    <div class="flex items-stretch gap-[12px] w-full min-h-[56px] mt-[12px]">
      <ButtonV2
        v-if="!isAllSoldOut"
        :is-disabled="!selectedItem"
        preset="primary"
        class="w-[60%] laptop:w-[260px]"
        @click="handleClickAddToCartButton"
      >
        <IconAdd class="w-[16px]" />
        <p
          class="ml-[8px]"
          v-text="$t('nft_edition_select_confirm_button_text_add_to_cart')"
        />
      </ButtonV2>
      <ButtonV2
        v-if="!isAllSoldOut"
        :is-disabled="!selectedItem"
        class="w-[40%] laptop:w-[144px]"
        preset="secondary"
        :text="$t('nft_edition_select_confirm_button_text_purchase')"
        @click="handleClickCollectButton"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'NFTEditionSelect',
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
    isAllSoldOut: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // NOTE: If the selected item is out of stock, select another item.
    let selectedItem = this.items.find(item => item.value === this.value);
    if (!selectedItem || selectedItem.stock <= 0) {
      selectedItem = this.items.find(
        item =>
          selectedItem && item.index !== selectedItem.index && item.stock > 0
      );
    }
    return {
      selectedValue: selectedItem?.value ?? this.value,
    };
  },
  computed: {
    selectedItem() {
      return this.items.find(item => item.value === this.selectedValue);
    },
    stock() {
      return this.selectedItem?.stock;
    },
    priceLabel() {
      return this.selectedItem?.priceLabel;
    },
  },
  watch: {
    value() {
      this.selectedValue = this.value;
    },
  },
  mounted() {
    if (this.selectedValue !== this.value) {
      this.$emit('change', this.selectedValue);
    }
  },
  methods: {
    handleClickPriceSelectItem({ value }) {
      if (this.selectedValue === value) return;
      this.selectedValue = value;
      this.$emit('change', value);
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
