<template>
  <Page
    :class="[
      'relative',
      'overflow-x-hidden',
      'max-w-[1924px]',
      'px-[16px]',
      'laptop:px-[48px]',
      'min-h-screen',
      'mx-auto',
      'w-full',
    ]"
  >
    <!-- header -->
    <div class="flex justify-between items-center w-full mb-[24px]">
      <!-- Breadcrumb -->
      <div class="flex gap-[8px] px-[4px] items-center">
        <NuxtLink
          class="text-[14px] text-medium-gray"
          :to="localeLocation({ name: 'index' })"
          >{{ $t('listing_page_header_homePage') }}</NuxtLink
        >
        <IconArrowRight class="text-medium-gray" />
        <NuxtLink
          class="text-[20px] laptop:text-[28px]"
          :to="localeLocation({ name: 'listing' })"
          >{{ $t('listing_page_header_listingPage') }}</NuxtLink
        >
      </div>

      <div class="flex items-center gap-[16px]">
        <div class="text-medium-gray whitespace-nowrap text-[14px]">
          {{ $t('listing_page_header_total_books', { num: totalBooks }) }}
        </div>

        <Dropdown class="hidden w-full laptop:block">
          <template #trigger="{ toggle }">
            <ButtonV2
              preset="tertiary"
              :text="currentSortingText"
              @click="toggle"
            >
              <template #append>
                <IconArrowDown />
              </template>
            </ButtonV2>
          </template>
          <MenuList>
            <MenuItem
              v-for="(item, i) in availableSorting"
              :key="i"
              label-align="left"
              label-class="py-[6px]"
              :value="item.value"
              :label="item.text"
              :selected-value="selectedSorting"
              @select="handleSelectSorting"
            >
              <template v-if="selectedSorting === item.value" #label-append>
                <IconCheck />
              </template>
            </MenuItem>
          </MenuList>
        </Dropdown>
      </div>
    </div>

    <!-- Mobile Header -->
    <div
      class="grid w-full grid-cols-2 border-t-[1px] border-b-[1px] border-shade-gray mb-[24px] laptop:hidden"
    >
      <div
        class="flex items-center justify-center cursor-pointer py-[14px] border-r-[1px] border-shade-gray"
        @click="handleOpenFilterDialog"
      >
        <Label :text="$t('listing_page_filter')">
          <template #prepend>
            <IconFilter />
          </template>
        </Label>
      </div>
      <div
        class="flex items-center justify-center cursor-pointer py-[14px]"
        @click="handleOpenSortingDialog"
      >
        <Label :text="currentSortingText">
          <template #prepend>
            <IconSorter />
          </template>
        </Label>
      </div>
    </div>

    <!-- main -->
    <div
      class="flex flex-col gap-[32px] w-full laptop:flex-row laptop:gap-[20px]"
    >
      <section
        id="features"
        class="hidden laptop:flex flex-col w-[260px] gap-[24px] desktopLg:w-[320px]"
      >
        <ListingPageFilterSection
          class="w-full"
          @handle-filter-type-change="handleFilterTypeChange"
          @handle-filter-price-change="handleFilterPriceChange"
          @handle-filter-language-change="handleFilterLanguageChange"
        />
        <ListingPageQASection class="w-full" :item-list="QAList" />
      </section>
      <section id="mainContent" class="flex-1 w-full">
        <div class="w-full bg-dark-gray h-[100px]"></div>
      </section>
    </div>

    <!-- Scroll To Top Button -->
    <div class="absolute bottom-[40px] right-[16px] laptop:right-[48px]">
      <ButtonV2
        :circle="true"
        theme="glow"
        preset="tertiary"
        size="small"
        @click="scrollToTop"
      >
        <IconScrollToTop />
      </ButtonV2>
    </div>

    <Dialog
      v-model="isOpenDialog"
      preset="custom"
      panel-class="px-0 overflow-x-auto shadow-lg rounded-b-none rounded-t-[24px] sm:rounded-[24px]"
      panel-container-class="max-w-[500px] p-[0] sm:px-[12px] sm:py-[24px]"
      panel-component="CardV2"
      :scrollable-wrapper-classes="[
        '!items-end',
        'phone:pb-[12px]',
        'phone:px-[12px]',
        'phoneLg:pb-[0px]',
        'phoneLg:px-[0px]',
        'py-[80px]',
      ]"
      @close="handleCloseDialog"
    >
      <ListingPageMobileSortingSection
        v-if="isShowSortingDialog"
        :available-sorting="availableSorting"
        :selected-sorting="selectedSorting"
        @click-confirm-change="handleSelectSorting"
      />
      <ListingPageMobileFilterSection
        v-else-if="isShowFilterDialog"
        :selected-type="filterType"
        :selected-price="filterPrice"
        :selected-language="filterLanguage"
        @handle-click-confirm="handleFilterConfirm"
      />
    </Dialog>
  </Page>
</template>

<script>
import { logTrackerEvent } from '~/util/EventLogger';

const SORTING_OPTIONS = {
  RECOMMEND: 'recommend',
  LATEST: 'latest',
  LOWER_PRICE: 'lower_price',
  HIGHER_PRICE: 'higher_price',
};
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
  name: 'ListingPage',
  layout: 'default',
  data() {
    return {
      totalBooks: 0,
      selectedSorting: SORTING_OPTIONS.RECOMMEND,
      filterType: TYPE_OPTIONS.ALL,
      filterPrice: PRICE_OPTIONS.ALL,
      filterLanguage: LANGUAGE_OPTIONS.ALL,

      isOpenDialog: false,
      isShowSortingDialog: false,
      isShowFilterDialog: false,
    };
  },
  computed: {
    currentSortingText() {
      const text = `listing_page_header_sort_${this.selectedSorting}`;
      return this.$t('listing_page_header_sort', { sort: this.$t(text) });
    },
    availableSorting() {
      return [
        {
          text: this.$t('listing_page_header_sort_recommend'),
          value: SORTING_OPTIONS.RECOMMEND,
        },
        {
          text: this.$t('listing_page_header_sort_latest'),
          value: SORTING_OPTIONS.LATEST,
        },
        {
          text: this.$t('listing_page_header_sort_lower_price'),
          value: SORTING_OPTIONS.LOWER_PRICE,
        },
        {
          text: this.$t('listing_page_header_sort_higher_price'),
          value: SORTING_OPTIONS.HIGHER_PRICE,
        },
      ];
    },
    QAList() {
      return [
        {
          label: this.$t('listing_page_QA_label'),
          content: this.$t('listing_page_QA_content'),
        },
        {
          label: `${this.$t('listing_page_QA_label')}_1`,
          content: this.$t('listing_page_QA_content'),
        },
        {
          label: `${this.$t('listing_page_QA_label')}_2`,
          content: this.$t('listing_page_QA_content'),
        },
      ];
    },
  },
  methods: {
    handleSelectSorting(value) {
      logTrackerEvent(this, 'listing', 'listing_sorting_clicked', value, 1);
      this.selectedSorting = value;
      this.isOpenDialog = false;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleFilterTypeChange(value) {
      logTrackerEvent(this, 'listing', 'listing_filter_type_clicked', value, 1);
      this.filterType = value;
    },
    handleFilterPriceChange(value) {
      logTrackerEvent(
        this,
        'listing',
        'listing_filter_price_clicked',
        value,
        1
      );
      this.filterPrice = value;
    },
    handleFilterLanguageChange(value) {
      logTrackerEvent(
        this,
        'listing',
        'listing_filter_language_clicked',
        value,
        1
      );
      this.filterLanguage = value;
    },
    handleOpenSortingDialog() {
      this.isOpenDialog = true;
      this.isShowSortingDialog = true;
    },
    handleOpenFilterDialog() {
      this.isOpenDialog = true;
      this.isShowFilterDialog = true;
    },
    handleCloseDialog() {
      this.isOpenDialog = false;
      this.isShowFilterDialog = false;
      this.isShowSortingDialog = false;
    },
    handleRestFilter() {
      logTrackerEvent(this, 'listing', 'listing_filter_reset_clicked', '', 1);
      this.filterType = TYPE_OPTIONS.ALL;
      this.filterPrice = PRICE_OPTIONS.ALL;
      this.filterLanguage = LANGUAGE_OPTIONS.ALL;
    },
    handleFilterConfirm(values) {
      logTrackerEvent(this, 'listing', 'listing_filter_confirm_clicked', '', 1);
      this.handleFilterTypeChange(values.type);
      this.handleFilterPriceChange(values.price);
      this.handleFilterLanguageChange(values.language);
      this.isOpenDialog = false;
    },
  },
};
</script>
