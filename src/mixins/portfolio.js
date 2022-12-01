import { mapActions, mapGetters } from 'vuex';
import throat from 'throat';

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

const NFT_INFO_FETCH_CONCURRENT_REQUEST_MAX = 10;

const throttleNFTInfoFetch = throat(NFT_INFO_FETCH_CONCURRENT_REQUEST_MAX);

export default {
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
    currentTab() {
      const { tab } = this.$route.query;
      return tabOptions[tab] ? tab : DEFAULT_TAB;
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
      });
    },
    nftClassListOfCreatedInOrder() {
      return this.getNFTClassIdListSorterForCreated({
        list: this.nftClassListOfCreatedExcludedOther,
        sorting: this.nftClassListOfCreatedSorting,
        order: this.nftClassListOfCreatedSortingOrder,
      });
    },
    nftClassListOfOtherInOrder() {
      return this.getNFTClassListSorterForCollected({
        list: this.nftClassListOfOther,
        collectorWallet: this.wallet,
        sorting: this.nftClassListOfOtherSorting,
        order: this.nftClassListOfOtherSortingOrder,
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
      switch (this.currentTab) {
        case tabOptions.collected:
          return [
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
            },
          ];

        case tabOptions.created:
          return [
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
            },
          ];

        case tabOptions.other:
          return [
            {
              sorting: NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP,
              order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
            },
            {
              sorting: NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP,
              order: NFT_CLASS_LIST_SORTING_ORDER.ASC,
            },
          ];

        default:
          return [];
      }
    },
  },
  watch: {
    nftClassListMap(listMap, listMapPrev) {
      if (!listMap) return;

      const nftClassIdListSet = new Set(
        Object.values(listMap)
          .flat()
          .map(n => n.classId)
      );
      const nftClassListPrev = listMapPrev
        ? Object.values(listMapPrev).flat()
        : [];

      nftClassListPrev.forEach(({ classId }) => {
        nftClassIdListSet.delete(classId);
      });

      [...nftClassIdListSet].forEach(classId =>
        throttleNFTInfoFetch(() => this.fetchNFTClassInfo(classId))
      );
    },
  },
  methods: {
    ...mapActions([
      'fetchNFTListByAddress',
      'fetchNFTClassMetadata',
      'fetchNFTPurchaseInfo',
      'fetchNFTOwners',
    ]),
    updatePortfolioGrid() {
      const { portfolioMainView } = this.$refs;
      if (!portfolioMainView) return;
      portfolioMainView.updatePortfolioGrid();
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
      const fetchPromise = this.fetchNFTListByAddress(address);
      if (!this.getNFTListMapByAddress(address)) {
        this.isLoading = true;
        await fetchPromise;
      }
      this.isLoading = false;
    },
    async fetchNFTClassInfo(classId) {
      let metadata;
      try {
        metadata = await this.fetchNFTClassMetadata(classId);
      } catch (error) {
        if (error.response?.status !== 404) {
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error));
        }
      }
      this.$nextTick(this.updatePortfolioGrid);

      this.fetchNFTOwners(classId).catch(error => {
        if (error.response?.status !== 404) {
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error));
        }
      });

      // wait for metadata to determine if it is writing NFT
      if (checkIsWritingNFT(metadata)) {
        try {
          await this.fetchNFTPurchaseInfo(classId);
        } catch (error) {
          if (error.response?.status !== 404) {
            // eslint-disable-next-line no-console
            console.error(JSON.stringify(error));
          }
        }
        this.$nextTick(this.updatePortfolioGrid);
      }
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
};
