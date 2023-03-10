import { mapActions, mapGetters } from 'vuex';

import { checkIsLikeCoinApp } from '~/util/client';

export default {
  computed: {
    ...mapGetters(['walletHasLoggedIn']),
    isInInAppBrowser() {
      return this.$route.query['in-app'] !== undefined || checkIsLikeCoinApp();
    },
  },
  watch: {
    isInInAppBrowser: {
      immediate: true,
      async handler(isInInAppBrowser) {
        console.log(
          'openConnectWalletModal',
          process.server,
          !isInInAppBrowser,
          this.walletHasLoggedIn
        );
        if (process.server || !isInInAppBrowser || this.walletHasLoggedIn) {
          return;
        }
        try {
          const connection = await this.openConnectWalletModal({
            language: this.$i18n.locale.split('-')[0],
          });
          console.log('openConnectWalletModal', connection);
          await this.initWalletAndLogin(connection);
        } catch {
          // No-op
        }
      },
    },
  },
  methods: {
    ...mapActions(['openConnectWalletModal', 'initWalletAndLogin']),
  },
};
