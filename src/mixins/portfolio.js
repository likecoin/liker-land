import { mapActions, mapGetters } from 'vuex';
import MagicGrid from 'magic-grid';
import throat from 'throat';

import {
  ORDER_CREATED_CLASS_ID_BY,
  ORDER_COLLECTED_CLASS_ID_BY,
  ORDER,
} from '~/util/nft';
import clipboardMixin from '~/mixins/clipboard';
import userInfoMixin from '~/mixins/user-info';
import { logTrackerEvent } from '~/util/EventLogger';

const tabOptions = {
  collected: 'collected',
  created: 'created',
};

const ITEMS_PER_PAGE = 10;

const fetchNFTInfoLimit = throat(10);

export default {
  tabOptions,
  mixins: [clipboardMixin, userInfoMixin],
  data() {
    return {
      isLoading: false,
      collectedOrderBy: ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT,
      collectedOrder: ORDER.DESC,
      collectedLimit: ITEMS_PER_PAGE,
      createdOrderBy: ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP,
      createdOrder: ORDER.DESC,
      createdLimit: ITEMS_PER_PAGE,
    };
  },
  computed: {
    ...mapGetters([
      'getCreatedClassIdSorter',
      'getCollectedNFTSorter',
      'getNFTListByAddress',
    ]),
    currentTab() {
      return this.$route.query.tab || tabOptions.collected;
    },

    hasMoreNFTs() {
      return this.currentTab === tabOptions.collected
        ? this.collectedLimit < this.collectedNFTs?.length
        : this.createdLimit < this.createdClassIds?.length;
    },
    nftList() {
      return this.getNFTListByAddress(this.wallet);
    },
    collectedNFTs() {
      return this.nftList?.collected || [];
    },

    // for userStats
    collectedClassIds() {
      return this.collectedNFTs.map(({ classId }) => classId);
    },
    createdClassIds() {
      return this.nftList?.created.map(({ classId }) => classId) || [];
    },

    // for NFTCardItems
    sortedCollectedNFTs() {
      return this.getCollectedNFTSorter({
        nfts: this.collectedNFTs,
        nftOwner: this.wallet,
        orderBy: this.collectedOrderBy,
        order: this.collectedOrder,
      }).slice(0, this.collectedLimit);
    },
    sortedCreatedClassIds() {
      return this.getCreatedClassIdSorter({
        classIds: this.createdClassIds,
        orderBy: this.createdOrderBy,
        order: this.createdOrder,
      }).slice(0, this.createdLimit);
    },
    currentOrderBy() {
      return this.currentTab === tabOptions.collected
        ? this.collectedOrderBy
        : this.createdOrderBy;
    },
    currentOrder() {
      return this.currentTab === tabOptions.collected
        ? this.collectedOrder
        : this.createdOrder;
    },
    currentOrderOptions() {
      return this.currentTab === tabOptions.collected
        ? this.collectedOrderOptions
        : this.createdOrderOptions;
    },
    label() {
      let formattedOrderBy = '';
      switch (this.currentOrderBy) {
        case ORDER_COLLECTED_CLASS_ID_BY.PRICE:
        case ORDER_CREATED_CLASS_ID_BY.PRICE:
          formattedOrderBy = this.$t('order_menu_price');
          break;
        case ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT:
        case ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP:
          formattedOrderBy = this.$t('order_menu_time');
          break;
        case ORDER_COLLECTED_CLASS_ID_BY.NFT_OWNED_COUNT:
          formattedOrderBy = this.$t('order_menu_collected');
          break;
        default:
          break;
      }
      return formattedOrderBy;
    },
    collectedOrderOptions() {
      const options = [
        {
          value: `${ORDER_COLLECTED_CLASS_ID_BY.PRICE}-${ORDER.DESC}`,
          name: this.formatOrder(this.$t('order_menu_price')),
        },
        {
          value: `${ORDER_COLLECTED_CLASS_ID_BY.PRICE}-${ORDER.ASC}`,
          name: this.formatOrder(this.$t('order_menu_price')),
        },
        {
          value: `${ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT}-${
            ORDER.DESC
          }`,
          name: this.formatOrder(this.$t('order_menu_time')),
        },
        {
          value: `${ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT}-${
            ORDER.ASC
          }`,
          name: this.formatOrder(this.$t('order_menu_time')),
        },
        {
          value: `${ORDER_COLLECTED_CLASS_ID_BY.NFT_OWNED_COUNT}-${ORDER.DESC}`,
          name: this.formatOrder(this.$t('order_menu_collected')),
        },
      ];
      return options;
    },
    createdOrderOptions() {
      const options = [
        {
          value: `${ORDER_CREATED_CLASS_ID_BY.PRICE}-${ORDER.DESC}`,
          name: this.formatOrder(this.$t('order_menu_price')),
        },
        {
          value: `${ORDER_CREATED_CLASS_ID_BY.PRICE}-${ORDER.ASC}`,
          name: this.formatOrder(this.$t('order_menu_price')),
        },
        {
          value: `${ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP}-${ORDER.DESC}`,
          name: this.formatOrder(this.$t('order_menu_time')),
        },
        {
          value: `${ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP}-${ORDER.ASC}`,
          name: this.formatOrder(this.$t('order_menu_time')),
        },
      ];
      return options;
    },
    selectedValue() {
      return `${this.currentOrderBy}-${this.currentOrder}`;
    },
  },
  watch: {
    currentTab() {
      this.$nextTick(this.setupNFTGrid);
    },
    sortedCollectedNFTs(list, prevList) {
      this.$nextTick(
        list?.length !== prevList?.length
          ? this.setupNFTGrid
          : this.updateNFTGrid
      );
    },
    sortedCreatedClassIds(list, prevList) {
      this.$nextTick(
        list?.length !== prevList?.length
          ? this.setupNFTGrid
          : this.updateNFTGrid
      );
    },
    collectedNFTs(nfts) {
      nfts.map(({ classId }) =>
        fetchNFTInfoLimit(() => this.fetchNFTInfo(classId))
      );
    },
    createdClassIds(classIds) {
      classIds.map(classId =>
        fetchNFTInfoLimit(() => this.fetchNFTInfo(classId))
      );
    },
    hasMoreNFTs(hasMoreNFTs) {
      if (hasMoreNFTs) {
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
    syncRouteForTab(tab = tabOptions.collected) {
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
      if (!this.hasMoreNFTs) return;

      const { loadingMore: trigger } = this.$refs;
      if (
        !trigger ||
        window.innerHeight + window.pageYOffset < trigger.offsetTop
      ) {
        return;
      }

      if (this.currentTab === tabOptions.collected) {
        this.collectedLimit = Math.min(
          this.collectedLimit + ITEMS_PER_PAGE,
          this.collectedNFTs.length
        );
      } else {
        this.createdLimit = Math.min(
          this.createdLimit + ITEMS_PER_PAGE,
          this.createdClassIds.length
        );
      }
    },
    async loadNFTListByAddress(address) {
      const fetchPromise = this.fetchNFTListByAddress(address);
      if (!this.getNFTListByAddress(address)) {
        this.isLoading = true;
        await fetchPromise;
        this.isLoading = false;
      }
    },
    async fetchNFTInfo(classId) {
      try {
        await this.fetchNFTMetadata(classId);
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
      if (this.isWritingNFT) {
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
      this.syncRouteForTab(tab);
    },
    goCollectedTab() {
      this.changeTab(tabOptions.collected);
    },
    goCreatedTab() {
      this.changeTab(tabOptions.created);
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
      const items =
        this.currentTab === 'collected'
          ? this.sortedCollectedNFTs.length
          : this.sortedCreatedClassIds.length;
      this.nftGridController = new MagicGrid({
        container: nftGrid,
        items: items || 1,
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
    handleSelectOrder(value) {
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
      if (this.currentTab === tabOptions.collected) {
        this.collectedOrderBy = orderBy;
        this.collectedOrder = order;
      }
      if (this.currentTab === tabOptions.created) {
        this.createdOrderBy = orderBy;
        this.createdOrder = order;
      }
    },
    formatOrder(order) {
      return this.$t('order_menu_by', {
        order,
      });
    },
  },
};
