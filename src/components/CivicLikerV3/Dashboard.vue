<template>
  <div v-if="!validatorAddress" class="p-32">
    <Spinner class="mx-auto" />
  </div>
  <CivicLikerV3PureDashboard
    v-else
    :status="status"
    :sign-in-url="signInURL"
    :is-signed-in="!!getUserId"
    :avatar-src="getUserInfo && getUserInfo.avatar"
    :staking-validator-name="validatorName"
    :staking-management-url="stakingManagementURL"
    :staking-amount="stakingAmount"
    :staking-amount-target="stakingAmountTarget"
    :active-since="activeSince"
  />
</template>

<script>
import { mapGetters } from 'vuex';

import { CIVIC_LIKER_V3_STAKING_ENDPOINT } from '../../constant';
import { getOAuthLoginAPI, getCivicLikerStakingAPI } from '../../util/api';

import Spinner from '../Spinner/Spinner.vue';
import CivicLikerV3PureDashboard from './PureDashboard.vue';

export default {
  name: 'CivicLikerV3Dashboard',
  components: {
    CivicLikerV3PureDashboard,
    Spinner,
  },
  data() {
    return {
      validatorName: '',
      validatorAddress: '',
      status: 'inactive',
      stakingAmount: 0,
      stakingAmountTarget: 0,
      activeSince: null,
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'getUserInfo']),
    stakingManagementURL() {
      return `${CIVIC_LIKER_V3_STAKING_ENDPOINT}/${this.validatorAddress}`;
    },
    signInURL() {
      return getOAuthLoginAPI();
    },
  },
  mounted() {
    this.fetchStaking();
  },
  methods: {
    async fetchStaking() {
      try {
        const {
          status,
          stakingAmount,
          stakingAmountTarget,
          activeSince,
          validator,
        } = await this.$api.$get(getCivicLikerStakingAPI());
        this.validatorAddress = validator.operatorAddress;
        this.validatorName = validator.description.moniker;
        this.status = status;
        this.stakingAmount = stakingAmount;
        this.stakingAmountTarget = stakingAmountTarget;
        if (activeSince) {
          this.activeSince = new Date(activeSince);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
};
</script>
