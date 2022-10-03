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
      currentTab: ['collected', 'created'].includes(this.$route.query.tab)
        ? this.$route.query.tab
        : 'created',
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters([
      'getNFTClassIdSorter',
      'getCreatedClassIdsByAddress',
      'getCollectedClassInfosByAddress',
    ]),
    userAvatar() {
      return this.userInfo?.avatar;
    },
    userDisplayName() {
      return this.userInfo?.displayName || this.wallet;
    },

    // for userStats
    collectedClassIds() {
      return (this.getCollectedClassInfosByAddress(this.wallet) || []).map(
        classInfo => classInfo.classId
      );
    },
    createdClassIds() {
      return this.getCreatedClassIdsByAddress(this.wallet) || [];
    },

    // for NFTCardItems
    sortedCollectedClassIds() {
      return this.getNFTClassIdSorter(this.collectedClassIds);
    },
    sortedCreatedClassIds() {
      return this.getNFTClassIdSorter(this.createdClassIds);
    },
  },
  methods: {
    ...mapActions(['fetchNFTListByAddress']),
    async loadNFTListByAddress(address) {
      this.wallet = address;
      if (
        !this.getCreatedClassIdsByAddress(address) ||
        !this.getCollectedClassInfosByAddress(address)
      ) {
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
  },
};
