<template>
  <div
    v-bind="$attrs"
    :class="[
      'px-[20px]',
      'py-[24px]',
      'rounded-[12px]',
      'bg-white',
      { 'shadow-md': !isMobile },
    ]"
  >
    <div class="flex flex-col gap-[28px]">
      <!-- Type -->
      <div
        class="flex flex-col items-start justify-center gap-[16px] desktopLg:flex-row desktopLg:items-center desktopLg:justify-start"
      >
        <Label
          class="whitespace-nowrap"
          :text="$t('listing_page_filter_type_title')"
        />
        <ListingPageOptionList
          :value="filterType"
          :items="filterTypeList"
          @update:value="handleTypeChange"
        />
      </div>
      <!-- Price -->
      <div
        class="flex flex-col items-start justify-center gap-[16px] desktopLg:flex-row desktopLg:items-center desktopLg:justify-start"
      >
        <Label
          class="whitespace-nowrap"
          :text="$t('listing_page_filter_price_title')"
        />
        <ListingPageOptionList
          :value="filterPrice"
          :items="filterPriceList"
          @update:value="handlePriceChange"
        />
      </div>
      <!-- Language -->
      <!-- Not supported yet
      <div
        class="flex flex-col items-start justify-center gap-[16px] desktopLg:flex-row desktopLg:items-center desktopLg:justify-start"
      >
        <Label
          class="whitespace-nowrap"
          :text="$t('listing_page_select_language_title')"
        />
        <Dropdown :class="[{ hidden: isMobile }, 'w-full']">
          <template #trigger="{ toggle }">
            <div
              class="border-[1px] border-shade-gray rounded-[8px] bg-white cursor-pointer px-[16px] py-[12px] hover:bg-shade-gray duration-75"
              @click="toggle"
            >
              <Label align="left" :text="selectedLanguageText">
                <template #append>
                  <IconArrowDown />
                </template>
              </Label>
            </div>
          </template>
          <MenuList class="w-full laptop:w-[220px]">
            <MenuItem
              v-for="(item, i) in availableLocales"
              :key="i"
              class="w-full"
              label-align="left"
              label-class="py-[4px]"
              :value="item.value"
              :label="item.text"
              :selected-value="filterLanguage"
              @select="handleSelectLanguage"
            >
              <template v-if="filterLanguage === item.value" #label-append>
                <IconCheck />
              </template>
            </MenuItem>
          </MenuList>
        </Dropdown>
        <ul
          :class="[
            'flex',
            'flex-col',
            'gap-[12px]',
            'w-full',
            { hidden: !isMobile },
          ]"
        >
          <li
            v-for="item of availableLocales"
            :key="item.value"
            :class="[
              'px-[16px] py-[12px] border-[1px] border-shade-gray flex justify-between items-center cursor-pointer rounded-[6px] w-full',
              { 'border-like-green': item.value === filterLanguage },
            ]"
          >
            <label class="flex justify-between w-full">
              <p>{{ item.text }}</p>
              <input
                type="radio"
                name="sorting"
                :value="item.value"
                :checked="item.value === filterLanguage"
                @change="() => handleSelectLanguage(item.value)"
              />
            </label>
          </li>
        </ul>
      </div>
      -->
    </div>
  </div>
</template>

<script>
import {
  TYPE_OPTIONS,
  PRICE_OPTIONS,
  LANGUAGE_OPTIONS,
} from '~/constant/store';

export default {
  name: 'ListingPageFilterSection',
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
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterType: this.selectedType || TYPE_OPTIONS.ALL,
      filterPrice: this.selectedPrice || PRICE_OPTIONS.ALL,
      filterLanguage: this.selectedLanguage || LANGUAGE_OPTIONS.ALL,
    };
  },
  computed: {
    filterTypeList() {
      return [
        {
          text: this.$t('listing_page_filter_type_all'),
          value: TYPE_OPTIONS.ALL,
        },
        {
          text: this.$t('listing_page_filter_type_ebook'),
          value: TYPE_OPTIONS.EBOOK,
        },
        {
          text: this.$t('listing_page_filter_type_paper'),
          value: TYPE_OPTIONS.PAPER,
        },
      ];
    },
    filterPriceList() {
      return [
        {
          text: this.$t('listing_page_filter_price_all'),
          value: PRICE_OPTIONS.ALL,
        },
        {
          text: this.$t('listing_page_filter_price_free'),
          value: PRICE_OPTIONS.FREE,
        },
        {
          text: this.$t('listing_page_filter_price_paid'),
          value: PRICE_OPTIONS.PAID,
        },
      ];
    },
    availableLocales() {
      return [
        {
          text: this.$t('listing_page_select_language_all'),
          value: LANGUAGE_OPTIONS.ALL,
        },
        {
          text: this.$t('listing_page_select_language_zh'),
          value: LANGUAGE_OPTIONS.ZH,
        },
        {
          text: this.$t('listing_page_select_language_ch'),
          value: LANGUAGE_OPTIONS.CH,
        },
        {
          text: this.$t('listing_page_select_language_en'),
          value: LANGUAGE_OPTIONS.EN,
        },
      ];
    },
    selectedLanguageText() {
      const text = `listing_page_select_language_${this.filterLanguage}`;
      return this.$t(text);
    },
  },
  watch: {
    selectedType(value) {
      this.filterType = value;
    },
    selectedPrice(value) {
      this.filterPrice = value;
    },
    selectedLanguage(value) {
      this.filterLanguage = value;
    },
  },
  methods: {
    handleTypeChange(value) {
      this.filterType = value;
      this.$emit('change-type', value);
    },
    handlePriceChange(value) {
      this.filterPrice = value;
      this.$emit('change-price', value);
    },
    handleSelectLanguage(value) {
      this.filterLanguage = value;
      this.$emit('change-language', value);
    },
  },
};
</script>
