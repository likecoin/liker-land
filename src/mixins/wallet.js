import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'getAddress',
      'getSigner',
      'getLikerInfo',
      'walletMethodType',
      'userAccountBalance',
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
        if (newAddress) this.userFetchAccountBalance(newAddress);
      },
    },
  },
  methods: {
    ...mapActions([
      'connectWallet',
      'disconnectWallet',
      'initIfNecessary',
      'restoreSession',
      'userFetchAccountBalance',
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
  },
};
