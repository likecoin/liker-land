<template>
  <Page :class="['w-full', 'min-h-screen', 'pb-[24px]']">
    <div :class="['w-full', 'max-w-[1924px]', 'mx-auto', 'laptop:px-[48px]']">
      <!-- Header -->
      <header>
        <div
          :class="[
            'flex',
            'justify-between',
            'items-center',

            'w-full',
            'px-[16px] laptop:px-0',
          ]"
        >
          <!-- Breadcrumb -->
          <div class="flex gap-[8px] px-[4px] items-center">
            <NuxtLink
              class="text-[14px] text-medium-gray"
              :to="localeLocation({ name: 'index' })"
              @click.native="handleClickHomePage"
              >{{ $t('listing_page_header_homePage') }}</NuxtLink
            >
            <IconArrowRight class="text-medium-gray" />
            <NuxtLink
              class="text-[20px] laptop:text-[28px]"
              :to="localeLocation({ name: 'listing' })"
              >{{ $t('listing_page_header_listingPage') }}</NuxtLink
            >
          </div>

          <!-- Desktop Filter & Sorting -->
          <div class="hidden desktop:flex items-center gap-[16px]">
            <Dropdown>
              <template #trigger="{ toggle }">
                <ButtonV2
                  preset="tertiary"
                  :text="selectedLanguageFilterLabel"
                  @click="toggle"
                >
                  <template #append>
                    <IconArrowDown />
                  </template>
                </ButtonV2>
              </template>
              <MenuList class="!py-[8px]">
                <MenuItem
                  v-for="(item, i) in languageFilterList"
                  :key="i"
                  class="w-full"
                  label-align="left"
                  label-class="py-[8px]"
                  :value="item.value"
                  :label="item.text"
                  :selected-value="selectedLanguageFilter"
                  @select="selectedLanguageFilter = item.value"
                >
                  <template
                    v-if="selectedLanguageFilter === item.value"
                    #label-append
                  >
                    <IconCheck />
                  </template>
                </MenuItem>
              </MenuList>
            </Dropdown>

            <Dropdown>
              <template #trigger="{ toggle }">
                <ButtonV2
                  preset="tertiary"
                  :text="selectedPriceFilterLabel"
                  @click="toggle"
                >
                  <template #append>
                    <IconArrowDown />
                  </template>
                </ButtonV2>
              </template>
              <MenuList class="!py-[8px]">
                <MenuItem
                  v-for="(item, i) in priceFilterList"
                  :key="i"
                  class="w-full"
                  label-align="left"
                  label-class="py-[8px]"
                  :value="item.value"
                  :label="item.text"
                  :selected-value="selectedPriceFilter"
                  @select="selectedPriceFilter = item.value"
                >
                  <template
                    v-if="selectedPriceFilter === item.value"
                    #label-append
                  >
                    <IconCheck />
                  </template>
                </MenuItem>
              </MenuList>
            </Dropdown>

            <ListingPageToggleButton
              v-model="isAppliedDRMFreeFilter"
              :label="$t('listing_page_filter_drm_free_label')"
              @input="handleToggleDRMFreeFilter"
            />

            <Dropdown>
              <template #trigger="{ toggle }">
                <ButtonV2
                  preset="tertiary"
                  :text="selectedSortingLabel"
                  @click="toggle"
                >
                  <template #append>
                    <IconArrowDown />
                  </template>
                </ButtonV2>
              </template>
              <MenuList class="!py-[8px]">
                <MenuItem
                  v-for="(item, i) in availableSorting"
                  :key="i"
                  label-align="left"
                  label-class="!py-[8px]"
                  :value="item.value"
                  :label="item.text"
                  :selected-value="selectedSorting"
                  @select="handleSortingChange"
                >
                  <template v-if="selectedSorting === item.value" #label-append>
                    <IconCheck />
                  </template>
                </MenuItem>
              </MenuList>
            </Dropdown>
          </div>
        </div>

        <!-- Mobile Filter & Sorting -->
        <div
          :class="[
            'grid desktop:hidden',
            'grid-cols-2',

            'w-full',
            'mt-[16px]',

            'border-t-[1px]',
            'border-b-[1px]',
            'border-shade-gray',

            'divide-x',
            'divide-shade-gray',
          ]"
        >
          <div
            class="flex items-center justify-center cursor-pointer px-[10px] py-[14px]"
            @click="handleOpenFilterDialog"
          >
            <Label :text="$t('listing_page_filter')">
              <template #prepend>
                <IconFilter />
              </template>
            </Label>
          </div>

          <div
            class="flex items-center justify-center cursor-pointer px-[10px] py-[14px]"
            @click="handleOpenSortingDialog"
          >
            <Label :text="selectedSortingLabel">
              <template #prepend>
                <IconSorter />
              </template>
            </Label>
          </div>
        </div>
      </header>

      <!-- Body -->
      <section
        :class="[
          'flex',
          'flex-col',
          'items-center',
          'gap-[32px]',
          'flex-1',

          'w-full',
          'mt-[40px]',
          'px-[16px] laptop:px-0',
        ]"
      >
        <!-- Listing items -->
        <ul
          :class="[
            'w-full',
            'grid',
            'grid-cols-2',
            'sm:grid-cols-3',
            'laptop:grid-cols-3',
            'desktop:grid-cols-4',
            'desktopLg:grid-cols-5',
            'full-hd:grid-cols-6',
            'gap-x-[16px] sm:gap-x-[20px] gap-y-[40px]',
            'items-stretch',
            'desktop:mt-0',
          ]"
        >
          <li :class="['row-start-4', 'sm:row-start-3', 'col-span-full']">
            <ListingPageBooxBanner />
          </li>

          <li v-for="item in sortedBookstoreItems" :key="item.classId">
            <NFTBookItemCardV2
              :item-id="item.classId"
              class-cover-frame-aspect-ratio="aspect-[4/5]"
              :is-link-disabled="item.isMultiple"
              @click-cover="handleClickItem($event, item)"
            />
          </li>
        </ul>

        <footer class="flex flex-col gap-[32px]">
          <div class="flex flex-col items-center gap-[24px] py-[24px]">
            <p>{{ $t('listing_page_cant_find_books') }}</p>
            <ButtonV2
              preset="tertiary"
              :text="$t('listing_page_cant_find_books_button')"
              @click="handleClickCantFindBook"
            />
          </div>

          <ListingPageQASection class="w-full" :item-list="QAList" />
        </footer>
      </section>
    </div>

    <!-- Scroll To Top Button -->
    <div class="sticky bottom-[96px] self-end mt-[16px]">
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
        :selected-sorting="selectedSorting"
        @change-sorting="handleSortingChange"
        @close="handleCloseDialog"
      />
    </ListingPageDialog>

    <!-- Mobile Filter Dialog -->
    <ListingPageDialog
      :is-open="isShowFilterDialog"
      :title="$t('listing_page_filter')"
      @close="handleCloseDialog"
    >
      <ul class="flex flex-col gap-[24px] px-[20px] py-[24px]">
        <!-- Language -->
        <li class="flex flex-col gap-[16px]">
          <Label :text="$t('listing_page_select_language_title')" />
          <ul class="flex flex-col gap-[12px] w-full">
            <li
              v-for="item of languageFilterList"
              :key="item.value"
              :class="[
                'flex',
                'justify-between',
                'items-center',

                'w-full',
                'px-[16px]',
                'py-[12px]',

                'border-[1px]',
                item.value === selectedLanguageFilter
                  ? 'border-like-green'
                  : 'border-shade-gray',
                'rounded-[8px]',

                'cursor-pointer',
              ]"
            >
              <label class="flex items-center justify-between w-full">
                <p>{{ item.text }}</p>
                <input
                  class="accent-like-green"
                  type="radio"
                  name="sorting"
                  :value="item.value"
                  :checked="item.value === selectedLanguageFilter"
                  @change="selectedLanguageFilter = item.value"
                />
              </label>
            </li>
          </ul>
        </li>

        <!-- Price -->
        <li class="flex flex-col gap-[16px]">
          <Label :text="$t('listing_page_filter_price_title')" />
          <ListingPageOptionList
            v-model="selectedPriceFilter"
            :items="priceFilterList"
          />
        </li>

        <li>
          <ListingPageToggleButton
            v-model="isAppliedDRMFreeFilter"
            class="min-h-[50px]"
            :has-hover-effect="false"
            :label="$t('listing_page_filter_drm_free_label')"
            :is-full-width="true"
            @input="handleToggleDRMFreeFilter"
          />
        </li>
      </ul>

      <footer class="grid grid-cols-2 gap-[12px] px-[12px]">
        <ButtonV2 preset="tertiary" @click="handleFilterReset">{{
          $t('listing_page_button_reset')
        }}</ButtonV2>
        <ButtonV2 @click="handleCloseDialog">{{
          $t('listing_page_button_confirm')
        }}</ButtonV2>
      </footer>
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

import { EXTERNAL_HOST, LIKECOIN_API_BASE } from '~/constant';
import {
  SORTING_OPTIONS,
  PRICE_OPTIONS,
  LANGUAGE_OPTIONS,
} from '~/constant/store';

import { fetchBookstoreItemListsFromCMSById } from '~/util/api';
import { checkIsForcedInAppPage } from '~/util/client';
import { logTrackerEvent } from '~/util/EventLogger';
import { parseNFTMetadataURL } from '~/util/nft';

import crispMixin from '~/mixins/crisp';

export default {
  name: 'ListingPage',
  mixins: [crispMixin],
  layout: 'default',
  defaultSorting: SORTING_OPTIONS.RECOMMEND,
  defaultPrice: PRICE_OPTIONS.ALL,
  defaultLanguage: LANGUAGE_OPTIONS.ALL,
  async asyncData({ store, redirect, localeLocation, route, $api }) {
    if (checkIsForcedInAppPage(route)) {
      redirect(301, localeLocation({ name: 'dashboard' }));
      return {};
    }

    let bookstoreItemsFromCMS = [];
    try {
      const [result] = await Promise.all([
        $api.$get(
          fetchBookstoreItemListsFromCMSById('listing', { limit: 100 })
        ),
        store.dispatch('fetchBookstoreLatestItems'),
      ]);
      bookstoreItemsFromCMS = result.records.map((item, index) => ({
        ...item,
        recommendOrder: index + 1,
      }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return { bookstoreItemsFromCMS };
  },
  data() {
    return {
      bookstoreItemsFromCMS: [], // Fetch in asyncData

      totalBooks: 0,

      isShowSortingDialog: false,
      isShowFilterDialog: false,
      dialogNFTClassList: [],
    };
  },
  head() {
    const title = this.$t('store_index_page_title');
    const description = this.$t('store_books_page_description');
    const link = [{ rel: 'canonical', href: `${this.$route.path}` }];
    const classIds = Array.from(
      new Set(this.bookstoreItems.map(b => b.classId).flat())
    );
    classIds.forEach(classId =>
      link.push({
        rel: 'prefetch',
        href: `${LIKECOIN_API_BASE}/likerland/nft/metadata?class_id=${classId}`,
      })
    );

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'DataFeed',
      dataFeedElement: classIds
        .filter(classId => this.getNFTClassMetadataById(classId))
        .map(classId => {
          const {
            name: className,
            description: classDescription,
            image: classImage = '',
            iscn_owner: iscnOwner,
          } = this.getNFTClassMetadataById(classId);
          const iscnOwnerPerson = iscnOwner
            ? {
                '@context': 'http://www.schema.org',
                '@type': 'Person',
                url: `${EXTERNAL_HOST}/${iscnOwner}`,
                identifier: iscnOwner,
              }
            : undefined;

          return {
            '@context': 'http://www.schema.org',
            '@type': 'Book',
            name: className,
            description: classDescription,
            image: parseNFTMetadataURL(classImage),
            url: `${EXTERNAL_HOST}/nft/class/${classId}`,
            author: iscnOwnerPerson,
            identifier: classId,
          };
        }),
    };
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${EXTERNAL_HOST}/images/og/${
            this.$i18n.locale === 'zh-Hant' ? 'book-zh.png' : 'book.png'
          }`,
        },
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify(schema),
          type: 'application/ld+json',
          body: true,
        },
      ],
      link,
    };
  },
  computed: {
    ...mapGetters([
      'nftBookstoreLatestItems',
      'getNFTBookStorePricesByClassId',
      'getNFTClassMetadataById',
    ]),

    // Price filter related
    priceFilterList() {
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
    selectedPriceFilter: {
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

        this.$router.push({ query });
      },
    },
    selectedPriceFilterLabel() {
      return this.$t('listing_page_filter_price_label', {
        price: this.$t(`listing_page_filter_price_${this.selectedPriceFilter}`),
      });
    },

    // DRM-free filter related
    isAppliedDRMFreeFilter: {
      get() {
        return this.$route.query.drm_free === '1';
      },
      set(value) {
        const query = {
          ...this.$route.query,
          drm_free: value ? '1' : undefined,
        };

        this.$router.push({ query });
      },
    },

    // Language filter related
    languageFilterList() {
      return [
        {
          text: this.$t('listing_page_select_language_all'),
          value: LANGUAGE_OPTIONS.ALL,
        },
        {
          text: this.$t('listing_page_select_language_en'),
          value: LANGUAGE_OPTIONS.EN,
        },
      ];
    },
    selectedLanguageFilter: {
      get() {
        return this.$route.query.lang || this.$options.defaultLanguage;
      },
      set(value) {
        const query = {
          ...this.$route.query,
          lang: Object.values(LANGUAGE_OPTIONS).includes(value)
            ? value
            : this.$options.defaultLanguage,
        };

        this.$router.push({ query });
      },
    },
    selectedLanguageFilterLabel() {
      return this.$t('listing_page_filter_language_label', {
        language: this.$t(
          `listing_page_select_language_${this.selectedLanguageFilter}`
        ),
      });
    },

    // Sorting related
    availableSorting() {
      const options = [];

      options.push({
        text: this.$t('listing_page_header_sort_recommend'),
        value: SORTING_OPTIONS.RECOMMEND,
      });

      options.push({
        text: this.$t('listing_page_header_sort_latest'),
        value: SORTING_OPTIONS.LATEST,
      });

      if (this.selectedPriceFilter !== PRICE_OPTIONS.FREE) {
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

        this.$router.push({ query });
      },
    },
    selectedSortingLabel() {
      const text = `listing_page_header_sort_${this.selectedSorting}`;
      return this.$t('listing_page_header_sort', { sort: this.$t(text) });
    },

    bookstoreItems() {
      const items = [
        ...this.bookstoreItemsFromCMS,
        ...this.nftBookstoreLatestItems,
      ];
      const uniqueIds = new Set();
      const dedupedItems = [];
      items.forEach(item => {
        if (!uniqueIds.has(item.classId)) {
          uniqueIds.add(item.classId);
          dedupedItems.push(item);
        }
      });
      return dedupedItems;
    },
    filteredBookstoreItems() {
      return this.bookstoreItems
        .filter(item => {
          if (this.isAppliedDRMFreeFilter) {
            return item.isDRMFree;
          }
          return true;
        })
        .filter(item => {
          if (
            this.selectedLanguageFilter !== LANGUAGE_OPTIONS.ALL &&
            item.locales
          ) {
            return item.locales.includes(this.selectedLanguageFilter);
          }
          return true;
        })
        .filter(item => {
          if (PRICE_OPTIONS.PAID === this.selectedPriceFilter) {
            return item.minPrice > 0;
          }
          if (PRICE_OPTIONS.FREE === this.selectedPriceFilter) {
            return item.minPrice === 0;
          }
          return true;
        });
    },
    sortedBookstoreItems() {
      const items = [...this.filteredBookstoreItems];

      items.sort((a, b) => {
        const locale = this.selectedLanguageFilter;
        if (locale !== LANGUAGE_OPTIONS.ALL) {
          const aLocales = a.locales || [];
          const bLocales = b.locales || [];
          if (aLocales.includes(locale) && !bLocales.includes(locale)) {
            return -1;
          }
          if (!aLocales.includes(locale) && bLocales.includes(locale)) {
            return 1;
          }
        }

        switch (this.selectedSorting) {
          case SORTING_OPTIONS.RECOMMEND:
            if (a.recommendOrder && b.recommendOrder) {
              return a.recommendOrder - b.recommendOrder;
            }
            if (a.recommendOrder && !b.recommendOrder) {
              return -1;
            }
            if (!a.recommendOrder && b.recommendOrder) {
              return 1;
            }
            break;

          case SORTING_OPTIONS.HIGHER_PRICE: {
            if (a.minPrice !== b.minPrice) {
              return b.minPrice - a.minPrice;
            }
            break;
          }

          case SORTING_OPTIONS.LOWER_PRICE: {
            if (a.minPrice !== b.minPrice) {
              return a.minPrice - b.minPrice;
            }
            break;
          }

          default:
            break;
        }

        return b.timestamp - a.timestamp;
      });

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
    selectedPriceFilter() {
      this.scrollToTop();
    },
    selectedLanguageFilter() {
      this.scrollToTop();
    },
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    handleFilterPriceChange(value) {
      logTrackerEvent(
        this,
        'listing',
        'listing_filter_price_clicked',
        value,
        1
      );
      this.selectedPriceFilter = value;
    },
    handleFilterLanguageChange(value) {
      logTrackerEvent(
        this,
        'listing',
        'listing_filter_language_clicked',
        value,
        1
      );
      this.selectedLanguageFilter = value;
    },
    handleToggleDRMFreeFilter(value) {
      logTrackerEvent(
        this,
        'listing',
        'listing_filter_drm_free_clicked',
        value ? '1' : '0',
        1
      );
    },
    handleFilterReset() {
      logTrackerEvent(this, 'listing', 'listing_filter_reset', '', 1);
      // eslint-disable-next-line camelcase
      const { type, price, lang, drm_free, ...query } = this.$route.query;
      this.$router.push({ query });
    },
    handleSortingChange(value) {
      logTrackerEvent(this, 'listing', 'listing_sorting_clicked', value, 1);
      this.selectedSorting = value;
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
    handleClickHomePage() {
      logTrackerEvent(this, 'listing', 'listing_home_page_click', '', 1);
    },
  },
};
</script>
