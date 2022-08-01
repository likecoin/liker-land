import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getAddress', 'getSigner']),
  },
  methods: {
    ...mapActions(['connectWallet', 'disconnectWallet']),
  },
};
