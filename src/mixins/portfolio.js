import { mapActions, mapGetters } from 'vuex';
import MagicGrid from 'magic-grid';
import throat from 'throat';

import {
  NFT_CLASS_LIST_SORTING,
  NFT_CLASS_LIST_SORTING_ORDER,
  isWritingNFT,
} from '~/util/nft';
import clipboardMixin from '~/mixins/clipboard';
import userInfoMixin from '~/mixins/user-info';
import { logTrackerEvent } from '~/util/EventLogger';

const tabOptions = {
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
      isLoading: false,
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
      return this.isCurrentTabOther || this.nftClassListOfOther.length;
    },

    hasMoreNFTClassListItems() {
      switch (this.currentTab) {
        case tabOptions.collected:
          return (
            this.nftClassListOfCollectedShowCount <
            this.nftClassListOfCollected?.length
          );

        case tabOptions.created:
          return (
            this.nftClassListOfCreatedShowCount <
            this.nftClassListOfCreated?.length
          );

        case tabOptions.other:
          return (
            this.nftClassListOfOtherShowCount < this.nftClassListOfOther?.length
          );

        default:
          return false;
      }
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
        if (!isWritingNFT(this.getNFTClassMetadataById(nft.classId))) {
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
      }).slice(0, this.nftClassListOfCollectedShowCount);
    },
    nftClassListOfCreatedInOrder() {
      return this.getNFTClassIdListSorterForCreated({
        list: this.nftClassListOfCreatedExcludedOther,
        sorting: this.nftClassListOfCreatedSorting,
        order: this.nftClassListOfCreatedSortingOrder,
      }).slice(0, this.nftClassListOfCreatedShowCount);
    },
    nftClassListOfOtherInOrder() {
      return this.getNFTClassListSorterForCollected({
        list: this.nftClassListOfOther,
        collectorWallet: this.wallet,
        sorting: this.nftClassListOfOtherSorting,
        order: this.nftClassListOfOtherSortingOrder,
      }).slice(0, this.nftClassListOfOtherShowCount);
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
    currentNFTClassListOrder() {
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
          return this.nftClassOfCollectedSortingOptionList;

        case tabOptions.created:
          return this.nftClassOfCreatedSortingOptionList;

        case tabOptions.other:
          return this.nftClassOfOtherSortingOptionList;

        default:
          return [];
      }
    },
    currentNFTClassSortingLabel() {
      let label = '';
      switch (this.currentNFTClassListSorting) {
        case NFT_CLASS_LIST_SORTING.PRICE:
          label = this.$t('order_menu_price');
          break;

        case NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT:
        case NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP:
          label = this.$t('order_menu_time');
          break;

        case NFT_CLASS_LIST_SORTING.NFT_OWNED_COUNT:
          label = this.$t('order_menu_collected');
          break;

        default:
          break;
      }
      return label;
    },
    nftClassOfCollectedSortingOptionList() {
      return [
        {
          value: `${NFT_CLASS_LIST_SORTING.PRICE}-${
            NFT_CLASS_LIST_SORTING_ORDER.DESC
          }`,
          name: this.formatNFTClassListSortingLabel(
            this.$t('order_menu_price')
          ),
        },
        {
          value: `${NFT_CLASS_LIST_SORTING.PRICE}-${
            NFT_CLASS_LIST_SORTING_ORDER.ASC
          }`,
          name: this.formatNFTClassListSortingLabel(
            this.$t('order_menu_price')
          ),
        },
        {
          value: `${NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT}-${
            NFT_CLASS_LIST_SORTING_ORDER.DESC
          }`,
          name: this.formatNFTClassListSortingLabel(this.$t('order_menu_time')),
        },
        {
          value: `${NFT_CLASS_LIST_SORTING.LAST_COLLECTED_NFT}-${
            NFT_CLASS_LIST_SORTING_ORDER.ASC
          }`,
          name: this.formatNFTClassListSortingLabel(this.$t('order_menu_time')),
        },
        {
          value: `${NFT_CLASS_LIST_SORTING.NFT_OWNED_COUNT}-${
            NFT_CLASS_LIST_SORTING_ORDER.DESC
          }`,
          name: this.formatNFTClassListSortingLabel(
            this.$t('order_menu_collected')
          ),
        },
      ];
    },
    nftClassOfCreatedSortingOptionList() {
      return [
        {
          value: `${NFT_CLASS_LIST_SORTING.PRICE}-${
            NFT_CLASS_LIST_SORTING_ORDER.DESC
          }`,
          name: this.formatNFTClassListSortingLabel(
            this.$t('order_menu_price')
          ),
        },
        {
          value: `${NFT_CLASS_LIST_SORTING.PRICE}-${
            NFT_CLASS_LIST_SORTING_ORDER.ASC
          }`,
          name: this.formatNFTClassListSortingLabel(
            this.$t('order_menu_price')
          ),
        },
        {
          value: `${NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP}-${
            NFT_CLASS_LIST_SORTING_ORDER.DESC
          }`,
          name: this.formatNFTClassListSortingLabel(this.$t('order_menu_time')),
        },
        {
          value: `${NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP}-${
            NFT_CLASS_LIST_SORTING_ORDER.ASC
          }`,
          name: this.formatNFTClassListSortingLabel(this.$t('order_menu_time')),
        },
      ];
    },
    nftClassOfOtherSortingOptionList() {
      return [
        {
          value: `${NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP}-${
            NFT_CLASS_LIST_SORTING_ORDER.DESC
          }`,
          name: this.formatNFTClassListSortingLabel(this.$t('order_menu_time')),
        },
        {
          value: `${NFT_CLASS_LIST_SORTING.ISCN_TIMESTAMP}-${
            NFT_CLASS_LIST_SORTING_ORDER.ASC
          }`,
          name: this.formatNFTClassListSortingLabel(this.$t('order_menu_time')),
        },
      ];
    },
    currentNFTClassListSortingValue() {
      return `${this.currentNFTClassListSorting}-${
        this.currentNFTClassListOrder
      }`;
    },
  },
  watch: {
    currentTab() {
      this.$nextTick(this.setupNFTGrid);
    },
    currentNFTClassList(list, prevList) {
      this.$nextTick(
        list?.length !== prevList?.length
          ? this.setupNFTGrid
          : this.updateNFTGrid
      );
    },
    nftClassListMap(listMap) {
      Object.values(listMap)
        .flat()
        .forEach(({ classId }) =>
          throttleNFTInfoFetch(() => this.fetchNFTClassInfo(classId))
        );
    },
    hasMoreNFTClassListItems(hasMoreNFTClassListItems) {
      if (hasMoreNFTClassListItems) {
        this.addInfiniteScrollListener();
      } else {
        this.removeInfiniteScrollListener();
      }
    },
  },
  beforeDestroy() {
    this.removeInfiniteScrollListener();
  },
  methods: {
    ...mapActions([
      'fetchNFTListByAddress',
      'fetchNFTMetadata',
      'fetchNFTPurchaseInfo',
      'fetchNFTOwners',
    ]),
    syncRouteForTab(tab = this.currentTab) {
      const { query } = this.$route;
      if (!query.tab || !tabOptions[query.tab] || this.currentTab !== tab) {
        this.$router.replace({
          ...this.$route,
          query: { ...query, tab },
        });
      }
    },
    addInfiniteScrollListener() {
      window.addEventListener('scroll', this.handleInfiniteScroll);
    },
    removeInfiniteScrollListener() {
      window.removeEventListener('scroll', this.handleInfiniteScroll);
    },
    handleInfiniteScroll() {
      if (!this.hasMoreNFTClassListItems) return;

      const { loadingMore: trigger } = this.$refs;
      if (
        !trigger ||
        window.innerHeight + window.pageYOffset < trigger.offsetTop
      ) {
        return;
      }

      switch (this.currentTab) {
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
        this.isLoading = false;
      }
    },
    async fetchNFTClassInfo(classId) {
      let metadata;
      try {
        metadata = await this.fetchNFTMetadata(classId);
      } catch (error) {
        if (error.response?.status !== 404) {
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error));
        }
      }
      this.$nextTick(this.updateNFTGrid);

      this.fetchNFTOwners(classId).catch(error => {
        if (error.response?.status !== 404) {
          // eslint-disable-next-line no-console
          console.error(JSON.stringify(error));
        }
      });

      // wait for metadata to determine if it is writing NFT
      if (isWritingNFT(metadata)) {
        try {
          await this.fetchNFTPurchaseInfo(classId);
        } catch (error) {
          if (error.response?.status !== 404) {
            // eslint-disable-next-line no-console
            console.error(JSON.stringify(error));
          }
        }
        this.$nextTick(this.updateNFTGrid);
      }
    },
    changeTab(tab) {
      if (!tabOptions[tab]) return;
      this.syncRouteForTab(tab);
    },
    goCollectedTab() {
      this.changeTab(tabOptions.collected);
    },
    goCreatedTab() {
      this.changeTab(tabOptions.created);
    },
    goOtherTab() {
      this.changeTab(tabOptions.other);
    },
    copySharePageURL(wallet, referrer) {
      this.shareURLPath({
        title: this.userDisplayName,
        text: this.userDisplayName,
        path: `/${wallet}?referrer=${referrer}`,
        alertMessage: this.$t('tooltip_share_done'),
      });
    },
    setupNFTGrid() {
      const { nftGrid } = this.$refs;
      if (!nftGrid) return;
      this.nftGridController = new MagicGrid({
        container: nftGrid,
        items: this.currentNFTClassList.length || 1,
        gutter: 24,
        maxColumns: 2,
        useMin: true,
        animate: true,
        center: true,
      });
      this.nftGridController.listen();
    },
    updateNFTGrid() {
      if (!this.nftGridController) return;
      this.nftGridController.positionItems();
    },
    handleNFTClassListSortingChange(value) {
      const splits = value.split('-');
      const orderBy = splits[0];
      const order = splits[1];
      logTrackerEvent(
        this,
        'portfolio',
        `portfolio_sort_${orderBy}_${order}`,
        `Sort portfolio item in ${splits[0]} by ${order} order`,
        1
      );
      switch (this.currentTab) {
        case tabOptions.collected:
          this.nftClassListOfCollectedSorting = orderBy;
          this.nftClassListOfCollectedSortingOrder = order;
          break;

        case tabOptions.created:
          this.nftClassListOfCreatedSorting = orderBy;
          this.nftClassListOfCreatedSortingOrder = order;
          break;

        case tabOptions.other:
          this.nftClassListOfOtherSorting = orderBy;
          this.nftClassListOfOtherSortingOrder = order;
          break;

        default:
          break;
      }
    },
    formatNFTClassListSortingLabel(order) {
      return this.$t('order_menu_by', {
        order,
      });
    },
  },
};
