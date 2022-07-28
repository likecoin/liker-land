import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getAddress']),
  },
  methods: {
    ...mapActions(['connectWallet', 'disconnectWallet']),
  },
};
