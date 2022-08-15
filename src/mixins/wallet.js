import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getAddress', 'getSigner', 'getLikerInfo']),
  },
  methods: {
    ...mapActions(['connectWallet', 'disconnectWallet']),
    async navigateToWalletDashboard() {
      if (!this.getAddress) {
        const isConnected = await this.connectWallet();
        if (isConnected) {
          this.navigateToWalletDashboard();
        }
      } else {
        this.$router.push({
          name: 'id',
          params: { id: this.getAddress },
        });
      }
    },
  },
};
