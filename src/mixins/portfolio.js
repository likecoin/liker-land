import { getUserSellNFTClasses } from '~/util/api';
import { getNFTs } from '~/util/nft';
import { copyToClipboard } from '~/util/ui';
import alertMixin from '~/mixins/alert';

export default {
  mixins: [alertMixin],
  data() {
    return {
      ownedNFTs: [],
      sellingNFTClassIds: [],
      currentTab: ['collected', 'created'].includes(this.$route.query.tab)
        ? this.$route.query.tab
        : 'created',
      isLoading: true,
    };
  },
  computed: {
    ownedNFTClassIds() {
      const classIdSet = new Set(this.ownedNFTs.map(n => n.classId));
      return Array.from(classIdSet);
    },
  },
  methods: {
    async fetchUserCollectedNFTs(wallet) {
      const { nfts } = await getNFTs({ owner: wallet });
      this.ownedNFTs = nfts;
    },
    async fetchUserSellingClasses(wallet) {
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
    copyURL(wallet) {
      const host = `${window.location.protocol}//${window.location.host}`;
      const url = `${host}/${wallet}`;
      copyToClipboard(url);
      this.alertPromptSuccess(this.$t('tooltip_share_done'));
    },
  },
};
