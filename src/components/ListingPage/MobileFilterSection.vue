<template>
  <div class="flex flex-col">
    <Label
      :text="$t('listing_page_filter')"
      align="center"
      class="mb-[12px] text-[18px] font-600"
    />
    <div class="w-full border-b-[1px] border-shade-gray my-[8px]" />
    <ListingPageFilterSection
      :is-mobile="true"
      :selected-type="selectedType"
      :selected-price="selectedPrice"
      :selected-language="selectedLanguage"
      v-on="$listeners"
    />
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
  data() {
    return {
      filterType: '',
      filterPrice: '',
      filterLanguage: '',
    };
  },
};
</script>
