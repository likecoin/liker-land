import { mapActions, mapGetters } from 'vuex';
import stringify from 'fast-json-stable-stringify';
import { postUserV2Login } from '~/util/api';
import {
  LOGIN_MESSAGE,
  LIKECOIN_CHAIN_ID,
  LIKECOIN_CHAIN_MIN_DENOM,
} from '@/constant/index';

export default {
  computed: {
    ...mapGetters(['getAddress', 'getSigner']),
  },
  methods: {
    ...mapActions(['initIfNecessary']),
    async signLogin() {
      if (!this.getSigner) {
        await this.initIfNecessary();
      }
      const memo = [
        `${LOGIN_MESSAGE}:`,
        JSON.stringify({
          ts: Date.now(),
          address: this.getAddress,
        }),
      ].join(' ');
      const payload = {
        chain_id: LIKECOIN_CHAIN_ID,
        memo,
        msgs: [],
        fee: {
          gas: '0',
          amount: [{ denom: LIKECOIN_CHAIN_MIN_DENOM, amount: '0' }],
        },
        sequence: '0',
        account_number: '0',
      };
      try {
        const {
          signed: message,
          signature: { signature, pub_key: publicKey },
        } = await this.getSigner.sign(this.getAddress, payload);
        const data = {
          signature,
          publicKey: publicKey.value,
          message: stringify(message),
          from: this.getAddress,
        };
        await this.$api.post(postUserV2Login, data);
      } catch (error) {
        return error;
      }
      return undefined;
    },
  },
};
