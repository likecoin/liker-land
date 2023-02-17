import { APP_LIKE_CO_URL_BASE } from '~/constant';

export default {
  mounted() {
    this.navigationMessageListener = window.addEventListener(
      'message',
      this.handleNavigationMessage
    );
  },
  beforeDestroy() {
    if (this.collectNFTListener) {
      window.removeEventListener(this.collectNFTListener);
    }
  },
  methods: {
    handleNavigationMessage(event) {
      if (
        event.origin.startsWith(APP_LIKE_CO_URL_BASE) &&
        event.data &&
        event.data.type === 'navigate' &&
        event.data.route
      ) {
        this.$router.push(this.localeLocation(event.data.route));
      }
    },
  },
};
