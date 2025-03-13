<template>
  <Page :class="['w-full', 'min-h-screen', 'pb-[24px]']">
    <div :class="['w-full', 'max-w-[1924px]', 'mx-auto', 'desktop:px-[48px]']">
      <!-- Header -->
      <header>
        <div
          :class="[
            'flex',
            'justify-between',
            'gap-[16px]',
            'items-center',

            'w-full',
          ]"
        >
          <nav class="relative flex items-center min-w-0">
            <!-- Left arrow -->
            <div
              v-if="isTagsContainerOverflowing && !isTagsContainerAtStart"
              :class="[
                ...tagsContainerArrowClass,

                'left-0',
                'bg-gradient-to-l',
              ]"
              @click="scrollTagsContainerLeft"
            >
              <IconArrowLeft class="hidden desktop:block w-[20px] h-[20px]" />
            </div>
            <!-- Tags -->
            <div
              ref="tagsContainer"
              :class="[
                'w-full',
                'px-[16px] desktop:px-0',
                'py-[16px]',

                'overflow-scroll',
                'laptop:overflow-x-hidden',
                'overflow-y-hidden',
                'scrollbar-custom',
                'cursor-grab',
                'select-none',
              ]"
              @scroll="handleTagsContainerScroll"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="endDrag"
              @mouseleave="endDrag"
              @touchstart="startDrag"
              @touchmove="onDrag"
              @touchend="endDrag"
            >
              <ul class="flex gap-x-2 gap-y-4">
                <li
                  v-for="(tag, index) in bookstoreTagButtons"
                  :key="tag.id"
                  :ref="tag.id === selectedTagId ? 'activeTag' : null"
                  :class="[
                    'shrink-0',
                    // NOTE: Prevent cropping the last tag button shadow
                    { 'pr-[12px]': index === bookstoreTagButtons.length - 1 },
                  ]"
                  @dragstart.prevent
                >
                  <ButtonV2
                    class="pointer-event-auto"
                    :preset="tag.id === selectedTagId ? 'secondary' : 'outline'"
                    :text="tag.name"
                    :alt="tag.name"
                    size="mini"
                    theme="glow"
                    :to="tag.route"
                    @click.native="handleTagClick(tag)"
                  />
                </li>
              </ul>
            </div>
            <!-- Right arrow -->
            <div
              v-if="isTagsContainerOverflowing && !isTagsContainerAtEnd"
              :class="[
                ...tagsContainerArrowClass,

                'justify-end',
                'right-0',
                'bg-gradient-to-r',
              ]"
              @click="scrollTagsContainerRight"
            >
              <IconArrowRight class="hidden desktop:block w-[20px] h-[20px]" />
            </div>
          </nav>

          <!-- Desktop Filter & Sorting -->
          <div class="hidden desktop:flex items-center gap-[16px] relative">
            <SearchBar
              :search-query="searchQuery"
              @open="handleSearchBarOpen"
              @clear="handleSearchBarClear"
              @input="handleSearchBarInput"
            />

            <ButtonV2
              preset="tertiary"
              :text="$t('listing_page_filter')"
              class="whitespace-nowrap"
              @click="handleOpenFilterDialog"
            >
              <template #prepend>
                <IconFilter />
              </template>
            </ButtonV2>
            <Dropdown>
              <template #trigger="{ toggle }">
                <ButtonV2
                  preset="tertiary"
                  class="whitespace-nowrap"
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
            'grid-cols-3',

            'w-full',
            'mt-[16px]',

            'border-t-[1px]',
            'border-b-[1px]',
            'border-shade-gray',

            'divide-x',
            'divide-shade-gray',

            'relative',
          ]"
        >
          <div
            class="flex items-center justify-center cursor-pointer px-[10px]"
          >
            <SearchBar
              class="w-full"
              :search-query="searchQuery"
              @open="handleSearchBarOpen"
              @clear="handleSearchBarClear"
              @input="handleSearchBarInput"
            />
          </div>
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
            <Label :text="$t('order_menu_sort_by')">
              <template #prepend>
                <IconSorter />
              </template>
            </Label>
          </div>
        </div>

        <template v-if="selectedTagDescription">
          <h3
            v-if="selectedTagTitle"
            :class="[
              'mt-[36px] desktop:mt-[20px]',
              'px-[16px] desktop:px-0',

              'text-[24px] desktop:text-[32px]',
              'font-bold',
            ]"
            v-text="selectedTagTitle"
          />

          <p
            class="mt-[8px] px-[16px] desktop:px-0 text-gray-4a text-[14px]"
            v-text="selectedTagDescription"
          />
        </template>
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
          'px-[16px] desktop:px-0',
        ]"
      >
        <!-- Loading -->
        <div
          v-if="shouldShowFullPageFetchingIndicator"
          class="flex justify-center items-center min-h-[70vh]"
        >
          <ProgressIndicator />
        </div>

        <!-- Listing items -->
        <template v-else-if="sortedBookstoreItems.length">
          <Label
            v-if="searchQuery"
            preset="h5"
            class="w-full text-dark-gray"
            align="left"
            :text="$t('listing_page_search_result', { query: searchQuery })"
          />

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
            <li
              v-if="shouldShowBooxBanner"
              :class="['row-start-4', 'sm:row-start-3', 'col-span-full']"
            >
              <ListingPageBooxBanner />
            </li>

            <li v-for="item in sortedBookstoreItems" :key="item.id">
              <NFTBookItemCardV2
                :item-id="item.classId"
                class-cover-frame-aspect-ratio="aspect-[4/5]"
                :is-link-disabled="item.isMultiple"
                :link-medium="linkMedium"
                @click-cover="handleClickItem($event, item)"
              />
            </li>

            <li
              v-if="hasMoreBookstoreItems"
              :key="bookstoreItemsPaginationOffset"
              :class="[
                'flex',
                'items-center',
                'justify-center',

                'col-span-2',
                'sm:col-span-3',
                'laptop:col-span-3',
                'desktop:col-span-4',
                'desktopLg:col-span-5',
                'full-hd:col-span-6',

                'min-h-[44px]',
                'mb-[120px]',
              ]"
            >
              <ProgressIndicator v-if="shouldShowFetchingMoreIndicator" />
              <ButtonV2
                v-else
                preset="secondary"
                :text="$t('listing_page_fetch_more')"
                @click="fetchMoreBookstoreItems"
              />
            </li>
          </ul>
        </template>

        <!-- No result -->
        <div
          v-else
          class="flex flex-col items-center justify-center gap-[12px] w-full desktop:min-h-[30vh]"
        >
          <Label
            preset="h4"
            class="text-dark-gray"
            :text="$t('listing_page_no_result')"
          />

          <!-- Search not found -->
          <template v-if="searchQuery && !isSearching">
            <Label
              preset="p5"
              class="text-dark-gray"
              :text="$t('listing_page_search_not_found')"
            />
            <Label
              preset="p5"
              class="text-medium-gray"
              :text="$t('listing_page_search_recommend')"
            />
            <NFTPageRecommendation
              class="w-full mt-[36px]"
              @item-click="handleRecommendedItemClick"
              @item-collect="handleRecommendedItemCollect"
              @slide-next.once="handleRecommendationSlideNext"
              @slide-prev.once="handleRecommendationSlidePrev"
              @slider-move.once="handleRecommendationSliderMove"
            />
          </template>

          <!-- Applied Filter -->
          <ButtonV2
            v-else-if="isFilterApplied"
            preset="tertiary"
            :text="$t('listing_page_clear_filter')"
            @click="handleFilterResetClickInEmpty"
          />
        </div>

        <footer class="flex flex-col gap-[32px]">
          <div
            :class="[
              'flex',
              'flex-col',
              'justify-center',
              'items-center',
              'gap-[24px]',

              'min-h-[200px]',
              'py-[24px]',
            ]"
          >
            <p>{{ $t('listing_page_cant_find_books') }}</p>

            <ButtonV2
              preset="secondary"
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
                  @change="handleFilterLanguageChange(item.value)"
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
            @input="handleFilterPriceChange"
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
        <ButtonV2 preset="tertiary" @click="handleFilterResetClick">{{
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
import { mapActions, mapGetters } from 'vuex';

import { EXTERNAL_HOST, LIKECOIN_API_BASE } from '~/constant';
import {
  SORTING_OPTIONS,
  PRICE_OPTIONS,
  LANGUAGE_OPTIONS,
} from '~/constant/store';

import {
  fetchBookstoreCMSTags,
  fetchBookstoreItemSearchResults,
} from '~/util/api';
import { checkIsForcedInAppPage } from '~/util/client';
import { logPurchaseFlowEvent, logTrackerEvent } from '~/util/EventLogger';
import { parseNFTMetadataURL } from '~/util/nft';

const TAGS_CONTAINER_SCROLL_BY_SIZE = 100;

const BOOKSTORE_CORE_TAG = {
  FEATURED: 'featured',
  LATEST: 'latest',
  FREE: 'free',
};

function getCMSTagIdsForRecommendedBookstoreItemsByLocale(locale = '') {
  const languages = ['zh', 'en'];
  // Return language matches with locale first
  languages.sort((a, b) => {
    if (locale.includes(a)) return -1;
    if (locale.includes(b)) return 1;
    return 0;
  });
  return languages.map(lang => `listing-${lang}`);
}

export default {
  name: 'ListingPage',
  layout: 'default',
  defaultPrice: PRICE_OPTIONS.ALL,
  defaultLanguage: LANGUAGE_OPTIONS.ALL,
  async asyncData({
    store,
    redirect,
    localeLocation,
    route,
    error,
    i18n,
    $api,
  }) {
    if (checkIsForcedInAppPage(route)) {
      redirect(301, localeLocation({ name: 'dashboard' }));
      return {};
    }

    const { t } = route.query;

    let bookstoreCMSTags = [];
    try {
      const fetches = [
        $api.$get(fetchBookstoreCMSTags({ limit: 100 })),
        ...getCMSTagIdsForRecommendedBookstoreItemsByLocale(i18n.locale).map(
          tagId =>
            store
              .dispatch('lazyFetchBookstoreCMSProductsByTagId', {
                tagId,
                t,
                limit: 100,
              })
              .catch(() => ({ records: [] }))
        ),
      ];

      if (route.query.tag) {
        fetches.push(
          store
            .dispatch('lazyFetchBookstoreCMSProductsByTagId', {
              tagId: route.query.tag,
              t,
            })
            .catch(err => {
              if (err.response?.data === 'TAG_NOT_FOUND') {
                if (route.query.tag !== BOOKSTORE_CORE_TAG.FEATURED) {
                  throw error({
                    statusCode: 404,
                    message: i18n.t('listing_page_tag_not_found'),
                  });
                } else {
                  return { records: [] };
                }
              }
              throw err;
            })
        );
      }

      const [tagsResult] = await Promise.all(fetches);
      bookstoreCMSTags = tagsResult?.records || [];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    return { bookstoreCMSTags };
  },
  data() {
    return {
      bookstoreCMSTags: [], // Fetch in asyncData

      isShowSortingDialog: false,
      isShowFilterDialog: false,
      dialogNFTClassList: [],

      isSearching: false,
      searchItems: [],

      // Tag scroll
      isTagsContainerOverflowing: false,
      isTagsContainerAtStart: true,
      isTagsContainerAtEnd: false,
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
    };
  },
  head() {
    const title = this.$t('store_index_page_title', {
      name: this.selectedTagTitle,
    });

    const description =
      this.selectedTagDescription || this.$t('store_books_page_description');
    const link = [
      {
        hid: 'i18n-can',
        rel: 'canonical',
        href: this.canonicalLink,
      },
    ];
    const classIds = this.uniqueBookstoreItems.map(item => item.classId);
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
            iscn_owner: classOwner,
          } = this.getNFTClassMetadataById(classId);
          const classOwnerPerson = classOwner
            ? {
                '@context': 'http://www.schema.org',
                '@type': 'Person',
                url: `${EXTERNAL_HOST}/${classOwner}`,
                identifier: classOwner,
              }
            : undefined;

          return {
            '@context': 'http://www.schema.org',
            '@type': 'Book',
            name: className,
            description: classDescription,
            image: parseNFTMetadataURL(classImage),
            url: `${EXTERNAL_HOST}/nft/class/${classId}`,
            author: classOwnerPerson,
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
      ],
      script: [
        {
          hid: 'schema-store',
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
      'nftGetBookstoreCMSProductsByTagId',
      'nftGetBookstoreCMSProductsByTagIdIsFetching',
      'nftGetBookstoreCMSProductsByTagIdIsFetchingMore',
      'nftGetBookstoreCMSProductsHasMoreByTagId',
      'nftGetBookstoreCMSProductsPaginationOffsetByTagId',
      'getNFTBookStorePricesByClassId',
      'getNFTClassMetadataById',
    ]),

    canonicalLink() {
      const baseUrl = `${EXTERNAL_HOST}${this.$route.path}`;
      const { tag, q } = this.$route.query;
      if (tag) {
        return `${baseUrl}?tag=${tag}`;
      }
      if (q && this.sortedBookstoreItems.length) {
        return `${baseUrl}?q=${q}`;
      }
      return baseUrl;
    },
    linkMedium() {
      const { tag, q } = this.$route.query;
      if (tag) return `tag-${tag}`;
      if (q) return 'search';
      return 'listing';
    },
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
        this.setFilterQuery({ price: value });
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
        this.setFilterQuery({ drm_free: value });
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
          text: this.$t('listing_page_select_language_zh'),
          value: LANGUAGE_OPTIONS.ZH,
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
        this.setFilterQuery({ lang: value });
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

      if (
        ![BOOKSTORE_CORE_TAG.LATEST, BOOKSTORE_CORE_TAG.FREE].includes(
          this.selectedTagId
        )
      ) {
        options.push({
          text: this.$t('listing_page_header_sort_default'),
          value: SORTING_OPTIONS.DEFAULT,
        });
      }

      options.push({
        text: this.$t('listing_page_header_sort_latest'),
        value: SORTING_OPTIONS.LATEST,
      });

      if (
        this.selectedPriceFilter !== PRICE_OPTIONS.FREE &&
        this.selectedTagId !== BOOKSTORE_CORE_TAG.FREE
      ) {
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
    defaultSorting() {
      return this.availableSorting[0].value;
    },
    selectedSorting: {
      get() {
        return (
          this.availableSorting.find(
            sort => sort.value === this.$route.query.sort
          )?.value || this.defaultSorting
        );
      },
      set(value) {
        const query = {
          ...this.$route.query,
          sort: this.availableSorting.find(sort => sort.value === value)?.value,
        };

        this.$router.push({ query });
      },
    },
    selectedSortingLabel() {
      const text = `listing_page_header_sort_${this.selectedSorting}`;
      return this.$t('listing_page_header_sort', { sort: this.$t(text) });
    },

    bookstoreItems() {
      switch (this.selectedTagId) {
        case BOOKSTORE_CORE_TAG.FEATURED:
          // Return 100 books for each locale
          return getCMSTagIdsForRecommendedBookstoreItemsByLocale(
            this.$i18n.locale
          )
            .map(tagId => this.nftGetBookstoreCMSProductsByTagId(tagId))
            .flat()
            .map((item, index) => ({ ...item, order: index + 1 }));

        case BOOKSTORE_CORE_TAG.LATEST:
        default:
          // Return books with particular tag from CMS
          return this.nftGetBookstoreCMSProductsByTagId(this.selectedTagId);
      }
    },
    bookstoreItemsPaginationOffset() {
      switch (this.selectedTagId) {
        case BOOKSTORE_CORE_TAG.FEATURED:
          // Not implemented yet
          return false;

        case BOOKSTORE_CORE_TAG.LATEST:
        default:
          return this.nftGetBookstoreCMSProductsPaginationOffsetByTagId(
            this.selectedTagId
          );
      }
    },
    hasMoreBookstoreItems() {
      switch (this.selectedTagId) {
        case BOOKSTORE_CORE_TAG.FEATURED:
          // Not implemented yet
          return false;

        case BOOKSTORE_CORE_TAG.LATEST:
        default:
          return this.nftGetBookstoreCMSProductsHasMoreByTagId(
            this.selectedTagId
          );
      }
    },
    uniqueBookstoreItems() {
      const uniqueIds = new Set();
      const dedupedItems = [];
      this.bookstoreItems.forEach(item => {
        if (!uniqueIds.has(item.classId)) {
          uniqueIds.add(item.classId);
          dedupedItems.push(item);
        }
      });
      return dedupedItems;
    },
    filteredBookstoreItems() {
      return this.uniqueBookstoreItems
        .filter(item => {
          if (this.isAppliedDRMFreeFilter) {
            return item.isDRMFree;
          }
          return true;
        })
        .filter(item => {
          if (this.selectedLanguageFilter !== LANGUAGE_OPTIONS.ALL) {
            if (Array.isArray(item.locales)) {
              return item.locales.includes(this.selectedLanguageFilter);
            }
            return this.selectedLanguageFilter.includes(item.locale);
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
    isFilterApplied() {
      return (
        this.uniqueBookstoreItems.length !== this.filteredBookstoreItems.length
      );
    },
    sortedBookstoreItems() {
      if (this.searchQuery) {
        return this.searchItems;
      }
      const items = [...this.filteredBookstoreItems];

      items.sort((a, b) => {
        switch (this.selectedSorting) {
          case SORTING_OPTIONS.DEFAULT:
            if (a.order && b.order) {
              return a.order - b.order;
            }
            if (a.order && !b.order) {
              return -1;
            }
            if (!a.order && b.order) {
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
    searchQuery: {
      get() {
        return this.$route.query.q || '';
      },
      set(value) {
        if (value === this.searchQuery) {
          return;
        }

        const query = {
          ...this.$route.query,
          tag: undefined,
          q: value,
          ll_medium: 'search',
        };
        this.$router.replace({ query });
      },
    },

    localizedBookstoreCMSTags() {
      const lang = this.$i18n.locale === 'zh-Hant' ? 'zh' : 'en';
      return this.bookstoreCMSTags.map(tag => ({
        ...tag,
        name: tag.name[lang],
        description: tag.description[lang],
      }));
    },
    bookstoreTags() {
      return [
        {
          id: BOOKSTORE_CORE_TAG.FEATURED,
          name: this.$t('tag_all_featured'),
          isPublic: true,
        },
        {
          id: BOOKSTORE_CORE_TAG.LATEST,
          name: this.$t('tag_all_latest'),
          isPublic: true,
        },
        ...this.localizedBookstoreCMSTags,
      ].map((tag, index) => ({ ...tag, index }));
    },
    bookstoreTagButtons() {
      return this.bookstoreTags
        .filter(tag => tag.isPublic)
        .map(tag => ({
          id: tag.id,
          name: tag.name,
          route: this.localeLocation({
            query: {
              ...this.$route.query,
              q: undefined,
              sort: undefined,
              price: undefined,
              drm_free: undefined,
              lang: undefined,
              tag: tag.id,
              ll_medium: `tag_${tag.id}`,
            },
          }),
        }));
    },

    selectedTagId() {
      return this.$route.query.tag || this.bookstoreTags[0]?.id;
    },
    selectedTag() {
      return this.bookstoreTags.find(tag => tag.id === this.selectedTagId);
    },
    selectedTagTitle() {
      return this.selectedTag?.name;
    },
    selectedTagDescription() {
      return this.selectedTag?.description;
    },
    tagsContainerArrowClass() {
      return [
        'flex',
        'absolute',
        'h-full',
        'z-10',
        'items-center',
        'w-[60px]',
        'text-gray-500',
        'from-transparent',
        'to-light-gray',
        'cursor-pointer',
      ];
    },

    shouldShowFullPageFetchingIndicator() {
      return (
        this.isSearching ||
        this.nftGetBookstoreCMSProductsByTagIdIsFetching(this.selectedTagId)
      );
    },
    shouldShowFetchingMoreIndicator() {
      return this.nftGetBookstoreCMSProductsByTagIdIsFetchingMore(
        this.selectedTagId
      );
    },
    shouldShowBooxBanner() {
      return !this.searchQuery && this.selectedTag?.index === 0;
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
    async searchQuery(newQuery) {
      if (newQuery) {
        await this.fetchSearchItems(newQuery);
      }
    },
    selectedTag() {
      this.scrollToTop();
    },
  },
  async mounted() {
    if (this.searchQuery) {
      await this.fetchSearchItems(this.searchQuery);
    }
    const listId =
      (this.searchQuery
        ? `search_${encodeURIComponent(this.searchQuery)}`
        : this.selectedTagId) || 'listing';
    const listName =
      (this.searchQuery
        ? `Search: ${this.searchQuery}`
        : this.selectedTagTitle) || 'All';
    logPurchaseFlowEvent(this, 'view_item_list', {
      item_list_id: listId,
      item_list_name: listName,
      items: this.sortedBookstoreItems.slice(0, 10).map(item => ({
        classId: item.classId,
        priceIndex: 0,
        name: item.title,
        price: item.minPrice,
      })),
      search_term: this.searchQuery || undefined,
      isNFTBook: true,
    });
    this.$nextTick(() => {
      this.checkTagsContainerOverflow();
    });
    this.scrollToActiveTag();
    window.addEventListener('resize', this.checkTagsContainerOverflow);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkTagsContainerOverflow);
  },
  methods: {
    ...mapActions([
      'lazyFetchBookstoreCMSProductsByTagId',
      'fetchMoreBookstoreCMSProductsByTagId',
    ]),

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    setFilterQuery(query) {
      const newQuery = { ...this.$route.query };

      /* eslint-disable camelcase */
      const { drm_free, lang, price } = query || {};

      if (!query || drm_free !== undefined) {
        newQuery.drm_free = drm_free ? '1' : undefined;
      }
      /* eslint-enable camelcase */

      if (!query || lang !== undefined) {
        newQuery.lang = Object.values(LANGUAGE_OPTIONS).includes(lang)
          ? lang
          : undefined;
      }

      if (!query || price !== undefined) {
        newQuery.price = Object.values(PRICE_OPTIONS).includes(price)
          ? price
          : undefined;
      }

      this.$router[!query ? 'replace' : 'push']({ query: newQuery });
    },

    handleFilterPriceChange(value) {
      logTrackerEvent(
        this,
        'listing',
        'listing_filter_price_clicked',
        value,
        1
      );
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
    handleFilterResetClick() {
      logTrackerEvent(this, 'listing', 'listing_filter_reset', '', 1);
      this.setFilterQuery(null);
    },
    handleFilterResetClickInEmpty() {
      this.setFilterQuery(null);
      logTrackerEvent(this, 'listing', 'listing_filter_reset_in_empty', '', 1);
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
    handleClickItem(event, item) {
      if (item.isMultiple) {
        event.preventDefault();
        this.dialogNFTClassList = item.classIds;
      }
      logTrackerEvent(this, 'listing', 'listing_item_click', item.classId, 1);
      logPurchaseFlowEvent(this, 'select_item', {
        items: [
          {
            name: item.title,
            price: item.minPrice,
            priceIndex: 0,
            classId: item.classId,
          },
        ],
        price: item.minPrice,
        currency: 'USD',
        isNFTBook: true,
      });
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
    async fetchSearchItems(query) {
      this.isSearching = true;
      try {
        logTrackerEvent(this, 'listing', 'search_query', query, 1);
        logPurchaseFlowEvent(this, 'search', {
          search_term: query,
        });
        const { list } = await this.$api.$get(
          fetchBookstoreItemSearchResults(query)
        );
        this.searchItems = list?.map(item => ({
          ...item,
          classId: item.id,
        }));
      } catch (error) {
        this.searchItems = [];
      } finally {
        this.isSearching = false;
        logPurchaseFlowEvent(this, 'view_item_list', {
          item_list_id: `search_${encodeURIComponent(query)}`,
          item_list_name: `Search: ${query}`,
          items: this.sortedBookstoreItems.slice(0, 10).map(item => ({
            classId: item.classId,
            priceIndex: 0,
            name: item.title,
            price: item.minPrice,
            currency: 'USD',
          })),
          search_term: query,
          isNFTBook: true,
        });
      }
    },
    handleRecommendedItemClick(classId) {
      logTrackerEvent(this, 'listing', 'recommend_item_click', classId, 1);
    },
    handleRecommendedItemCollect(classId) {
      logTrackerEvent(this, 'listing', 'recommend_item_collect', classId, 1);
    },
    handleRecommendationSlideNext() {
      logTrackerEvent(
        this,
        'listing',
        'recommendation_clicked_next',
        this.classId,
        1
      );
    },
    handleRecommendationSlidePrev() {
      logTrackerEvent(
        this,
        'listing',
        'recommendation_clicked_prev',
        this.classId,
        1
      );
    },
    handleRecommendationSliderMove() {
      logTrackerEvent(
        this,
        'listing',
        'recommendation_moved_slider',
        this.classId,
        1
      );
    },
    handleSearchBarOpen() {
      logTrackerEvent(this, 'listing', 'search_bar_open', '', 1);
    },
    handleSearchBarClear() {
      this.searchQuery = '';
      logTrackerEvent(this, 'listing', 'search_bar_clear', '', 1);
    },
    handleSearchBarInput(value) {
      this.searchQuery = value;
      logTrackerEvent(this, 'listing', 'search_bar_input', value, 1);
    },
    async handleTagClick(tag) {
      logTrackerEvent(this, 'listing', 'tag_click', tag.id, 1);
      if (tag.id !== BOOKSTORE_CORE_TAG.FEATURED) {
        try {
          await this.lazyFetchBookstoreCMSProductsByTagId({
            tagId: tag.id,
            t: this.$route.query.t,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }

      logPurchaseFlowEvent(this, 'view_item_list', {
        item_list_id: tag.id,
        item_list_name: tag.name,
        items: this.sortedBookstoreItems.slice(0, 10).map(item => ({
          classId: item.classId,
          priceIndex: 0,
          name: item.name,
          price: item.minPrice,
          currency: 'USD',
        })),
        isNFTBook: true,
      });
    },
    async fetchMoreBookstoreItems() {
      logTrackerEvent(
        this,
        'listing',
        'listing_fetch_more_items',
        this.selectedTagId,
        1
      );
      try {
        await this.fetchMoreBookstoreCMSProductsByTagId({
          tagId: this.selectedTagId,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    checkTagsContainerOverflow() {
      const container = this.$refs.tagsContainer;
      this.isTagsContainerOverflowing =
        container.scrollWidth > container.clientWidth;
      this.handleTagsContainerScroll();
    },
    handleTagsContainerScroll() {
      const container = this.$refs.tagsContainer;
      const tolerance = 2;

      this.isTagsContainerAtStart = container.scrollLeft <= 0;
      this.isTagsContainerAtEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - tolerance;
    },
    scrollTagsContainerLeft() {
      const container = this.$refs.tagsContainer;
      const remainingScrollLeft =
        container.scrollLeft - TAGS_CONTAINER_SCROLL_BY_SIZE;
      const isNearStart = remainingScrollLeft < TAGS_CONTAINER_SCROLL_BY_SIZE;
      if (isNearStart) {
        container.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      } else {
        container.scrollBy({
          left: -TAGS_CONTAINER_SCROLL_BY_SIZE,
          behavior: 'smooth',
        });
      }
    },
    scrollTagsContainerRight() {
      const container = this.$refs.tagsContainer;
      const tolerance = 2;
      const remainingScrollLeft =
        container.scrollWidth -
        container.clientWidth -
        container.scrollLeft -
        TAGS_CONTAINER_SCROLL_BY_SIZE;

      const isNearEnd =
        remainingScrollLeft <= TAGS_CONTAINER_SCROLL_BY_SIZE + tolerance;
      if (isNearEnd) {
        container.scrollTo({
          left: container.scrollWidth,
          behavior: 'smooth',
        });
      } else {
        container.scrollBy({
          left: TAGS_CONTAINER_SCROLL_BY_SIZE,
          behavior: 'smooth',
        });
      }
    },
    startDrag(event) {
      this.isDragging = true;
      const pageX = event.pageX || event.touches[0].pageX;
      this.startX = pageX - this.$refs.tagsContainer.offsetLeft;
      this.scrollLeft = this.$refs.tagsContainer.scrollLeft;
    },
    onDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      const pageX = event.pageX || event.touches[0].pageX;
      const x = pageX - this.$refs.tagsContainer.offsetLeft;
      const walk = (x - this.startX) * 1.5;
      this.$refs.tagsContainer.scrollLeft = this.scrollLeft - walk;
    },
    endDrag() {
      this.isDragging = false;
    },
    scrollToActiveTag() {
      this.$nextTick(() => {
        const activeTag = this.$refs.activeTag?.[0];
        const container = this.$refs.tagsContainer;

        if (activeTag && container) {
          activeTag.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      });
    },
  },
};
</script>
