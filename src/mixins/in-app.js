import { mapActions, mapGetters } from 'vuex';

import { checkIsLikeCoinApp } from '~/util/client';

export default {
  computed: {
    ...mapGetters(['walletHasLoggedIn']),
    isInInAppBrowser() {
      return this.$route.query.in_app !== undefined || checkIsLikeCoinApp();
    },
  },
  watch: {
    isInInAppBrowser: {
      immediate: true,
      async handler(isInInAppBrowser) {
        if (process.server || !isInInAppBrowser || this.walletHasLoggedIn) {
          return;
        }
        try {
          const connection = await this.openConnectWalletModal({
            language: this.$i18n.locale.split('-')[0],
          });
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
