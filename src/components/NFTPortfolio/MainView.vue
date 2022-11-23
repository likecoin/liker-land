<template>
  <section
    :class="[
      'flex flex-col w-full items-center gap-[32px] pb-[48px]',
      { [narrowClass]: isNarrow },
    ]"
  >

    <nav class="relative flex-col laptop:flex-row flex items-center justify-center self-stretch gap-[32px]">
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
            @click="item.handleClick"
          />
        </li>
      </ul>
    </nav>

    <CardV2 v-if="isLoadingPortfolioItems">{{ $t('nft_portfolio_page_label_loading') }}</CardV2>
    <div
      v-else
      :class="['flex flex-col items-center gap-[32px] w-full', narrowClass]"
    >

      <div
        v-if="portfolioItemsTrimmed.length"
        class="self-stretch justify-end hidden desktop:flex"
      >
        <Dropdown>
          <template v-slot:trigger="{ toggle }">
            <ButtonV2
              :text="portfolioItemsSortingLabel"
              preset="plain"
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

      <NFTPagePrimitiveDisclaimer
        v-if="isPortfolioTabOtherActive"
        class="w-full"
        :is-portfolio="true"
      />

      <ul
        v-if="!isPortfolioTabCreatedActive || portfolioItemsTrimmed.length"
        ref="portfolioGrid"
        class="self-stretch -mx-[12px] desktop:w-[668px] transition-all"
      >
        <li v-if="!portfolioItemsTrimmed.length" class="w-full">
          <NFTPortfolioEmpty :preset="portfolioTab" />
        </li>
        <li
          v-for="nft in portfolioItemsTrimmed"
          :key="nft.classId"
          class="w-[310px] pb-[20px]"
        >
          <NFTPortfolioItem
            :class-id="nft.classId"
            :nft-id="nft.id"
            @load="updatePortfolioGrid"
          />
        </li>
      </ul>

      <div
        v-if="hasMorePortfolioItems"
        ref="infiniteScrollTrigger"
        class="animate-pulse flex items-center justify-center font-[600] text-gray-9b min-h-[240px]"
      >{{ $t('nft_portfolio_page_label_loading_more') }}</div>

      <slot name="grid-append" />
    </div>

    <template v-if="!isLoadingPortfolioItems">
      <hr class="w-[32px] h-[2px] bg-shade-gray border-none">

      <ButtonV2
        preset="outline"
        :text="$t('portfolio_finding_more_button')"
        to="/campaign/writing-nft"
      />
    </template>
  </section>
</template>

<script>
import MagicGrid from 'magic-grid';

import { NFT_CLASS_LIST_SORTING } from '~/util/nft';

import { tabOptions } from '~/mixins/portfolio';

export default {
  props: {
    isNarrow: {
      type: Boolean,
      default: false,
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
    isLoadingPortfolioItems: {
      type: Boolean,
      default: false,
    },
    isShowOtherTab: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    narrowClass() {
      return 'max-w-[644px] desktop:w-[644px]';
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
    isPortfolioTabCreatedActive() {
      return this.portfolioTab === tabOptions.created;
    },
    isPortfolioTabOtherActive() {
      return this.portfolioTab === tabOptions.other;
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

      if (this.isShowOtherTab) {
        items.push({
          text: this.$t('nft_portfolio_page_label_other'),
          value: tabOptions.other,
        });
      }

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
      if (items.length === prevItems.length && this.portfolioGridController) {
        this.$nextTick(this.updatePortfolioGrid);
      } else {
        this.$nextTick(this.setupPortfolioGrid);
      }
    },
    portfolioItemsSortingValue() {
      this.$nextTick(this.updatePortfolioGrid);
    },
    hasMorePortfolioItems(hasMorePortfolioItems) {
      if (hasMorePortfolioItems) {
        this.addInfiniteScrollListener();
      } else {
        this.removeInfiniteScrollListener();
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
        case NFT_CLASS_LIST_SORTING.PRICE:
          return this.$t('order_menu_price');

        case NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT:
        case NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP:
          return this.$t('order_menu_time');

        case NFT_CLASS_LIST_SORTING.NFT_OWNED_COUNT:
          return this.$t('order_menu_collected');

        default:
          return '';
      }
    },
    handlePortfolioSortingChange(value) {
      const [sorting, order] = value.split('-');
      this.$emit('portfolio-change-sorting', { sorting, order });
    },
    handleTabChange(tab) {
      this.$emit('portfolio-change-tab', tab);
    },
    setupPortfolioGrid() {
      const container = this.$refs.portfolioGrid;
      if (!container) return;
      this.portfolioGridController = new MagicGrid({
        container,
        items: this.portfolioItemsTrimmedCount || 1,
        gutter: 24,
        maxColumns: 2,
        useMin: true,
        animate: true,
        center: true,
      });
      this.portfolioGridController.listen();
    },
    updatePortfolioGrid() {
      if (!this.portfolioGridController) return;
      this.portfolioGridController.positionItems();
    },
    addInfiniteScrollListener() {
      window.addEventListener('scroll', this.handleInfiniteScroll);
    },
    removeInfiniteScrollListener() {
      window.removeEventListener('scroll', this.handleInfiniteScroll);
    },
    handleInfiniteScroll() {
      if (!this.hasMorePortfolioItems) return;

      const { infiniteScrollTrigger: trigger } = this.$refs;
      if (
        !trigger ||
        window.innerHeight + window.pageYOffset < trigger.offsetTop
      ) {
        return;
      }
      this.$emit('infinite-scroll', this.portfolioTab);
    },
  },
};
</script>
