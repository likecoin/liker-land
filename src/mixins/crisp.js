import { mapGetters } from 'vuex';

export const CrispMixinFactory = (options = { isBootAtMounted: true }) => ({
  computed: {
    ...mapGetters([
      'getAddress',
      'loginAddress',
      'getLikerInfo',
      'walletEmail',
    ]),
  },
  mounted() {
    if (options.isBootAtMounted) this.$nextTick(() => this.showCrisp());
  },
  beforeDestroy() {
    if (options.isBootAtMounted) this.hideCrisp();
  },
  methods: {
    showCrisp() {
      if (!this.$crisp) return false;
      try {
        const email = this.walletEmail;
        const wallet = this.loginAddress || this.getAddress;
        const displayName = this.getLikerInfo?.displayName || wallet;
        const { $crisp } = this;
        if (email) $crisp.push(['set', 'user:email', [email]]);
        if (displayName) $crisp.push(['set', 'user:nickname', [displayName]]);
        if (wallet) $crisp.push(['set', 'chat:show']);
        if ($crisp.is('chat:hidden')) {
          return true;
        }
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
      return false;
    },
    openCrisp(prefillText = '') {
      if (!this.$crisp) return false;
      try {
        this.showCrisp();
        this.$crisp.push(['do', 'chat:open']);
        if (prefillText) {
          this.$crisp.push(['set', 'message:text', [prefillText]]);
        }
        return true;
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
      return false;
    },
    hideCrisp() {
      if (!this.$crisp) return;
      this.$crisp.push(['do', 'chat:hide']);
    },
  },
});

export default CrispMixinFactory();
