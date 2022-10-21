import { mapGetters } from 'vuex';

export const CrispMixinFactory = (options = { isBootAtMounted: true }) => ({
  computed: {
    ...mapGetters(['getAddress', 'getLikerInfo']),
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
        if (this.$crisp.is('chat:hidden')) {
          const displayName = this.getLikerInfo?.displayName || this.getAddress;
          const { $crisp } = this;
          if (displayName) $crisp.push(['set', 'user:nickname', [displayName]]);
          this.$crisp.push(['do', 'chat:show']);
          return true;
        }
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
