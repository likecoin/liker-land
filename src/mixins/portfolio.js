import { mapActions, mapGetters } from 'vuex';

import {
  NFT_CLASS_LIST_SORTING,
  NFT_CLASS_LIST_SORTING_ORDER,
  checkIsWritingNFT,
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
      nftCreatorFilter: [],
      userTopCollectors: [],
      userTopCreators: [],
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
    nftClassListOfFilteredCollectedExcludedOther() {
      let list = this.nftClassListOfCollectedExcludedOther;
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
        list: this.nftClassListOfFilteredCollectedExcludedOther,
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
    nftCreatorAddressListOfCollected() {
      const ownerMap = this.nftClassListOfCollectedExcludedOther.reduce(
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
    },
    handleNFTClassListFilteringChange({ type, value }) {
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_filter_${type}`,
        `Filter portfolio item by ${type}`,
        1
      );
      switch (type) {
        case 'creator':
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
          break;

        default:
          break;
      }
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
