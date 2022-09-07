import { mapGetters } from 'vuex';

import { getUserSellNFTClasses } from '~/util/api';
import { getNFTs } from '~/util/nft';
import { ellipsis } from '~/util/ui';
import clipboardMixin from '~/mixins/clipboard';

export default {
  mixins: [clipboardMixin],
  head() {
    const name = ellipsis(this.userDisplayName);
    const title = this.$t('portfolio_title', { name });
    const description = this.$t('portfolio_description', { name });
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
      collectedNFTs: [],
      sellingNFTClassIds: [],
      currentTab: ['collected', 'created'].includes(this.$route.query.tab)
        ? this.$route.query.tab
        : 'created',
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters(['getNFTClassIdSorter']),
    userDisplayName() {
      return this.userInfo?.displayName || this.wallet;
    },
    collectedNFTClassIds() {
      const classIdSet = new Set(this.collectedNFTs.map(n => n.classId));
      return Array.from(classIdSet);
    },
    sortedCollectedNFTClassIds() {
      return this.getNFTClassIdSorter(this.collectedNFTClassIds);
    },
    sortedSellingNFTClassIds() {
      return this.getNFTClassIdSorter(this.sellingNFTClassIds);
    },
  },
  methods: {
    async fetchUserCollectedNFTs(wallet) {
      const { nfts } = await getNFTs({ owner: wallet });
      this.collectedNFTs = nfts;
    },
    async fetchUserSellingNFTs(wallet) {
      const { data } = await this.$api.get(getUserSellNFTClasses({ wallet }));
      this.sellingNFTClassIds = data.list;
      if (!this.sellingNFTClassIds.length) {
        this.currentTab = 'collected';
      }
      this.isLoading = false;
    },
    goCollected() {
      this.currentTab = 'collected';
    },
    goCreated() {
      this.currentTab = 'created';
    },
    copySharePageURL(wallet, referrer) {
      this.copyURLPath(`${wallet}?referrer=${referrer}`, {
        alertMessage: this.$t('tooltip_share_done'),
      });
    },
  },
};
