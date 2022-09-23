import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  computed: {
    ...mapGetters([
      'getAddress',
      'getSigner',
      'getLikerInfo',
      'walletMethodType',
      'walletLIKEBalance',
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
        if (newAddress) this.walletFetchLIKEBalance();
      },
    },
  },
  methods: {
    ...mapActions([
      'openConnectWalletModal',
      'disconnectWallet',
      'initWallet',
      'initIfNecessary',
      'restoreSession',
      'walletFetchLIKEBalance',
    ]),
    async connectWallet() {
      const connection = await this.openConnectWalletModal();
      if (!connection) return false;
      const { method } = connection;
      logTrackerEvent(
        this,
        'user',
        `connected_wallet_${method}`,
        'connected_wallet',
        1
      );
      return this.initWallet(connection);
    },
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
