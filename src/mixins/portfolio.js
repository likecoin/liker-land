import { mapActions, mapGetters } from 'vuex';

import {
  NFT_CLASS_LIST_SORTING,
  NFT_CLASS_LIST_SORTING_ORDER,
  checkIsWritingNFT,
} from '~/util/nft';
import clipboardMixin from '~/mixins/clipboard';
import userInfoMixin from '~/mixins/user-info';
import { logTrackerEvent } from '~/util/EventLogger';

export const tabOptions = {
  collected: 'collected',
  created: 'created',
  other: 'other',
};
const DEFAULT_TAB = tabOptions.collected;

const ITEMS_PER_PAGE = 10;

export const createPorfolioMixin = ({
  shouldApplyDisplayState = true,
} = {}) => ({
  tabOptions,
  mixins: [clipboardMixin, userInfoMixin],
  data() {
    return {
      isLoading: true,
      isInitialTabOther: this.$route.query.tab === tabOptions.other,
      nftClassListOfCollectedSorting: NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT,
      nftClassListOfCollectedSortingOrder: NFT_CLASS_LIST_SORTING_ORDER.DESC,
      nftClassListOfCollectedShowCount: ITEMS_PER_PAGE,
      nftClassListOfCreatedSorting: NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP,
      nftClassListOfCreatedSortingOrder: NFT_CLASS_LIST_SORTING_ORDER.DESC,
      nftClassListOfCreatedShowCount: ITEMS_PER_PAGE,
      nftClassListOfOtherSorting: NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT,
      nftClassListOfOtherSortingOrder: NFT_CLASS_LIST_SORTING_ORDER.DESC,
      nftClassListOfOtherShowCount: ITEMS_PER_PAGE,
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassIdListSorterForCreated',
      'getNFTClassListSorterForCollected',
      'getNFTListMapByAddress',
      'getNFTClassMetadataById',
    ]),
    isDashboardPage() {
      return this.$route.name === 'dashboard';
    },
    currentTab() {
      const { tab } = this.$route.query;
      return tabOptions[tab] ? tab : DEFAULT_TAB;
    },
    isCurrentTabCollected() {
      return this.currentTab === tabOptions.collected;
    },
    isCurrentTabCreated() {
      return this.currentTab === tabOptions.created;
    },
    isCurrentTabOther() {
      return this.currentTab === tabOptions.other;
    },
    isShowOtherTab() {
      return this.isInitialTabOther || !!this.nftClassListOfOther.length;
    },
    nftClassListMap() {
      return this.getNFTListMapByAddress(this.wallet);
    },
    nftClassListOfCollected() {
      return this.nftClassListMap?.collected || [];
    },
    nftClassListOfCreated() {
      return this.nftClassListMap?.created || [];
    },
    nftClassMapOfOther() {
      const allNFTClassMap = new Map(
        [...this.nftClassListOfCreated, ...this.nftClassListOfCollected].map(
          nft => [nft.classId, nft]
        )
      );

      const nftClassMapOfOther = new Map();
      allNFTClassMap.forEach(nft => {
        if (!checkIsWritingNFT(this.getNFTClassMetadataById(nft.classId))) {
          nftClassMapOfOther.set(nft.classId, nft);
        }
      });

      return nftClassMapOfOther;
    },
    nftClassListOfOther() {
      return [...this.nftClassMapOfOther.values()];
    },
    nftClassListOfCollectedExcludedOther() {
      return this.nftClassListOfCollected.filter(
        ({ classId }) => !this.nftClassMapOfOther.has(classId)
      );
    },
    nftClassListOfCreatedExcludedOther() {
      return this.nftClassListOfCreated.filter(
        ({ classId }) => !this.nftClassMapOfOther.has(classId)
      );
    },
    nftClassListOfCollectedInOrder() {
      return this.getNFTClassListSorterForCollected({
        list: this.nftClassListOfCollectedExcludedOther,
        collectorWallet: this.wallet,
        sorting: this.nftClassListOfCollectedSorting,
        order: this.nftClassListOfCollectedSortingOrder,
        shouldApplyDisplayState,
      });
    },
    nftClassListOfCreatedInOrder() {
      return this.getNFTClassIdListSorterForCreated({
        list: this.nftClassListOfCreatedExcludedOther,
        collectorWallet: this.wallet,
        sorting: this.nftClassListOfCreatedSorting,
        order: this.nftClassListOfCreatedSortingOrder,
        shouldApplyDisplayState,
      });
    },
    nftClassListOfOtherInOrder() {
      return this.getNFTClassListSorterForCollected({
        list: this.nftClassListOfOther,
        collectorWallet: this.wallet,
        sorting: this.nftClassListOfOtherSorting,
        order: this.nftClassListOfOtherSortingOrder,
        shouldApplyDisplayState,
      });
    },
    currentNFTClassListShowCount() {
      switch (this.currentTab) {
        case tabOptions.collected:
          return this.nftClassListOfCollectedShowCount;

        case tabOptions.created:
          return this.nftClassListOfCreatedShowCount;

        case tabOptions.other:
          return this.nftClassListOfOtherShowCount;

        default:
          return 0;
      }
    },
    currentNFTClassList() {
      switch (this.currentTab) {
        case tabOptions.collected:
          return this.nftClassListOfCollectedInOrder;

        case tabOptions.created:
          return this.nftClassListOfCreatedInOrder;

        case tabOptions.other:
          return this.nftClassListOfOtherInOrder;

        default:
          return [];
      }
    },
    currentNFTClassListSorting() {
      switch (this.currentTab) {
        case tabOptions.collected:
          return this.nftClassListOfCollectedSorting;

        case tabOptions.created:
          return this.nftClassListOfCreatedSorting;

        case tabOptions.other:
          return this.nftClassListOfOtherSorting;

        default:
          return NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP;
      }
    },
    currentNFTClassListSortingOrder() {
      switch (this.currentTab) {
        case tabOptions.collected:
          return this.nftClassListOfCollectedSortingOrder;

        case tabOptions.created:
          return this.nftClassListOfCreatedSortingOrder;

        case tabOptions.other:
          return this.nftClassListOfOtherSortingOrder;

        default:
          return NFT_CLASS_LIST_SORTING_ORDER.DESC;
      }
    },
    currentNFTClassSortingOptionList() {
      const options = [];

      switch (this.currentTab) {
        case tabOptions.collected:
          options.push(
            {
              sorting: NFT_CLASS_LIST_SORTING.PRICE,
              order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.PRICE,
              order: NFT_CLASS_LIST_SORTING_ORDER.ASC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT,
              order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT,
              order: NFT_CLASS_LIST_SORTING_ORDER.ASC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.NFT_OWNED_COUNT,
              order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
            }
          );
          break;

        case tabOptions.created:
          options.push(
            {
              sorting: NFT_CLASS_LIST_SORTING.PRICE,
              order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.PRICE,
              order: NFT_CLASS_LIST_SORTING_ORDER.ASC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP,
              order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP,
              order: NFT_CLASS_LIST_SORTING_ORDER.ASC,
            }
          );
          break;

        case tabOptions.other:
          options.push(
            {
              sorting: NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP,
              order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP,
              order: NFT_CLASS_LIST_SORTING_ORDER.ASC,
            }
          );
          break;

        default:
      }

      if (!shouldApplyDisplayState) {
        options.push({
          sorting: NFT_CLASS_LIST_SORTING.DISPLAY_STATE,
          order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
        });
      }

      return options;
    },
  },
  watch: {
    nftClassListMap(listMap) {
      if (!listMap) return;
      this.$nextTick(this.setupPortfolioGrid);
    },
  },
  methods: {
    ...mapActions([
      'fetchNFTListByAddress',
      'fetchNFTClassMetadata',
      'fetchNFTPurchaseInfo',
      'fetchNFTOwners',
      'fetchNFTDisplayStateListByAddress',
    ]),
    setupPortfolioGrid() {
      const { portfolioMainView } = this.$refs;
      if (!portfolioMainView) return;
      portfolioMainView.setupPortfolioGrid();
    },
    syncRouteForTab(tab = this.currentTab) {
      const { query } = this.$route;
      if (!query.tab || !tabOptions[query.tab] || this.currentTab !== tab) {
        this.$router.replace({
          ...this.$route,
          query: { ...query, tab },
        });
      }
    },
    handleInfiniteScroll(tab) {
      switch (tab) {
        case tabOptions.collected:
          this.nftClassListOfCollectedShowCount = Math.min(
            this.nftClassListOfCollectedShowCount + ITEMS_PER_PAGE,
            this.nftClassListOfCollected.length
          );
          break;

        case tabOptions.created:
          this.nftClassListOfCreatedShowCount = Math.min(
            this.nftClassListOfCreatedShowCount + ITEMS_PER_PAGE,
            this.nftClassListOfCreated.length
          );
          break;

        case tabOptions.other:
          this.nftClassListOfOtherShowCount = Math.min(
            this.nftClassListOfOtherShowCount + ITEMS_PER_PAGE,
            this.nftClassListOfOther.length
          );
          break;

        default:
      }
    },
    async loadNFTListByAddress(address) {
      const fetchPromise = Promise.all([
        this.fetchNFTListByAddress(address),
        this.fetchNFTDisplayStateListByAddress(address),
      ]);
      if (!this.getNFTListMapByAddress(address)) {
        this.isLoading = true;
        await fetchPromise;
      }
      this.isLoading = false;
    },
    changeTab(tab) {
      if (!tabOptions[tab]) return;
      this.syncRouteForTab(tab);
    },
    handleNFTClassListSortingChange({ sorting, order }) {
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_sort_${sorting}_${order}`,
        `Sort portfolio item in ${sorting} by ${order} order`,
        1
      );
      switch (this.currentTab) {
        case tabOptions.collected:
          this.nftClassListOfCollectedSorting = sorting;
          this.nftClassListOfCollectedSortingOrder = order;
          break;

        case tabOptions.created:
          this.nftClassListOfCreatedSorting = sorting;
          this.nftClassListOfCreatedSortingOrder = order;
          break;

        case tabOptions.other:
          this.nftClassListOfOtherSorting = sorting;
          this.nftClassListOfOtherSortingOrder = order;
          break;

        default:
          break;
      }
    },
  },
});

export default createPorfolioMixin();
