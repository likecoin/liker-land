import { mapActions } from 'vuex';

import alertMixin from '~/mixins/alert';
import { logTrackerEvent } from '~/util/EventLogger';
import { setSessionStorageItem } from '~/util/misc';

export default {
  mixins: [alertMixin],
  methods: {
    ...mapActions([
      'openConnectWalletModal',
      'disconnectWallet',
      'initWallet',
      'initWalletAndLogin',
      'initIfNecessary',
      'restoreSession',
      'signLogin',
      'openAuthcoreModal',
    ]),
    async connectWallet({ isOpenAuthcore = false, isSignUp = false } = {}) {
      try {
        logTrackerEvent(
          this,
          'user',
          'connect_wallet_start',
          'connect_wallet_start',
          1
        );
        setSessionStorageItem('USER_POST_AUTH_ROUTE', this.$route.fullPath);
        const connection = isOpenAuthcore
          ? await this.openAuthcoreModal({ isSignUp })
          : await this.openConnectWalletModal({
              language: this.$i18n.locale.split('-')[0],
              connectWalletTitle: this.$t('connect_wallet_title'),
              connectWalletMobileWarning: this.$t(
                'connect_wallet_mobile_warning'
              ),
              shouldRecommendConnectionMethod: true,
              shouldShowLegacyAuthcoreOptions: !!this.$route.query
                .authcore_legacy,
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

        const res = await this.initWalletAndLogin(connection);

        if (res) {
          logTrackerEvent(
            this,
            'user',
            `connect_wallet_done_with_login`,
            'connect_wallet_done',
            1
          );
        }

        return res;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        this.alertPromptError(err);
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
