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
      isLoadingCollectedNFTClasses: true,
      isLoadingCreatedNFTClasses: true,
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
      nftCreatorInputFilter: '',
      nftKeywordsFilter: [],
      nftKeywordsInputFilter: '',
      userTopCollectors: [],
      userTopCreators: [],
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassIdListSorterForCreated',
      'getNFTClassListSorterForCollected',
      'getCollectedNFTClassesByAddress',
      'getCreatedNFTClassesByAddress',
      'getNFTClassMetadataById',
      'getNFTIscnRecordsById',
    ]),
    isDashboardPage() {
      return this.getRouteBaseName(this.$route) === 'dashboard';
    },
    currentTab() {
      const { tab } = this.$route.query;
      return tabOptions[tab] ? tab : DEFAULT_TAB;
    },
    nftTypeFilter() {
      const type = this.$route.query.type?.toUpperCase();
      return NFT_TYPE_FILTER_OPTIONS[type] ? type : NFT_TYPE_FILTER_OPTIONS.ALL;
    },
    isCurrentTabCollected() {
      return this.currentTab === tabOptions.collected;
    },
    isCurrentTabCreated() {
      return this.currentTab === tabOptions.created;
    },
    isLoading() {
      switch (this.currentTab) {
        case tabOptions.collected:
          return this.isLoadingCollectedNFTClasses;
        case tabOptions.created:
          return this.isLoadingCreatedNFTClasses;
        default:
          return true;
      }
    },
    allNFTClassMap() {
      return new Map(
        [...this.nftClassListOfCreated, ...this.nftClassListOfCollected].map(
          nft => [nft.classId, nft]
        )
      );
    },
    nftClassListOfCollected() {
      return this.isLoadingCollectedNFTClasses
        ? []
        : this.getCollectedNFTClassesByAddress(this.wallet) || [];
    },
    nftClassListOfCreated() {
      return this.isLoadingCreatedNFTClasses
        ? []
        : this.getCreatedNFTClassesByAddress(this.wallet) || [];
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
          const owner = this.getNFTClassMetadataById(classId)?.iscn_owner;
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
          const owner = this.getNFTClassMetadataById(classId)?.iscn_owner;
          acc[owner] = acc[owner] || 0;
          acc[owner] += 1;
          return acc;
        },
        {}
      );
      return Object.keys(ownerMap).sort((a, b) => ownerMap[b] - ownerMap[a]);
    },
    nftCreatorInfoListOfCollected() {
      return this.nftCreatorAddressListOfCollected
        .map(id => {
          const user = this.getUserInfoByAddress(id);
          const likerId = user?.user || id;
          const displayName = user?.displayName || id;
          const avatar = user?.avatar || getIdenticonAvatar(id);
          const isCivicLiker = user?.isSubscribedCivicLiker;
          return { id, likerId, displayName, avatar, isCivicLiker };
        })
        .filter(item => {
          if (!this.nftCreatorInputFilter) return true;
          const lowerCaseInputFilter = this.nftCreatorInputFilter.toLowerCase();
          return (
            item.displayName.toLowerCase().includes(lowerCaseInputFilter) ||
            item.likerId.toLowerCase().includes(lowerCaseInputFilter) ||
            item.id.includes(lowerCaseInputFilter)
          );
        });
    },
    nftKeywordList() {
      const keywords = [];
      const currentClassList =
        this.currentTab === tabOptions.collected
          ? this.nftClassListOfCollectedInOrder
          : this.nftClassListOfCreatedInOrder;

      currentClassList.forEach(({ classId }) => {
        const record = this.getNFTIscnRecordsById(classId);
        const keyword = record?.contentMetadata?.keywords?.split(',');
        if (keyword) {
          keywords.push(keyword.map(k => k.trim()));
        }
      });

      const lowerCaseInputFilter =
        this.nftKeywordsInputFilter?.toLowerCase() || '';
      return [
        ...new Set(
          keywords
            .flat()
            .filter(
              k => Boolean(k) && k.toLowerCase().includes(lowerCaseInputFilter)
            )
        ),
      ];
    },
    nftClassListOfFilteredByKeywords() {
      const currentClassList =
        this.currentTab === tabOptions.collected
          ? this.nftClassListOfCollectedInOrder
          : this.nftClassListOfCreatedInOrder;

      let list = currentClassList;
      if (this.nftKeywordsFilter.length) {
        list = list.filter(({ classId }) => {
          const record = this.getNFTIscnRecordsById(classId);
          const keywords = record?.contentMetadata?.keywords?.split(',') || [];
          return keywords.some(keyword =>
            this.nftKeywordsFilter.includes(keyword.trim())
          );
        });
      }
      return list;
    },
    currentNFTClassList() {
      const sortedList =
        this.currentTab === tabOptions.collected
          ? this.getNFTClassListSorterForCollected({
              list: this.nftClassListOfFilteredByKeywords,
              collectorWallet: this.wallet,
              sorting: this.nftClassListOfCollectedSorting,
              order: this.nftClassListOfCollectedSortingOrder,
              shouldApplyDisplayState,
            })
          : this.getNFTClassIdListSorterForCreated({
              list: this.nftClassListOfFilteredByKeywords,
              collectorWallet: this.wallet,
              sorting: this.nftClassListOfCreatedSorting,
              order: this.nftClassListOfCreatedSortingOrder,
              shouldApplyDisplayState,
            });
      return sortedList;
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
    shouldCurrentSortingShowType() {
      const currentClassList =
        this.currentTab === tabOptions.collected
          ? this.nftClassListOfCollectedInOrder
          : this.nftClassListOfCreatedInOrder;

      return (
        (this.nftTypeFilter === NFT_TYPE_FILTER_OPTIONS.ALL &&
          currentClassList.some(({ classId }) =>
            this.nftClassMapOfNFTBook.has(classId)
          )) ||
        currentClassList.some(({ classId }) =>
          this.nftClassMapOfOther.has(classId)
        )
      );
    },
    currentNFTClassSortingOptionList() {
      const options = [];

      if (this.shouldCurrentSortingShowType) {
        options.push({
          sorting: NFT_CLASS_LIST_SORTING.TYPE,
          order: NFT_CLASS_LIST_SORTING_ORDER.DESC,
        });
      }

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
    nftClassListOfCollected(list) {
      if (!list) return;
      this.$nextTick(this.setupPortfolioGrid);
    },
    nftClassListOfCreated(list) {
      if (!list) return;
      this.$nextTick(this.setupPortfolioGrid);
    },
    shouldCurrentSortingShowType() {
      if (this.shouldCurrentSortingShowType) {
        this.nftClassListOfCollectedSorting = NFT_CLASS_LIST_SORTING.TYPE;
        this.nftClassListOfCreatedSorting = NFT_CLASS_LIST_SORTING.TYPE;
      } else {
        this.nftClassListOfCollectedSorting =
          NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT;
        this.nftClassListOfCreatedSorting =
          NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP;
      }
    },
  },
  methods: {
    ...mapActions([
      'fetchCollectedNFTClassesByAddress',
      'fetchCreatedNFTClassesByAddress',
      'fetchNFTDisplayStateListByAddress',
      'lazyGetUserInfoByAddress',
    ]),
    setupPortfolioGrid() {
      const { portfolioMainView } = this.$refs;
      if (!portfolioMainView) return;
      portfolioMainView.setupPortfolioGrid();
    },
    syncRouteQuery({
      tab = this.currentTab,
      type: inputType = this.nftTypeFilter,
    } = {}) {
      const { query } = this.$route;
      const queryTab = query.tab;
      const queryType = query.type?.toUpperCase();

      let type = inputType;

      const newQuery = {};

      if (!queryTab || !tabOptions[queryTab] || this.currentTab !== tab) {
        newQuery.tab = tab;
        type = NFT_TYPE_FILTER_OPTIONS.ALL;
      }

      if (
        !queryType ||
        !NFT_TYPE_FILTER_OPTIONS[queryType] ||
        this.nftTypeFilter !== type
      ) {
        newQuery.type =
          type === NFT_TYPE_FILTER_OPTIONS.ALL ? undefined : type.toLowerCase();
      }

      if (Object.keys(newQuery).length) {
        this.$router.replace({
          ...this.$route,
          query: { ...query, ...newQuery },
        });
      }
    },
    syncRouteForTab(tab) {
      this.syncRouteQuery({ tab });
    },
    syncRouteForTypeFilter(type) {
      this.syncRouteQuery({ type });
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
      this.fetchCollectedNFTClassesByAddress(address).then(() => {
        this.isLoadingCollectedNFTClasses = false;
      });
      this.fetchCreatedNFTClassesByAddress(address).then(() => {
        this.isLoadingCreatedNFTClasses = false;
      });
      await this.fetchNFTDisplayStateListByAddress(address);
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
      this.nftCreatorFilter = [];
      this.nftKeywordsFilter = [];
    },
    handleCreatorInputFilterChange(creator) {
      this.nftCreatorInputFilter = creator;
    },
    handleKeywordInputFilterChange(keyword) {
      this.nftKeywordsInputFilter = keyword;
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
      this.nftKeywordsFilter = [];
    },
    handleNFTClassListTypeChange({ value }) {
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_filter_type`,
        `Filter portfolio item by ${value}`,
        1
      );
      this.syncRouteForTypeFilter(value);
      this.nftCreatorFilter = [];
      this.nftKeywordsFilter = [];
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
    handleNFTKeywordsChange(value) {
      const index = this.nftKeywordsFilter.indexOf(value);
      if (index !== -1) {
        this.nftKeywordsFilter.splice(index, 1);
        logTrackerEvent(
          this,
          'portfolio',
          `portfolio_filter_keywords`,
          `Filter portfolio item by ${value}`,
          1
        );
      } else {
        this.nftKeywordsFilter.push(value);
        logTrackerEvent(
          this,
          'portfolio',
          `portfolio_filter_keywords`,
          `Filter portfolio item by ${value}`,
          1
        );
      }
    },
    handleClearFilter() {
      this.syncRouteForTypeFilter(NFT_TYPE_FILTER_OPTIONS.ALL);
      this.nftKeywordsFilter = [];
      this.nftCreatorFilter = [];
    },
  },
});

export default createPortfolioMixin();
