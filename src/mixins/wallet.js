import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getAddress', 'getSigner']),
  },
  methods: {
    ...mapActions(['connectWallet', 'disconnectWallet']),
    navigateToWalletDashboard() {
      if (!this.getAddress) {
        this.connectWallet({ onInit: this.navigateToWalletDashboard });
      } else {
        this.$router.push({
          name: 'id',
          params: { id: this.getAddress },
        });
      }
    },
  },
};
