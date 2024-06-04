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
  },
  computed: {
    filterType: {
      get() {
        return this.selectedType;
      },
      set(value) {
        this.$emit('change-type', value);
      },
    },
    filterPrice: {
      get() {
        return this.selectedPrice;
      },
      set(value) {
        this.$emit('change-price', value);
      },
    },
    filterLanguage: {
      get() {
        return this.selectedLanguage;
      },
      set(value) {
        this.$emit('change-language', value);
      },
    },
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
      this.$emit('reset');
    },
    handleConfirm() {
      this.$emit('close');
    },
  },
};
</script>
