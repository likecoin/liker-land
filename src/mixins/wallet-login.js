import { mapActions } from 'vuex';

import experimentMixin from '~/mixins/experiment';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  mixins: [
    experimentMixin(
      'shouldRecommendConnectionMethod',
      'recommend-connection-method',
      'variant'
    ),
  ],
  methods: {
    ...mapActions([
      'openConnectWalletModal',
      'disconnectWallet',
      'initWallet',
      'initWalletAndLogin',
      'initIfNecessary',
      'restoreSession',
      'signLogin',
    ]),
    async connectWallet({ shouldSkipLogin = false } = {}) {
      try {
        const connection = await this.openConnectWalletModal({
          language: this.$i18n.locale.split('-')[0],
          connectWalletTitle: this.$t('connect_wallet_title'),
          connectWalletMobileWarning: this.$t('connect_wallet_mobile_warning'),
          shouldRecommendConnectionMethod: this.shouldRecommendConnectionMethod,
          onEvent: this.handleConnectWalletEvent,
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
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return false;
      }
    },
    handleConnectWalletEvent({ type, ...payload }) {
      switch (type) {
        case 'toggle_collapsible_connection_method_list':
          logTrackerEvent(
            this,
            'user',
            `ConnectWalletMethodList${
              payload.isCollapsed ? 'Collapsed' : 'Expanded'
            }`,
            `ConnectWalletMethodListToggle`,
            1
          );
          break;

        case 'select_connection_method':
          logTrackerEvent(
            this,
            'user',
            `ConnectWalletSelected_${payload.method}`,
            `ConnectWalletSelected`,
            1
          );
          break;

        default:
          break;
      }
    },
  },
};
