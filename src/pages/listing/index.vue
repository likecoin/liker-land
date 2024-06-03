<template>
  <Page :class="['w-full', 'min-h-screen', 'pb-[80px]']">
    <div
      :class="[
        'w-full',
        'max-w-[1924px]',
        'mx-auto',
        'px-[16px] laptop:px-[48px]',
      ]"
    >
      <!-- Header -->
      <header>
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
              {{
                $t('listing_page_header_total_books', {
                  num: sortedBookstoreItems.length,
                })
              }}
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

        <!-- Mobile Filter Section -->
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
      </header>

      <!-- Body -->
      <div
        :class="[
          'flex',
          'flex-col laptop:flex-row',
          'gap-[32px] laptop:gap-[20px]',
          'w-full',
        ]"
      >
        <!-- Desktop Filter Section -->
        <section
          :class="[
            'hidden',
            'laptop:block',
            'min-[300px] desktopLg:min-w-[360px] full-hd:min-w-[466px]',
          ]"
        >
          <div class="sticky top-[24px] flex flex-col gap-[24px]">
            <!-- Is it possible to use multiple `v-model` in Vue2? -->
            <ListingPageFilterSection
              class="w-full"
              :selected-type="filterType"
              :selected-price="filterPrice"
              :selected-language="filterLanguage"
              @change-type="handleFilterTypeChange"
              @change-price="handleFilterPriceChange"
              @change-language="handleFilterLanguageChange"
            />
            <ListingPageQASection class="w-full" :item-list="QAList" />
          </div>
        </section>

        <section class="flex-1 w-full">
          <!-- Listing items -->
          <ul
            :class="[
              'w-full',
              'grid',
              'grid-cols-2',
              'sm:grid-cols-3',
              'laptop:grid-cols-2',
              'desktop:grid-cols-3',
              'desktopLg:grid-cols-4',
              'full-hd:grid-cols-5',
              'gap-x-[16px] sm:gap-x-[20px] gap-y-[40px]',
              'items-stretch',
              'desktop:mt-0',
            ]"
          >
            <li v-for="item in sortedBookstoreItems" :key="item.classId">
              <NFTBookItemCardV2
                :class-id="item.classId"
                class-cover-frame-aspect-ratio="aspect-[4/5]"
                :is-link-disabled="item.isMultiple"
                @click-cover="handleClickItem($event, item)"
              />
            </li>
          </ul>

          <footer
            class="flex flex-col items-center gap-[24px] mt-[40px] p-[24px]"
          >
            <p>{{ $t('listing_page_cant_find_books') }}</p>
            <ButtonV2
              preset="tertiary"
              :text="$t('listing_page_cant_find_books_button')"
              @click="handleClickCantFindBook"
            />
          </footer>
        </section>
      </div>
    </div>

    <!-- Scroll To Top Button -->
    <div class="sticky bottom-[32px] self-end">
      <ButtonV2
        :class="[
          'bg-white',
          'border-[1px] border-r-[0]',
          'border-[#e3e3e3]',
          'rounded-l-[8px]',
          'rounded-r-[0]',
        ]"
        preset="plain"
        size="small"
        @click="scrollToTop"
      >
        <IconScrollToTop />
      </ButtonV2>
    </div>

    <!-- Mobile Sorting Dialog -->
    <ListingPageDialog
      :is-open="isShowSortingDialog"
      :title="$t('listing_page_sorter')"
      @close="handleCloseDialog"
    >
      <ListingPageMobileSortingSection
        :available-sorting="availableSorting"
        :default-sorting="$options.defaultSorting"
        :selected-sorting="selectedSorting"
        @change-sorting="handleSelectSorting"
      />
    </ListingPageDialog>
    <!-- Mobile Filter Dialog -->
    <ListingPageDialog
      :is-open="isShowFilterDialog"
      :title="$t('listing_page_filter')"
      @close="handleCloseDialog"
    >
      <ListingPageMobileFilterSection
        :selected-type="filterType"
        :selected-price="filterPrice"
        :selected-language="filterLanguage"
        :default-type="$options.defaultType"
        :default-price="$options.defaultPrice"
        :default-language="$options.defaultLanguage"
        @change-type="handleFilterTypeChange"
        @change-price="handleFilterPriceChange"
        @change-language="handleFilterLanguageChange"
        @close="handleCloseDialog"
      />
    </ListingPageDialog>

    <!-- TODO: Refactor this and the one on the landing page -->
    <Dialog
      :open="dialogNFTClassList.length > 0"
      :header-text="$t('nft_book_shelf_multiple_nft_class_dialog_title')"
      panel-container-class="phone:max-w-[520px] laptop:max-w-[768px]"
      panel-component="CardV2"
      panel-class="overflow-y-scroll shadow-lg"
      @close="closeMultipleNFTClassDialog"
    >
      <ul class="flex flex-col gap-[2rem]">
        <li v-for="classId in dialogNFTClassList" :id="classId" :key="classId">
          <NFTBookItemCard
            :class-id="classId"
            component-class="!bg-like-cyan-pale"
          />
        </li>
      </ul>
    </Dialog>
  </Page>
</template>

<script>
import { mapGetters } from 'vuex';

import {
  SORTING_OPTIONS,
  TYPE_OPTIONS,
  PRICE_OPTIONS,
  LANGUAGE_OPTIONS,
} from '~/constant/store';

import { logTrackerEvent } from '~/util/EventLogger';

import bookstoreMixin from '~/mixins/bookstore';
import crispMixin from '~/mixins/crisp';

export default {
  name: 'ListingPage',
  mixins: [bookstoreMixin, crispMixin],
  layout: 'default',
  defaultSorting: SORTING_OPTIONS.RECOMMEND,
  defaultType: TYPE_OPTIONS.ALL,
  defaultPrice: PRICE_OPTIONS.ALL,
  defaultLanguage: LANGUAGE_OPTIONS.ALL,
  data() {
    return {
      totalBooks: 0,

      isShowSortingDialog: false,
      isShowFilterDialog: false,
      dialogNFTClassList: [],
    };
  },
  async fetch({ store }) {
    try {
      await Promise.all([
        store.dispatch('fetchBookstoreList'),
        store.dispatch('fetchBookstoreLatestItems'),
      ]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  computed: {
    ...mapGetters([
      'nftBookstoreLatestItems',
      'nftBookstoreLatestPaidItems',
      'nftBookstoreLatestFreeItems',
      'getNFTBookStorePricesByClassId',
    ]),
    selectedSorting: {
      get() {
        return this.$route.query.sort || this.$options.defaultSorting;
      },
      set(value) {
        const query = {
          ...this.$route.query,
          sort: Object.values(SORTING_OPTIONS).includes(value)
            ? value
            : this.$options.defaultSorting,
        };

        if (value === SORTING_OPTIONS.RECOMMEND) {
          query.type = TYPE_OPTIONS.ALL;
        }

        this.$router.push({ query });
      },
    },
    filterType: {
      get() {
        return this.$route.query.type || this.$options.defaultType;
      },
      set(value) {
        const query = {
          ...this.$route.query,
          type: Object.values(TYPE_OPTIONS).includes(value)
            ? value
            : this.$options.defaultType,
        };

        if (value !== TYPE_OPTIONS.ALL) {
          query.sort = SORTING_OPTIONS.LATEST;
        }

        this.$router.push({ query });
      },
    },
    filterPrice: {
      get() {
        return this.$route.query.price || this.$options.defaultPrice;
      },
      set(value) {
        const query = {
          ...this.$route.query,
          price: Object.values(PRICE_OPTIONS).includes(value)
            ? value
            : this.$options.defaultPrice,
        };

        switch (value) {
          case PRICE_OPTIONS.PAID:
          case PRICE_OPTIONS.FREE:
            query.sort = SORTING_OPTIONS.LATEST;
            break;
          case PRICE_OPTIONS.ALL:
          default:
            query.sort = SORTING_OPTIONS.RECOMMEND;
            break;
        }

        this.$router.push({ query });
      },
    },
    filterLanguage: {
      get() {
        return this.$route.query.lang || this.$options.defaultLanguage;
      },
      set(value) {
        this.$router.push({
          query: {
            ...this.$route.query,
            lang: Object.values(LANGUAGE_OPTIONS).includes(value)
              ? value
              : this.$options.defaultLanguage,
          },
        });
      },
    },
    currentSortingText() {
      const text = `listing_page_header_sort_${this.selectedSorting}`;
      return this.$t('listing_page_header_sort', { sort: this.$t(text) });
    },
    availableSorting() {
      const options = [];

      if (this.filterPrice === PRICE_OPTIONS.ALL) {
        options.push({
          text: this.$t('listing_page_header_sort_recommend'),
          value: SORTING_OPTIONS.RECOMMEND,
        });
      }

      options.push({
        text: this.$t('listing_page_header_sort_latest'),
        value: SORTING_OPTIONS.LATEST,
      });

      if (this.filterPrice !== PRICE_OPTIONS.FREE) {
        options.push(
          {
            text: this.$t('listing_page_header_sort_lower_price'),
            value: SORTING_OPTIONS.LOWER_PRICE,
          },
          {
            text: this.$t('listing_page_header_sort_higher_price'),
            value: SORTING_OPTIONS.HIGHER_PRICE,
          }
        );
      }

      return options;
    },
    bookstoreItems() {
      switch (this.filterPrice) {
        case PRICE_OPTIONS.FREE:
          return this.nftBookstoreLatestFreeItems;
        case PRICE_OPTIONS.PAID:
          return this.nftBookstoreLatestPaidItems;
        case PRICE_OPTIONS.ALL:
        default:
          // FIXME: Need modifying API for obtaining price & book type of featured items
          if (this.selectedSorting === SORTING_OPTIONS.RECOMMEND) {
            const setOfFeaturedItemClasses = new Set(
              this.bookstoreListItemsInFeatured.map(item => item.classId)
            );
            return [
              // NOTE: Featured items always come first
              ...this.bookstoreListItemsInFeatured,
              // NOTE: Filter out featured items from latest items
              ...this.nftBookstoreLatestItems.filter(
                item => !setOfFeaturedItemClasses.has(item.classId)
              ),
            ];
          }
          return this.nftBookstoreLatestItems;
      }
    },
    normalizedBookstoreItems() {
      return this.normalizeBookstoreListItems(this.bookstoreItems);
    },
    filteredBookstoreItems() {
      if (this.filterType === TYPE_OPTIONS.ALL) {
        return this.normalizedBookstoreItems;
      }
      return this.normalizedBookstoreItems.filter(item => {
        switch (this.filterType) {
          case TYPE_OPTIONS.EBOOK:
            return item.hasEbook;
          case TYPE_OPTIONS.PAPER:
            return item.hasPhysical;
          default:
            return true;
        }
      });
    },
    sortedBookstoreItems() {
      const items = [...this.filteredBookstoreItems];

      if (
        [PRICE_OPTIONS.ALL, PRICE_OPTIONS.PAID].includes(this.filterPrice) &&
        [SORTING_OPTIONS.HIGHER_PRICE, SORTING_OPTIONS.LOWER_PRICE].includes(
          this.selectedSorting
        )
      ) {
        items.sort((a, b) => {
          const priceA = a.minPrice;
          const priceB = b.minPrice;

          if (this.selectedSorting === SORTING_OPTIONS.HIGHER_PRICE) {
            return priceB - priceA;
          }
          return priceA - priceB;
        });
      }

      return items;
    },
    QAList() {
      return this.$t('index_faq_list').map(({ q: label, a: content }) => ({
        label,
        content,
      }));
    },
  },
  watch: {
    selectedSorting() {
      this.scrollToTop();
    },
    filterType() {
      this.scrollToTop();
    },
    filterPrice() {
      this.scrollToTop();
    },
    filterLanguage() {
      this.scrollToTop();
    },
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleSelectSorting(value) {
      logTrackerEvent(this, 'listing', 'listing_sorting_clicked', value, 1);
      this.selectedSorting = value;
      this.isShowSortingDialog = false;
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
      this.isShowSortingDialog = true;
    },
    handleOpenFilterDialog() {
      this.isShowFilterDialog = true;
    },
    handleCloseDialog() {
      this.isShowFilterDialog = false;
      this.isShowSortingDialog = false;
    },
    handleFilterConfirm(values) {
      logTrackerEvent(this, 'listing', 'listing_filter_confirm_clicked', '', 1);
      this.handleFilterTypeChange(values.type);
      this.handleFilterPriceChange(values.price);
      this.handleFilterLanguageChange(values.language);
      this.isShowFilterDialog = false;
    },
    handleClickItem(event, item) {
      if (item.isMultiple) {
        event.preventDefault();
        this.dialogNFTClassList = item.classIds;
      }
      logTrackerEvent(this, 'listing', 'listing_item_click', item.classId, 1);
    },
    closeMultipleNFTClassDialog() {
      this.dialogNFTClassList = [];
    },
    handleClickCantFindBook() {
      this.openCrisp(this.$t('listing_page_cant_find_books_prefilled_message'));
      logTrackerEvent(
        this,
        'listing',
        'listing_cant_find_book_button_click',
        '',
        1
      );
    },
  },
};
</script>
