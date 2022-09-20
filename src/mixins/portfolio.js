import { mapActions, mapGetters } from 'vuex';

import { ellipsis } from '~/util/ui';
import clipboardMixin from '~/mixins/clipboard';

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
      collectedNFTs: [],
      sellingNFTClassIds: [],
      currentTab: ['collected', 'created'].includes(this.$route.query.tab)
        ? this.$route.query.tab
        : 'created',
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters(['getNFTClassIdSorter', 'NFTClassIdsByAddress']),
    userAvatar() {
      return this.userInfo?.avatar;
    },
    userDisplayName() {
      return this.userInfo?.displayName || this.wallet;
    },
    nftClassIds() {
      return this.NFTClassIdsByAddress(this.wallet);
    },
    collectedClassIds() {
      return this.nftClassIds?.collected || [];
    },
    createdClassIds() {
      return this.nftClassIds?.created || [];
    },
    sortedCollectedClassIds() {
      const collectedClassIdSet = new Set(this.collectedClassIds);
      const collectedClassId = Array.from(collectedClassIdSet);
      return this.getNFTClassIdSorter(
        (collectedClassId?.length && collectedClassId) || []
      );
    },
    sortedCreatedClassIds() {
      return this.getNFTClassIdSorter(
        (this.createdClassIds?.length && this.createdClassIds) || []
      );
    },
  },
  methods: {
    ...mapActions(['updateUserNFTList']),
    async updateNFTList(address) {
      if (!this.NFTClassIdsByAddress(address)) {
        this.isLoading = true;
        await this.updateUserNFTList(address);
        this.isLoading = false;
      }
      if (!this.sortedCreatedClassIds.length) {
        this.currentTab = 'collected';
      }
      this.updateUserNFTList(address);
    },
    goCollected() {
      this.currentTab = 'collected';
    },
    goCreated() {
      this.currentTab = 'created';
    },
    copySharePageURL(wallet, referrer) {
      this.copyURLPath(`/${wallet}?referrer=${referrer}`, {
        alertMessage: this.$t('tooltip_share_done'),
      });
    },
  },
};
