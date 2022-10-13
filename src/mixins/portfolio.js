import { mapActions, mapGetters } from 'vuex';

import { ellipsis } from '~/util/ui';
import {
  ORDER_CREATED_CLASS_ID_BY,
  ORDER_COLLECTED_CLASS_ID_BY,
  ORDER,
} from '~/util/nft';
import clipboardMixin from '~/mixins/clipboard';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  mixins: [clipboardMixin],
  head() {
    const name = ellipsis(this.userDisplayName);
    const title = this.$t('portfolio_title', { name });
    const description = this.$t('portfolio_description');
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            this.userAvatar ||
            `https://avatars.dicebear.com/api/identicon/${this.wallet}/600.png`,
        },
      ],
    };
  },
  data() {
    return {
      wallet: undefined,
      userInfo: null,
      currentTab: ['collected', 'created'].includes(this.$route.query.tab)
        ? this.$route.query.tab
        : 'created',
      isLoading: false,
      collectedOrderBy: ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT,
      collectedOrder: ORDER.DESC,
      createdOrderBy: ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP,
      createdOrder: ORDER.DESC,
    };
  },
  computed: {
    ...mapGetters([
      'getCreatedClassIdSorter',
      'getCollectedClassIdSorter',
      'getNFTClassIdListByAddress',
    ]),
    userAvatar() {
      return this.userInfo?.avatar;
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
      return this.currentTab === 'collected'
        ? this.collectedOrderBy
        : this.createdOrderBy;
    },
    currentOrder() {
      return this.currentTab === 'collected'
        ? this.collectedOrder
        : this.createdOrder;
    },
    currentOrderOptions() {
      return this.currentTab === 'collected'
        ? this.collectedOrderOptions
        : this.createdOrderOptions;
    },
    formattedOrderLabel() {
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
          value: {
            orderBy: ORDER_COLLECTED_CLASS_ID_BY.PRICE,
            order: ORDER.DESC,
          },
          name: this.$t('order_menu_price'),
          format: ORDER_COLLECTED_CLASS_ID_BY.PRICE + ORDER.DESC,
        },
        {
          value: {
            orderBy: ORDER_COLLECTED_CLASS_ID_BY.PRICE,
            order: ORDER.ASC,
          },
          name: this.$t('order_menu_price'),
          format: ORDER_COLLECTED_CLASS_ID_BY.PRICE + ORDER.ASC,
        },
        {
          value: {
            orderBy: ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT,
            order: ORDER.DESC,
          },
          name: this.$t('order_menu_time'),
          format: ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT + ORDER.DESC,
        },
        {
          value: {
            orderBy: ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT,
            order: ORDER.ASC,
          },
          name: this.$t('order_menu_time'),
          format: ORDER_COLLECTED_CLASS_ID_BY.LAST_COLLECTED_NFT + ORDER.ASC,
        },
        {
          value: {
            orderBy: ORDER_COLLECTED_CLASS_ID_BY.NFT_OWNED_COUNT,
            order: ORDER.DESC,
          },
          name: this.$t('order_menu_collected'),
          format: ORDER_COLLECTED_CLASS_ID_BY.NFT_OWNED_COUNT + ORDER.DESC,
        },
      ];
      return options;
    },
    createdOrderOptions() {
      const options = [
        {
          value: {
            orderBy: ORDER_CREATED_CLASS_ID_BY.PRICE,
            order: ORDER.DESC,
          },
          name: this.$t('order_menu_price'),
          format: ORDER_CREATED_CLASS_ID_BY.PRICE + ORDER.DESC,
        },
        {
          value: {
            orderBy: ORDER_CREATED_CLASS_ID_BY.PRICE,
            order: ORDER.ASC,
          },
          name: this.$t('order_menu_price'),
          format: ORDER_CREATED_CLASS_ID_BY.PRICE + ORDER.ASC,
        },
        {
          value: {
            orderBy: ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP,
            order: ORDER.DESC,
          },
          name: this.$t('order_menu_time'),
          format: ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP + ORDER.DESC,
        },
        {
          value: {
            orderBy: ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP,
            order: ORDER.ASC,
          },
          name: this.$t('order_menu_time'),
          format: ORDER_CREATED_CLASS_ID_BY.ISCN_TIMESTAMP + ORDER.ASC,
        },
      ];
      return options;
    },
    selectedValue() {
      return this.currentOrderBy + this.currentOrder;
    },
  },
  methods: {
    ...mapActions(['fetchNFTListByAddress']),
    async loadNFTListByAddress(address) {
      this.wallet = address;
      if (!this.getNFTClassIdListByAddress(address)) {
        this.isLoading = true;
        await this.fetchNFTListByAddress(address);
        this.isLoading = false;
      }
      if (!this.sortedCreatedClassIds.length) {
        this.currentTab = 'collected';
      }
      this.fetchNFTListByAddress(address);
    },
    goCollected() {
      this.currentTab = 'collected';
    },
    goCreated() {
      this.currentTab = 'created';
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
      logTrackerEvent(
        this,
        'sort_order',
        this.currentTab,
        `${value.orderBy} + ${value.order}`,
        1
      );
      if (this.currentTab === 'collected') {
        this.collectedOrderBy = value.orderBy;
        this.collectedOrder = value.order;
      }
      if (this.currentTab === 'created') {
        this.createdOrderBy = value.orderBy;
        this.createdOrder = value.order;
      }
    },
  },
};
