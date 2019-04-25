import { mapGetters } from 'vuex';

export const IntercomMixinFactory = (options = { isBootAtMounted: true }) => ({
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  mounted() {
    if (!this.$intercom) return;
    if (options.isBootAtMounted) this.$nextTick(() => this.bootIntercom());
  },
  beforeDestroy() {
    if (!this.$intercom) return;
    if (options.isBootAtMounted) this.shutdownIntercom();
  },
  methods: {
    bootIntercom() {
      if (!this.$intercom.booted) {
        try {
          const { email, user, displayName, intercomToken } = this.getUserInfo;
          this.$intercom.boot({
            email,
            name: displayName || user,
            user_id: user,
            user_hash: intercomToken,
          });
          this.$intercom.booted = true;
          return true;
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
          return false;
        }
      }
      return false;
    },
    shutdownIntercom() {
      if (this.$intercom.booted) {
        try {
          this.$intercom.shutdown();
          this.$intercom.booted = false;
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
        }
      }
    },
  },
});

export default IntercomMixinFactory();
