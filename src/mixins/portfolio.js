import { mapActions, mapGetters } from 'vuex';

import {
  NFT_CLASS_LIST_SORTING,
  NFT_CLASS_LIST_SORTING_ORDER,
  NFT_TYPE_FILTER_OPTIONS,
  checkIsWritingNFT,
  checkIsNFTBook,
} from '~/util/nft';
import {
  getTopCollectorOfUser,
  getTopCreatorOfUser,
  getIdenticonAvatar,
} from '~/util/api';

import clipboardMixin from '~/mixins/clipboard';
import userInfoMixin from '~/mixins/user-info';
import { logTrackerEvent } from '~/util/EventLogger';

export const tabOptions = {
  collected: 'collected',
  created: 'created',
};
const DEFAULT_TAB = tabOptions.collected;

const ITEMS_PER_PAGE = 10;

export const createPortfolioMixin = ({
  shouldApplyDisplayState = true,
} = {}) => ({
  tabOptions,
  mixins: [clipboardMixin, userInfoMixin],
  data() {
    return {
      isLoading: true,
      nftClassListOfCollectedSorting: NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT,
      nftClassListOfCollectedSortingOrder: NFT_CLASS_LIST_SORTING_ORDER.DESC,
      nftClassListOfCollectedShowCount: ITEMS_PER_PAGE,
      nftClassListOfCreatedSorting: NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP,
      nftClassListOfCreatedSortingOrder: NFT_CLASS_LIST_SORTING_ORDER.DESC,
      nftClassListOfCreatedShowCount: ITEMS_PER_PAGE,
      nftClassListOfOtherSorting: NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT,
      nftClassListOfOtherSortingOrder: NFT_CLASS_LIST_SORTING_ORDER.DESC,
      nftClassListOfOtherShowCount: ITEMS_PER_PAGE,
      nftCreatorFilter: [],
      userTopCollectors: [],
      userTopCreators: [],
      nftTypeFilter: NFT_TYPE_FILTER_OPTIONS.ALL,
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
    allNFTClassMap() {
      return new Map(
        [...this.nftClassListOfCreated, ...this.nftClassListOfCollected].map(
          nft => [nft.classId, nft]
        )
      );
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
    nftClassMapOfWritingNft() {
      const nftClassMapOfWritingNft = Array.from(this.allNFTClassMap.values())
        .filter(nft => {
          const classMetadata = this.getNFTClassMetadataById(nft.classId);
          const isWritingNFT = checkIsWritingNFT(classMetadata);
          return isWritingNFT;
        })
        .reduce((map, nft) => map.set(nft.classId, nft), new Map());
      return nftClassMapOfWritingNft;
    },
    nftClassMapOfNFTBook() {
      const nftClassMapOfNFTBook = Array.from(this.allNFTClassMap.values())
        .filter(nft => {
          const classMetadata = this.getNFTClassMetadataById(nft.classId);
          const isLikecoinChainNFTBook = checkIsNFTBook(classMetadata);
          return isLikecoinChainNFTBook;
        })
        .reduce((map, nft) => map.set(nft.classId, nft), new Map());
      return nftClassMapOfNFTBook;
    },
    nftClassMapOfOther() {
      const nftClassMapOfOther = Array.from(this.allNFTClassMap.values())
        .filter(
          nft =>
            !this.nftClassMapOfWritingNft.has(nft.classId) &&
            !this.nftClassMapOfNFTBook.has(nft.classId)
        )
        .reduce((map, nft) => map.set(nft.classId, nft), new Map());
      return nftClassMapOfOther;
    },
    nftTypeFilteringOptions() {
      const currentClassList =
        this.currentTab === tabOptions.collected
          ? this.nftClassListOfCollected
          : this.nftClassListOfCreated;

      const filteredOptions = Object.entries(NFT_TYPE_FILTER_OPTIONS)
        .filter(([key]) => {
          switch (key) {
            case NFT_TYPE_FILTER_OPTIONS.WRITING_NFT:
              return currentClassList.some(({ classId }) =>
                this.nftClassMapOfWritingNft.has(classId)
              );
            case NFT_TYPE_FILTER_OPTIONS.NFT_BOOK:
              return currentClassList.some(({ classId }) =>
                this.nftClassMapOfNFTBook.has(classId)
              );
            case NFT_TYPE_FILTER_OPTIONS.OTHER_NFT:
              return currentClassList.some(({ classId }) =>
                this.nftClassMapOfOther.has(classId)
              );
            case NFT_TYPE_FILTER_OPTIONS.ALL:
              return true;
            default:
              return false;
          }
        })
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
      return filteredOptions;
    },
    nftClassListOfFilteredCollectedByType() {
      let filteredCollectedList;
      switch (this.nftTypeFilter) {
        case NFT_TYPE_FILTER_OPTIONS.ALL:
          filteredCollectedList = this.nftClassListOfCollected;
          break;

        case NFT_TYPE_FILTER_OPTIONS.WRITING_NFT:
          filteredCollectedList = this.nftClassListOfCollected.filter(
            ({ classId }) => this.nftClassMapOfWritingNft.has(classId)
          );
          break;
        case NFT_TYPE_FILTER_OPTIONS.NFT_BOOK:
          filteredCollectedList = this.nftClassListOfCollected.filter(
            ({ classId }) => this.nftClassMapOfNFTBook.has(classId)
          );
          break;
        case NFT_TYPE_FILTER_OPTIONS.OTHER_NFT:
          filteredCollectedList = this.nftClassListOfCollected.filter(
            ({ classId }) => this.nftClassMapOfOther.has(classId)
          );
          break;

        default:
          break;
      }
      return filteredCollectedList;
    },
    nftClassListOfFilteredCreatedByType() {
      let filteredCreatedList;
      switch (this.nftTypeFilter) {
        case NFT_TYPE_FILTER_OPTIONS.ALL:
          filteredCreatedList = this.nftClassListOfCreated;
          break;

        case NFT_TYPE_FILTER_OPTIONS.WRITING_NFT:
          filteredCreatedList = this.nftClassListOfCreated.filter(
            ({ classId }) => this.nftClassMapOfWritingNft.has(classId)
          );
          break;
        case NFT_TYPE_FILTER_OPTIONS.NFT_BOOK:
          filteredCreatedList = this.nftClassListOfCreated.filter(
            ({ classId }) => this.nftClassMapOfNFTBook.has(classId)
          );
          break;
        case NFT_TYPE_FILTER_OPTIONS.OTHER_NFT:
          filteredCreatedList = this.nftClassListOfCreated.filter(
            ({ classId }) => this.nftClassMapOfOther.has(classId)
          );
          break;

        default:
          break;
      }
      return filteredCreatedList;
    },
    nftClassListOfFilteredCollectedByCreator() {
      let list = this.nftClassListOfFilteredCollectedByType;
      if (this.nftCreatorFilter.length) {
        list = list.filter(({ classId }) => {
          const owner = this.getNFTClassMetadataById(classId).iscn_owner;
          return this.nftCreatorFilter.includes(owner);
        });
      }
      return list;
    },
    nftClassListOfCollectedInOrder() {
      return this.getNFTClassListSorterForCollected({
        list: this.nftClassListOfFilteredCollectedByCreator,
        collectorWallet: this.wallet,
        sorting: this.nftClassListOfCollectedSorting,
        order: this.nftClassListOfCollectedSortingOrder,
        shouldApplyDisplayState,
      });
    },
    nftClassListOfCreatedInOrder() {
      return this.getNFTClassIdListSorterForCreated({
        list: this.nftClassListOfFilteredCreatedByType,
        collectorWallet: this.wallet,
        sorting: this.nftClassListOfCreatedSorting,
        order: this.nftClassListOfCreatedSortingOrder,
        shouldApplyDisplayState,
      });
    },
    nftCreatorAddressListOfCollected() {
      const ownerMap = this.nftClassListOfFilteredCollectedByType.reduce(
        (acc, { classId }) => {
          const owner = this.getNFTClassMetadataById(classId).iscn_owner;
          acc[owner] = acc[owner] || 0;
          acc[owner] += 1;
          return acc;
        },
        {}
      );
      return Object.keys(ownerMap).sort((a, b) => ownerMap[b] - ownerMap[a]);
    },
    nftCreatorInfoListOfCollected() {
      return this.nftCreatorAddressListOfCollected.map(id => {
        const user = this.getUserInfoByAddress(id);
        return {
          id,
          displayName: user?.displayName || id,
          avatar: user?.avatar || getIdenticonAvatar(id),
          isCivicLiker: user?.isSubscribedCivicLiker,
        };
      });
    },
    currentNFTClassListShowCount() {
      switch (this.currentTab) {
        case tabOptions.collected:
          return this.nftClassListOfCollectedShowCount;

        case tabOptions.created:
          return this.nftClassListOfCreatedShowCount;

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
      'fetchNFTDisplayStateListByAddress',
      'lazyGetUserInfoByAddress',
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

        default:
      }
    },
    async loadNFTListByAddress(address) {
      const fetchPromise = Promise.all([
        this.fetchNFTListByAddress(address),
        // this.fetchNFTDisplayStateListByAddress(address),
      ]);
      if (!this.getNFTListMapByAddress(address)) {
        this.isLoading = true;
        await fetchPromise;
      }
      this.isLoading = false;
    },
    async loadTopUserListByAddress(address) {
      const [collectorRes, creatorRes] = await Promise.all([
        this.$api.get(getTopCollectorOfUser(address)),
        this.$api.get(getTopCreatorOfUser(address)),
      ]);
      const collectors = (collectorRes.data.collectors || []).map(
        c => c.account
      );
      const creators = (creatorRes.data.creators || []).map(c => c.account);
      await Promise.all(
        [...new Set([].concat(...collectors, ...creators))].map(a =>
          this.lazyGetUserInfoByAddress(a)
        )
      );
      this.userTopCollectors = collectors.map(id => {
        const user = this.getUserInfoByAddress(id);
        return {
          id,
          displayName: user?.displayName || id,
          avatar: user?.avatar || getIdenticonAvatar(id),
          isCivicLiker: user?.isSubscribedCivicLiker,
        };
      });
      this.userTopCreators = creators.map(id => {
        const user = this.getUserInfoByAddress(id);
        return {
          id,
          displayName: user?.displayName || id,
          avatar: user?.avatar || getIdenticonAvatar(id),
          isCivicLiker: user?.isSubscribedCivicLiker,
        };
      });
    },
    changeTab(tab) {
      if (!tabOptions[tab]) return;
      this.syncRouteForTab(tab);
      this.nftTypeFilter = NFT_TYPE_FILTER_OPTIONS.ALL;
      this.nftCreatorFilter = [];
    },
    handleNFTClassListCreatorChange({ value }) {
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_filter_creator`,
        `Filter portfolio item by creator`,
        1
      );
      if (!value) {
        this.nftCreatorFilter = [];
      } else {
        const index = this.nftCreatorFilter.indexOf(value);
        if (index > -1) {
          this.nftCreatorFilter.splice(index, 1);
        } else {
          this.nftCreatorFilter.push(value);
        }
      }
    },
    handleNFTClassListTypeChange({ value }) {
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_filter_type`,
        `Filter portfolio item by ${value}`,
        1
      );
      this.nftTypeFilter = value;
      this.nftCreatorFilter = [];
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

        default:
          break;
      }
    },
  },
});

export default createPortfolioMixin();
