import { mapActions, mapGetters } from 'vuex';

import { checkIsLikeCoinApp } from '~/util/client';

import walletLoginMixin from '~/mixins/wallet-login';

export default {
  mixins: [walletLoginMixin],
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
        await this.connectWallet();
      },
    },
  },
  methods: {
    ...mapActions(['openConnectWalletModal', 'initWalletAndLogin']),
  },
};
