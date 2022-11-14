import { mapActions, mapGetters } from 'vuex';

import {
  ORDER_CREATED_CLASS_ID_BY,
  ORDER_COLLECTED_CLASS_ID_BY,
  ORDER,
} from '~/util/nft';
import clipboardMixin from '~/mixins/clipboard';
import { logTrackerEvent } from '~/util/EventLogger';

const tabOptions = {
  collected: 'collected',
  created: 'created',
};

export default {
  tabOptions,
  mixins: [clipboardMixin],
  data() {
    return {
      isLoading: false,
      collectedOrderBy: ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT,
      collectedOrder: ORDER.DESC,
      createdOrderBy: ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP,
      createdOrder: ORDER.DESC,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfoByAddress',
      'getCreatedClassIdSorter',
      'getCollectedClassIdSorter',
      'getNFTClassIdListByAddress',
    ]),
    currentTab() {
      return this.$route.query.tab || tabOptions.collected;
    },

    userInfo() {
      return this.getUserInfoByAddress(this.wallet);
    },
    userAvatar() {
      return (
        this.userInfo?.avatar ||
        `https://avatars.dicebear.com/api/identicon/${this.wallet}/600.png?background=%23ffffff`
      );
    },
    userDisplayName() {
      return this.userInfo?.displayName || this.wallet;
    },
    nftClassIds() {
      return this.getNFTClassIdListByAddress(this.wallet);
    },

    // for userStats
    collectedClassIds() {
      return this.nftClassIds?.collected || [];
    },
    createdClassIds() {
      return this.nftClassIds?.created || [];
    },

    // for NFTCardItems
    sortedCollectedClassIds() {
      return this.getCollectedClassIdSorter({
        classIds: this.collectedClassIds,
        nftOwner: this.wallet,
        orderBy: this.collectedOrderBy,
        order: this.collectedOrder,
      });
    },
    sortedCreatedClassIds() {
      return this.getCreatedClassIdSorter({
        classIds: this.createdClassIds,
        orderBy: this.createdOrderBy,
        order: this.createdOrder,
      });
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
  methods: {
    ...mapActions(['fetchNFTListByAddress']),
    syncRouteForTab(tab = tabOptions.collected) {
      const { query } = this.$route;
      if (!query.tab || !tabOptions[query.tab] || this.currentTab !== tab) {
        this.$router.replace({
          ...this.$route,
          query: { ...query, tab },
        });
      }
    },
    async loadNFTListByAddress(address) {
      const fetchPromise = this.fetchNFTListByAddress(address);
      if (!this.getNFTClassIdListByAddress(address)) {
        this.isLoading = true;
        await fetchPromise;
        this.isLoading = false;
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
