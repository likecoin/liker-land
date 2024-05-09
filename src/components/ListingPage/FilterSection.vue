<template>
  <div
    v-bind="$attrs"
    class="px-[20px] py-[24px] rounded-[12px] bg-white shadow-md"
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
          :wrapper-class="[
            'flex',
            'justify-center',
            'items-center',
            'p-[4px]',
            'border-[1px]',
            'border-shade-gray',
            'bg-white',
            'rounded-[14px]',
          ]"
          :item-list="filterTypeList"
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
          :wrapper-class="[
            'flex',
            'w-full',
            'justify-between',
            'items-center',
            'p-[4px]',
            'border-[1px]',
            'border-shade-gray',
            'bg-white',
            'rounded-[14px]',
          ]"
          :item-list="filterPriceList"
        />
      </div>
      <!-- Language -->
      <div
        class="flex flex-col items-start justify-center gap-[16px] desktopLg:flex-row desktopLg:items-center desktopLg:justify-start"
      >
        <Label
          class="whitespace-nowrap"
          :text="$t('listing_page_select_language_title')"
        />
        <Dropdown class="w-full">
          <template #trigger="{ toggle }">
            <div
              class="border-[1px] border-shade-gray rounded-[8px] bg-white cursor-pointer px-[16px] py-[12px] hover:bg-shade-gray duration-75"
              @click="toggle"
            >
              <Label align="left" :text="$t(selectedLanguageText)">
                <template #append>
                  <IconArrowDown />
                </template>
              </Label>
            </div>
          </template>
          <MenuList class="w-[220px]">
            <MenuItem
              v-for="(item, i) in availableLocales"
              :key="i"
              label-align="left"
              label-class="py-[4px]"
              :value="item.value"
              :label="item.text"
              :selected-value="selectedLanguage"
              @select="handleSelectLanguage"
            >
              <template v-if="selectedLanguage === item.value" #label-append>
                <IconCheck />
              </template>
            </MenuItem>
          </MenuList>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script>
const TYPE_OPTIONS = {
  ALL: 'all',
  EPUB: 'epub',
  PAPER: 'paper',
};

const PRICE_OPTIONS = {
  ALL: 'all',
  FREE: 'free',
  Paid: 'paid',
};

const LANGUAGE_OPTIONS = {
  ALL: 'all',
  ZH: 'zh',
  CH: 'ch',
  EN: 'en',
};

export default {
  name: 'ListingPageFilterSection',
  data() {
    return {
      filterType: TYPE_OPTIONS.ALL,
      filterPrice: PRICE_OPTIONS.ALL,
      selectedLanguage: LANGUAGE_OPTIONS.ALL,
    };
  },
  computed: {
    filterTypeList() {
      const items = [
        {
          text: this.$t('listing_page_filter_type_all'),
          value: TYPE_OPTIONS.ALL,
        },
        {
          text: this.$t('listing_page_filter_type_epub'),
          value: TYPE_OPTIONS.EPUB,
        },
        {
          text: this.$t('listing_page_filter_type_paper'),
          value: TYPE_OPTIONS.PAPER,
        },
      ];

      return items.map(item => ({
        type: 'item',
        ...item,
        isSelected: item.value === this.filterType,
        handleClick: () => this.handleTypeChange(item.value),
      }));
    },
    filterPriceList() {
      const items = [
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
          value: PRICE_OPTIONS.Paid,
        },
      ];

      return items.map(item => ({
        type: 'item',
        ...item,
        isSelected: item.value === this.filterPrice,
        handleClick: () => this.handlePriceChange(item.value),
      }));
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
      const text = `listing_page_select_language_${this.selectedLanguage}`;
      return this.$t(text);
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
      this.selectedLanguage = value;
    },
  },
};
</script>
