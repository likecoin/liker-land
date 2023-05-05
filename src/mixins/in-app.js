import { mapActions, mapGetters } from 'vuex';

import { checkIsLikeCoinAppInAppBrowser } from '~/util/client';

import walletLoginMixin from '~/mixins/wallet-login';

export default {
  mixins: [walletLoginMixin],
  computed: {
    ...mapGetters(['walletHasLoggedIn']),
    isInInAppBrowser() {
      return checkIsLikeCoinAppInAppBrowser(this.$route);
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
