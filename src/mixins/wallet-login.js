import { mapActions } from 'vuex';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
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
  },
};
