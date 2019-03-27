import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  mounted() {
    if (this.$intercom && !this.$intercom.booted) {
      const { email, user, displayName, intercomToken } = this.getUserInfo;
      this.$intercom.boot({
        email,
        name: displayName || user,
        user_id: user,
        user_hash: intercomToken,
      });
      this.$intercom.booted = true;
    }
  },
  beforeDestroy() {
    if (this.$intercom && !this.$intercom.visible) {
      this.$intercom.shutdown();
      this.$intercom.booted = false;
    }
  },
};
