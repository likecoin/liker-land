import { mapActions, mapGetters } from 'vuex';

import { getAccountBalance } from '~/util/nft';
import { formatNumber } from '~/util/ui';

export default {
  data() {
    return {
      balance: 0,
      formattedBalance: 0,
    };
  },
  computed: {
    ...mapGetters([
      'getAddress',
      'getSigner',
      'getLikerInfo',
      'walletMethodType',
    ]),
    isWalletUserCivicLiker() {
      return this.getLikerInfo && this.getLikerInfo.isSubscribedCivicLiker;
    },
    walletUserAvatar() {
      return (
        (this.getLikerInfo && this.getLikerInfo.avatar) ||
        `https://avatars.dicebear.com/api/identicon/${this.getAddress}.svg`
      );
    },
  },
  watch: {
    getAddress: {
      immediate: true,
      handler(newAddress) {
        if (newAddress) this.fetchWalletBalance(newAddress);
      },
    },
  },
  methods: {
    ...mapActions([
      'connectWallet',
      'disconnectWallet',
      'initIfNecessary',
      'restoreSession',
    ]),
    async navigateToMyDashboard() {
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.navigateToMyDashboard();
        }
      } else {
        this.$router.push({
          name: 'dashboard',
        });
      }
    },
    async fetchWalletBalance() {
      const balance = await getAccountBalance(this.getAddress);
      this.balance = Number(balance).toFixed(2);
      this.formattedBalance = formatNumber(Number(balance));
    },
  },
};
