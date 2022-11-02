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
    const image =
      this.userAvatar ||
      `https://avatars.dicebear.com/api/identicon/${this.wallet}/600.png`;
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
          content: image,
        },
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify({
            '@context': 'http://www.schema.org',
            '@type': 'Person',
            name,
            image,
            identifier: this.wallet,
          }),
          type: 'application/ld+json',
          body: true,
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
      'getCollectedNFTSorter',
      'getNFTListByAddress',
    ]),
    userAvatar() {
      return this.userInfo?.avatar;
    },
    userDisplayName() {
      return this.userInfo?.displayName || this.wallet;
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
    async loadNFTListByAddress(address) {
      this.wallet = address;
      const fetchPromise = this.fetchNFTListByAddress(address);
      if (!this.getNFTListByAddress(address)) {
        this.isLoading = true;
        await fetchPromise;
        this.isLoading = false;
      }
      if (!this.sortedCreatedClassIds.length) {
        this.currentTab = 'collected';
      }
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
      if (this.currentTab === 'collected') {
        this.collectedOrderBy = orderBy;
        this.collectedOrder = order;
      }
      if (this.currentTab === 'created') {
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
