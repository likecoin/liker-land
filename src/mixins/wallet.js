import { mapActions, mapGetters } from 'vuex';

import { getIdenticonAvatar } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { getLikerIdSettingsURL } from '~/util/links';

export default {
  computed: {
    ...mapGetters([
      'getAddress',
      'getSigner',
      'getLikerInfo',
      'getLocale',
      'walletMethodType',
      'walletLIKEBalance',
      'walletLIKEBalanceFetchPromise',
    ]),
    hasConnectedWallet() {
      return !!this.getAddress && !!this.walletMethodType;
    },
    isWalletUserCivicLiker() {
      return this.getLikerInfo && this.getLikerInfo.isSubscribedCivicLiker;
    },
    walletUserAvatar() {
      return (
        (this.getLikerInfo && this.getLikerInfo.avatar) ||
        getIdenticonAvatar(this.getAddress)
      );
    },
  },
  watch: {
    getAddress: {
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
      const connection = await this.openConnectWalletModal({
        language: this.$i18n.locale.split('-')[0],
      });
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
    navigateToSettings() {
      window.open(
        getLikerIdSettingsURL({
          wallet: this.getAddress || '',
          language: this.getLocale.startsWith('zh') ? 'zh' : 'en',
        }),
        'settings',
        'menubar=no,location=no,width=576,height=768'
      );
    },
  },
};
