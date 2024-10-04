<template>
  <section
    :class="[
      'flex flex-col w-full items-center gap-[32px]',
      { [narrowClass]: isNarrow },
    ]"
  >
    <nav
      class="relative flex-col desktop:flex-row flex items-center justify-center self-stretch gap-[32px] z-[49]"
    >
      <slot name="tab-bar-prepend" />
      <ul
        :class="[
          'flex',
          'justify-center',
          'items-center',
          'p-[4px]',
          'bg-shade-gray',
          'rounded-[14px]',
        ]"
      >
        <li
          v-for="(item, index) in tabMenuItemList"
          :key="item.value"
          class="flex items-center"
        >
          <MenuButtonDivider v-if="index > 0" />
          <MenuButton
            :text="item.text"
            :is-selected="item.isSelected"
            @click="
              () => {
                item.handleClick();
                selectedFilter = 'type';
              }
            "
          />
        </li>
      </ul>
      <div
        v-if="isLoadingPortfolioItems || portfolioItemsTrimmed.length"
        :class="[
          'flex self-stretch justify-center gap-[8px] items-center desktop:justify-end',
          {
            'opacity-0 pointer-events-none': isLoadingPortfolioItems,
          },
          'desktop:absolute desktop:right-0 desktop:top-[50%] desktop:transform desktop:-translate-y-1/2',
        ]"
      >
        <div class="flex justify-center items-center gap-[16px]">
          <ButtonV2
            v-if="isBookshelf"
            :text="$t('bookshelf_view_portfolio_button')"
            preset="tertiary"
            size="mini"
            @click="goToPortfolioPage"
            ><template #prepend>
              <IconEye class="w-[12px]"/></template
          ></ButtonV2>
          <!-- filter -->
          <NFTPortfolioFilterDropdown
            :get-filter-button-preset="getFilterButtonPreset"
            :get-type-button-preset="getTypeButtonPreset"
            :get-creators-button-preset="getCreatorsButtonPreset"
            :get-keywords-button-preset="getKeywordsButtonPreset"
            :selected-filter="selectedFilter"
            :nft-type-options="nftTypeOptions"
            :is-portfolio-tab-collected-active="isPortfolioTabCollectedActive"
            :portfolio-items-type-filtering="portfolioItemsTypeFiltering"
            :portfolio-collected-creator-list-with-sorting="
              portfolioCollectedCreatorListWithSorting
            "
            :nft-keyword-list="nftKeywordList"
            :nft-keyword-filtering="nftKeywordFiltering"
            @filter-click-type-filter="selectedFilter = 'type'"
            @filter-click-creator-filter="selectedFilter = 'creators'"
            @filter-click-keyword-filter="selectedFilter = 'keywords'"
            @filter-click-clear-filter="handleResetFilter"
            @filter-change-type="handlePortfolioTypeChange"
            @filter-change-creator="handlePortfolioCreatorChange"
            @input-filter-change-creator="handleCreatorInputFilter"
            @filter-change-keyword="handleChangeKeywords"
            @input-filter-change-keyword="handleKeywordInputFilter"
          />
          <!-- sorting -->
          <Dropdown>
            <template #trigger="{ toggle }">
              <ButtonV2
                :text="portfolioItemsSortingLabel"
                preset="tertiary"
                size="mini"
                @click="toggle"
              >
                <template #append>
                  <IconASC v-if="portfolioItemsSortingOrder === 'ASC'" />
                  <IconDESC v-if="portfolioItemsSortingOrder === 'DESC'" />
                </template>
              </ButtonV2>
            </template>
            <MenuList>
              <MenuItem
                v-for="(item, i) in portfolioItemsSortingOptionListWithLabel"
                :key="i"
                :value="item.value"
                :label="item.name"
                label-align="left"
                :selected-value="portfolioItemsSortingValue"
                @select="handlePortfolioSortingChange"
              >
                <template #label-append>
                  <IconASC v-if="item.value.split('-')[1] === 'ASC'" />
                  <IconDESC v-if="item.value.split('-')[1] === 'DESC'" />
                </template>
              </MenuItem>
            </MenuList>
          </Dropdown>
        </div>
      </div>
      <div
        v-else
        :class="[
          'flex self-stretch justify-center gap-[8px] items-center desktop:justify-end',
          {
            'opacity-0 pointer-events-none': isLoadingPortfolioItems,
          },
          'desktop:absolute desktop:right-0 desktop:top-[50%] desktop:transform desktop:-translate-y-1/2',
        ]"
      >
        <ButtonV2
          v-if="isBookshelf"
          :text="$t('bookshelf_view_portfolio_button')"
          preset="tertiary"
          size="mini"
          @click="goToPortfolioPage"
          ><template #prepend>
            <IconEye class="w-[12px]" /> </template
        ></ButtonV2>
      </div>
    </nav>

    <div
      :class="[
        'flex flex-col items-center gap-[32px] w-full',
        { [narrowClass]: isNarrow },
      ]"
    >
      <slot name="before-grid" />

      <div
        v-if="isLoadingPortfolioItems"
        :class="[
          'grid',
          'grid-cols-1 laptop:grid-cols-2',
          { 'desktop:grid-cols-3': isBookshelf },
          'gap-[24px]',
          'w-full',
        ]"
      >
        <div class="flex flex-col items-center gap-[24px]">
          <NFTPortfolioItemPlaceholder
            v-for="i in 3"
            :key="`row-${i}`"
            class="w-full max-w-[310px] laptop:max-w-full"
          />
        </div>
        <div class="hidden laptop:flex flex-col gap-[24px]">
          <NFTPortfolioItemPlaceholder v-for="i in 3" :key="`row-${i}`" />
        </div>
        <div v-if="isBookshelf" class="hidden desktop:flex flex-col gap-[24px]">
          <NFTPortfolioItemPlaceholder v-for="i in 3" :key="`row-${i}`" />
        </div>
      </div>
      <ul
        ref="portfolioGrid"
        :class="[
          'self-stretch -mx-[12px] transition-all relative',
          {
            'opacity-0 pointer-events-none': isLoadingPortfolioItems,
          },
          'z-[0]',
        ]"
      >
        <li
          v-if="!portfolioItemsTrimmed.length"
          class="flex flex-col w-full gap-[24px] px-[16px]"
        >
          <NFTPortfolioEmpty :preset="portfolioTab" />
        </li>
        <li
          v-for="nft in portfolioItemsTrimmed"
          :key="nft.classId"
          class="absolute left-[12px] w-[310px] pb-[20px]"
        >
          <NFTPortfolioItem
            :class-id="nft.classId"
            :portfolio-wallet="portfolioWallet"
            :nft-id="nft.lastOwnedNFTId"
            :portfolio-tab="portfolioTab"
            :should-fetch-when-visible="true"
            @load-cover="updatePortfolioGrid"
            @click.native="handleItemClick(nft.classId)"
            @collect="handleItemCollect(nft.classId)"
          />
        </li>
      </ul>

      <div
        v-if="!isLoadingPortfolioItems && hasMorePortfolioItems"
        ref="infiniteScrollTrigger"
        class="animate-pulse flex justify-center font-[600] px-[24px] py-[128px] text-gray-9b min-h-screen"
      >
        {{ $t('nft_portfolio_page_label_loading_more') }}
      </div>

      <slot name="grid-append" />

      <div
        v-if="!portfolioItemsTrimmed.length"
        class="flex flex-col gap-[12px] w-full"
      >
        <Label
          preset="h5"
          class="text-dark-gray"
          align="center"
          :text="$t('nft_recommendation_title')"
        />
        <NFTPageRecommendation
          :is-author-specific="false"
          @item-click="handleRecommendedItemClick"
          @item-collect="handleRecommendedItemCollect"
          @slide-next.once="handleRecommendationSlideNext"
          @slide-prev.once="handleRecommendationSlidePrev"
          @slider-move.once="handleRecommendationSliderMove"
        />
      </div>
    </div>

    <template v-if="!isLoadingPortfolioItems && !isBookshelf">
      <hr class="w-[32px] h-[2px] bg-shade-gray border-none" />

      <ButtonV2
        preset="outline"
        :text="$t('portfolio_finding_more_button')"
        :to="localeLocation({ name: 'store' })"
      />
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import MagicGrid from 'magic-grid';

import { logTrackerEvent } from '~/util/EventLogger';
import { NFT_CLASS_LIST_SORTING, NFT_TYPE_FILTER_OPTIONS } from '~/util/nft';
import { ellipsis } from '~/util/ui';

import { tabOptions } from '~/mixins/portfolio';

const portfolioGridDebounceArgs = [
  60,
  {
    maxWait: 60,
    leading: false,
    trailing: true,
  },
];

const SELECTED_FILTER = {
  NFT_TYPE: 'type',
  CREATORS: 'creators',
  KEYWORDS: 'keywords',
};

export default {
  props: {
    isBookshelf: {
      type: Boolean,
      default: false,
    },
    isNarrow: {
      type: Boolean,
      default: false,
    },
    portfolioWallet: {
      type: String,
      required: true,
    },
    portfolioTab: {
      type: String,
      required: true,
    },
    portfolioItems: {
      type: Array,
      default: () => [],
    },
    portfolioItemsShowCount: {
      type: Number,
      default: 0,
    },
    portfolioItemsSorting: {
      type: String,
      required: true,
    },
    portfolioItemsSortingOptionList: {
      type: Array,
      default: () => [],
    },
    portfolioItemsSortingOrder: {
      type: String,
      required: true,
    },
    portfolioCollectedCreatorList: {
      type: Array,
      default: () => [],
    },
    portfolioItemsCreatorFiltering: {
      type: Array,
      default: () => [],
    },
    portfolioItemsTypeFiltering: {
      type: String,
      required: true,
    },
    portfolioItemsTypeFilteringOptions: {
      type: Object,
      default: () => ({}),
    },
    isLoadingPortfolioItems: {
      type: Boolean,
      default: false,
    },
    nftKeywordList: {
      type: Array,
      default: () => [],
    },
    nftKeywordFiltering: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedFilter: SELECTED_FILTER.NFT_TYPE,
    };
  },
  computed: {
    ...mapGetters(['getAddress']),
    narrowClass() {
      return 'max-w-[640px] w-full';
    },

    // Items
    portfolioItemsTrimmed() {
      return this.portfolioItems.slice(0, this.portfolioItemsShowCount);
    },
    portfolioItemsTrimmedCount() {
      return this.portfolioItemsTrimmed.length;
    },
    hasMorePortfolioItems() {
      return this.portfolioItems.length > this.portfolioItemsShowCount;
    },

    // Tab
    isPortfolioTabCollectedActive() {
      return this.portfolioTab === tabOptions.collected;
    },
    isPortfolioTabCreatedActive() {
      return this.portfolioTab === tabOptions.created;
    },

    // Filtering
    portfolioCollectedCreatorListWithSorting() {
      return this.portfolioCollectedCreatorList
        .map(creator => {
          const isSelected = this.portfolioItemsCreatorFiltering.includes(
            creator.id
          );
          return {
            ...creator,
            label: ellipsis(creator.displayName),
            isSelected,
          };
        })
        .sort((a, b) => {
          if (a.isSelected && !b.isSelected) {
            return -1;
          }
          if (!a.isSelected && b.isSelected) {
            return 1;
          }
          return 0;
        });
    },
    creatorFilterLabelText() {
      const isSelected = this.portfolioCollectedCreatorListWithSorting.filter(
        creator => creator.isSelected
      );
      return isSelected.length
        ? this.$tc('filter_menu_creator_selected', isSelected.length, {
            num: isSelected.length,
          })
        : this.$t('filter_menu_creator');
    },
    nftTypeOptions() {
      return Object.values(this.portfolioItemsTypeFilteringOptions).map(
        value => ({ value, label: this.getPortfolioTypeFilteringLabel(value) })
      );
    },
    typeFilterLabelText() {
      return this.getPortfolioTypeFilteringLabel(
        this.portfolioItemsTypeFiltering
      );
    },
    isPortfolioOtherFilterActive() {
      return this.portfolioItemsTypeFiltering === 'OTHER_NFT';
    },
    getFilterButtonPreset() {
      if (
        this.portfolioItemsTypeFiltering !== NFT_TYPE_FILTER_OPTIONS.ALL ||
        this.portfolioItemsCreatorFiltering.length ||
        this.nftKeywordFiltering.length
      )
        return 'primary';
      return 'tertiary';
    },
    getTypeButtonPreset() {
      if (this.selectedFilter === SELECTED_FILTER.NFT_TYPE) return 'primary';
      if (
        this.portfolioItemsTypeFiltering &&
        this.portfolioItemsTypeFiltering !== NFT_TYPE_FILTER_OPTIONS.ALL
      )
        return 'cyan';
      return 'tertiary';
    },
    getCreatorsButtonPreset() {
      if (this.selectedFilter === SELECTED_FILTER.CREATORS) return 'primary';
      if (this.portfolioItemsCreatorFiltering.length) return 'cyan';
      return 'tertiary';
    },
    getKeywordsButtonPreset() {
      if (this.selectedFilter === SELECTED_FILTER.KEYWORDS) return 'primary';
      if (this.nftKeywordFiltering.length) return 'cyan';
      return 'tertiary';
    },

    // Sorting
    portfolioItemsSortingOptionListWithLabel() {
      return this.portfolioItemsSortingOptionList.map(({ sorting, order }) => ({
        name: this.$t('order_menu_by', {
          order: this.getPortfolioItemsSortingLabel(sorting),
        }),
        value: `${sorting}-${order}`,
      }));
    },
    portfolioItemsSortingValue() {
      return `${this.portfolioItemsSorting}-${this.portfolioItemsSortingOrder}`;
    },
    portfolioItemsSortingLabel() {
      return this.getPortfolioItemsSortingLabel(this.portfolioItemsSorting);
    },

    // Tab bar
    tabMenuItemList() {
      const items = [
        {
          text: this.$t('nft_portfolio_page_label_collected'),
          value: tabOptions.collected,
        },
        {
          text: this.$t('nft_portfolio_page_label_created'),
          value: tabOptions.created,
        },
      ];

      return items.map(item => ({
        type: 'item',
        ...item,
        isSelected: item.value === this.portfolioTab,
        handleClick: () => this.handleTabChange(item.value),
      }));
    },
  },
  watch: {
    $route() {
      this.$nextTick(this.setupPortfolioGrid);
    },
    portfolioItemsTrimmed(items, prevItems) {
      if (this.isLoadingPortfolioItems) return;
      if (items.length === prevItems.length && this.portfolioGridController) {
        this.$nextTick(this.updatePortfolioGrid);
      } else {
        this.$nextTick(this.setupPortfolioGrid);
      }
    },
    portfolioItemsSortingValue() {
      if (this.isLoadingPortfolioItems) return;

      this.$nextTick(this.updatePortfolioGrid);
    },
    hasMorePortfolioItems(hasMorePortfolioItems) {
      if (hasMorePortfolioItems) {
        this.addInfiniteScrollListener();
      } else {
        this.removeInfiniteScrollListener();
      }
    },
    isLoadingPortfolioItems(isLoading) {
      if (!isLoading) {
        this.$nextTick(this.setupPortfolioGrid);
      }
    },
  },
  mounted() {
    if (!this.isLoadingPortfolioItems) {
      this.setupPortfolioGrid();
    }

    if (this.hasMorePortfolioItems) {
      this.addInfiniteScrollListener();
    }
  },
  beforeDestroy() {
    this.removeInfiniteScrollListener();
  },
  methods: {
    getPortfolioItemsSortingLabel(sorting) {
      switch (sorting) {
        case NFT_CLASS_LIST_SORTING.TYPE:
          return this.$t('order_menu_type');

        case NFT_CLASS_LIST_SORTING.PRICE:
          return this.$t('order_menu_price');

        case NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT:
        case NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP:
          return this.$t('order_menu_time');

        case NFT_CLASS_LIST_SORTING.NFT_OWNED_COUNT:
          return this.$t('order_menu_collected');

        case NFT_CLASS_LIST_SORTING.DISPLAY_STATE:
          return this.$t('order_menu_display_state');

        default:
          return '';
      }
    },
    getPortfolioTypeFilteringLabel(typeFiltering) {
      switch (typeFiltering) {
        case NFT_TYPE_FILTER_OPTIONS.ALL:
          return this.$t('nft_type_all_NFTs');

        case NFT_TYPE_FILTER_OPTIONS.WRITING_NFT:
          return this.$t('nft_type_writing_NFT');

        case NFT_TYPE_FILTER_OPTIONS.NFT_BOOK:
          return this.$t('nft_type_book');

        case NFT_TYPE_FILTER_OPTIONS.OTHER_NFT:
          return this.$t('nft_type_other');

        default:
          return '';
      }
    },
    handlePortfolioSortingChange(value) {
      const [sorting, order] = value.split('-');
      this.$emit('portfolio-change-sorting', { sorting, order });
    },
    handlePortfolioCreatorChange(value) {
      this.$emit('portfolio-change-creator', { value });
    },
    handlePortfolioTypeChange(value) {
      this.$emit('portfolio-change-type', { value });
    },
    handleTabChange(tab) {
      this.$emit('portfolio-change-tab', tab);
    },
    handleChangeKeywords(value) {
      this.$emit('portfolio-change-keywords', value);
    },
    handleResetFilter() {
      this.$emit('portfolio-reset-filter');
    },
    handleCreatorInputFilter(value) {
      this.$emit('portfolio-input-filter-change-creator', value);
    },
    handleKeywordInputFilter(value) {
      this.$emit('portfolio-input-filter-change-keyword', value);
    },
    setupPortfolioGrid: debounce(function setupPortfolioGrid() {
      const container = this.$refs.portfolioGrid;
      if (!container) return;
      this.portfolioGridController = new MagicGrid({
        container,
        items: this.portfolioItemsTrimmedCount || 1,
        gutter: this.isBookshelf ? 12 : 20,
        maxColumns: this.isBookshelf ? 3 : 2,
        useMin: true,
        // Note: Mitigate the layout issue by disabling transform and use absolute position
        useTransform: false,
        animate: true,
        center: true,
      });
      this.portfolioGridController.listen();
    }, ...portfolioGridDebounceArgs),
    updatePortfolioGrid: debounce(function updatePortfolioGrid() {
      if (!this.portfolioGridController) return;
      this.portfolioGridController.positionItems();
    }, ...portfolioGridDebounceArgs),
    addInfiniteScrollListener() {
      window.addEventListener('scroll', this.handleInfiniteScroll);
    },
    removeInfiniteScrollListener() {
      window.removeEventListener('scroll', this.handleInfiniteScroll);
    },
    handleInfiniteScroll: throttle(function handleInfiniteScroll() {
      if (!this.hasMorePortfolioItems) return;

      const { infiniteScrollTrigger: trigger } = this.$refs;
      if (
        !trigger ||
        window.innerHeight + window.pageYOffset < trigger.offsetTop
      ) {
        return;
      }
      this.$emit('infinite-scroll', this.portfolioTab);
    }, 2000),
    handleItemClick(classId) {
      this.$emit('item-click', classId);
    },
    handleItemCollect(classId) {
      this.$emit('item-collect', classId);
    },
    handleRecommendedItemClick(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_portfolio_recommend_item_click',
        classId,
        1
      );
    },
    handleRecommendedItemCollect(classId) {
      logTrackerEvent(
        this,
        'NFT',
        'nft_portfolio_recommend_item_collect',
        classId,
        1
      );
    },
    handleRecommendationSlideNext() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_portfolio_recommendation_clicked_next',
        this.classId,
        1
      );
    },
    handleRecommendationSlidePrev() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_portfolio_recommendation_clicked_prev',
        this.classId,
        1
      );
    },
    handleRecommendationSliderMove() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_portfolio_recommendation_moved_slider',
        this.classId,
        1
      );
    },
    goToPortfolioPage() {
      logTrackerEvent(
        this,
        'NFT',
        'nft_portfolio_clicked_view_public_page',
        this.classId,
        1
      );
      const portfolioUrl = this.localeLocation({
        name: 'id',
        params: { id: this.getAddress || this.loginAddress },
      });
      const portfolioUrlString = this.$router.resolve(portfolioUrl).href;
      window.open(portfolioUrlString, '_blank');
    },
  },
};
</script>
