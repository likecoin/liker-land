import { mapActions, mapGetters } from 'vuex';
import { getIdenticonAvatar } from '~/util/api';
import { getLikerIdSettingsURL } from '~/util/links';
import { escapeCSVField, downloadCSV } from '~/util/misc';

import walletLoginMixin from './wallet-login';

export default {
  mixins: [walletLoginMixin],
  computed: {
    ...mapGetters([
      'getAddress',
      'getSigner',
      'getLikerInfo',
      'getLocale',
      'getUserInfoByAddress',
      'walletTotalSales',
      'walletTotalRoyalty',
      'walletTotalResales',
      'walletSalesDetails',
      'walletRoyaltyDetails',
      'walletResalesDetails',
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
      'getFolloweeEvents',
      'walletIsFetchingFolloweeEvents',
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
      'walletFetchLIKEBalance',
      'walletFetchFollowees',
      'walletFetchFollowers',
      'walletUnfollowCreator',
      'walletFollowCreator',
      'signLogin',
      'walletFetchTotalRoyalty',
      'walletFetchTotalSales',
      'walletFetchTotalResales',
      'fetchFolloweeWalletEvent',
    ]),
    async navigateToMyDashboard() {
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.navigateToMyDashboard();
        }
      } else {
        this.$router.push(
          this.localeLocation({
            name: 'social-feeds',
            query: { view: 'town' },
          })
        );
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
        ({ displayName, wallet }) => [escapeCSVField(displayName), wallet]
      );

      // Convert list to CSV string
      const csvString = `${header.join(',')}\n${contents
        .map(row => row.join(','))
        .join('\n')}`;

      downloadCSV(csvString, 'my-followers.csv');
    },
    async handleClickFollow({ followOwner }) {
      const isFollowed = this.walletFollowees?.includes(followOwner) || false;
      try {
        if (!this.walletHasLoggedIn) {
          try {
            await this.signLogin();
          } catch {
            // No-op
          }
          if (!this.walletHasLoggedIn) {
            return;
          }
        }
        if (isFollowed) {
          await this.walletUnfollowCreator(followOwner);
          return;
        }
        this.walletFollowCreator(followOwner);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
};
