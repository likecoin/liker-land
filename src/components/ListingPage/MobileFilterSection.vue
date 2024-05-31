<template>
  <div class="flex flex-col">
    <ListingPageFilterSection
      :is-mobile="true"
      :selected-type="filterType"
      :selected-price="filterPrice"
      :selected-language="filterLanguage"
      @change-type="handleTypeChange"
      @change-price="handlePriceChange"
      @change-language="handleSelectLanguage"
    />

    <footer class="grid grid-cols-2 gap-[12px] px-[12px]">
      <ButtonV2 preset="tertiary" @click="handleReset">{{
        $t('listing_page_button_reset')
      }}</ButtonV2>
      <ButtonV2 @click="handleConfirm">{{
        $t('listing_page_button_confirm')
      }}</ButtonV2>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MobileFilterSection',
  props: {
    selectedType: {
      type: String,
      default: undefined,
    },
    selectedPrice: {
      type: String,
      default: undefined,
    },
    selectedLanguage: {
      type: String,
      default: undefined,
    },
    defaultType: {
      type: String,
      default: undefined,
    },
    defaultPrice: {
      type: String,
      default: undefined,
    },
    defaultLanguage: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      filterType: this.selectedType,
      filterPrice: this.selectedPrice,
      filterLanguage: this.selectedLanguage,
    };
  },
  methods: {
    handleTypeChange(value) {
      this.filterType = value;
    },
    handlePriceChange(value) {
      this.filterPrice = value;
    },
    handleSelectLanguage(value) {
      this.filterLanguage = value;
    },
    handleReset() {
      this.filterType = this.defaultType;
      this.filterPrice = this.defaultPrice;
      this.filterLanguage = this.defaultLanguage;
    },
    handleConfirm() {
      this.$emit('change-type', this.filterType);
      this.$emit('change-price', this.filterPrice);
      this.$emit('change-language', this.filterLanguage);
      this.$emit('close');
    },
  },
};
</script>
