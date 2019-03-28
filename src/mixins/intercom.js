import { mapGetters } from 'vuex';

export const IntercomMixinFactory = (options = { isBootAtMounted: true }) => ({
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  mounted() {
    if (!this.$intercom) return;
    if (options.isBootAtMounted) this.bootIntercom();
  },
  beforeDestroy() {
    if (!this.$intercom) return;
    if (options.isBootAtMounted) this.shutdownIntercom();
  },
  methods: {
    bootIntercom() {
      if (!this.$intercom.booted) {
        const { email, user, displayName, intercomToken } = this.getUserInfo;
        this.$intercom.boot({
          email,
          name: displayName || user,
          user_id: user,
          user_hash: intercomToken,
        });
        this.$intercom.booted = true;
        return true;
      }
      return false;
    },
    shutdownIntercom() {
      if (this.$intercom.booted) {
        this.$intercom.shutdown();
        this.$intercom.booted = false;
      }
    },
  },
});

export default IntercomMixinFactory();
