import { mapGetters } from 'vuex';

export const CrispMixinFactory = (options = { isBootAtMounted: true }) => ({
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  mounted() {
    if (!this.crisp) return;
    if (options.isBootAtMounted) this.$nextTick(() => this.showCrisp());
  },
  beforeDestroy() {
    if (!this.crisp) return;
    if (options.isBootAtMounted) this.hideCrisp();
  },
  methods: {
    showCrisp() {
      if (this.$crisp.is('chat:hidden')) {
        try {
          const { email, displayName, crispToken } = this.getUserInfo;
          const { $crisp } = this;
          if (displayName) $crisp.push(['set', 'user:nickname', [displayName]]);
          if (email) {
            const emailPayload = [email];
            if (crispToken) emailPayload.push(crispToken);
            $crisp.push(['set', 'user:email', emailPayload]);
          }
          this.$crisp.push(['do', 'chat:show']);
          return true;
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
          return false;
        }
      }
      return false;
    },
    hideCrisp() {
      this.$crisp.push(['do', 'chat:hide']);
    },
  },
});

export default CrispMixinFactory();
