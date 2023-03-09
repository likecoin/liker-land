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
      'walletFollowees',
      'walletFollowers',
      'walletIsFetchingFollowers',
      'walletMethodType',
      'walletEmail',
      'walletHasVerifiedEmail',
      'walletLIKEBalance',
      'walletLIKEBalanceFetchPromise',
      'walletHasLoggedIn',
      'walletIsMatchedSession',
      'walletIsLoggingIn',
      'loginAddress',
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
    likerIdSettingsURL() {
      return getLikerIdSettingsURL({
        wallet: this.getAddress || '',
        language: this.getLocale.startsWith('zh') ? 'zh' : 'en',
      });
    },
    populatedFollowers() {
      return this.walletFollowers.map(follower => ({
        displayName:
          this.getUserInfoByAddress(follower)?.displayName || follower,
        wallet: follower,
        avatar: this.getUserInfoByAddress(follower)?.avatar,
        isCivicLiker: this.getUserInfoByAddress(follower)
          ?.isSubscribedCivicLiker,
      }));
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
      'initWalletAndLogin',
      'initIfNecessary',
      'restoreSession',
      'walletFetchLIKEBalance',
      'signLogin',
      'walletFetchFollowees',
      'walletFetchFollowers',
    ]),
    async connectWallet({ shouldSkipLogin = false } = {}) {
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
      return shouldSkipLogin
        ? this.initWallet(connection)
        : this.initWalletAndLogin(connection);
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
        this.likerIdSettingsURL,
        'settings',
        'menubar=no,location=no,width=576,height=768'
      );
    },
    exportFollowerList() {
      const header = [
        this.$t('portfolio_follower_export_ID'),
        this.$t('portfolio_follower_export_wallet'),
      ];
      const contents = this.populatedFollowers.map(
        ({ displayName, wallet }) => [this.escapeCSVField(displayName), wallet]
      );

      // Convert list to CSV string
      const csvString = `${header.join(',')}\n${contents
        .map(row => row.join(','))
        .join('\n')}`;

      const csvBlob = new Blob([csvString], {
        type: 'text/csv;charset=utf-8;',
      });
      // Download CSV file
      const csvUrl = URL.createObjectURL(csvBlob);
      const hiddenLink = document.createElement('a');
      hiddenLink.href = csvUrl;
      hiddenLink.target = '_blank';
      hiddenLink.download = 'my-followers.csv';
      hiddenLink.click();
    },

    escapeCSVField(field) {
      if (field.includes('"') || field.includes(',')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    },
  },
};
