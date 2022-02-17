<template>
  <CivicLikerV3PureDashboard
    :status="status"
    :sign-in-url="signInURL"
    :is-signed-in="!!getUserId"
    :avatar-src="getUserInfo && getUserInfo.avatar"
    :staking-validator-name="stakingValidatorName"
    :staking-management-url="stakingManagementURL"
    :staking-amount="stakingAmount"
    :staking-amount-target="stakingAmountTarget"
    :active-since="activeSince"
  />
</template>

<script>
import { mapGetters } from 'vuex';

import {
  CIVIC_LIKER_V3_VALIDATOR_NAME,
  CIVIC_LIKER_V3_STAKING_URL,
} from '../../constant';
import { getOAuthLoginAPI, getCivicLikerStakingAPI } from '../../util/api';
import CivicLikerV3PureDashboard from './PureDashboard.vue';

export default {
  name: 'CivicLikerV3Dashboard',
  components: {
    CivicLikerV3PureDashboard,
  },
  data() {
    return {
      stakingAmount: 0,
      stakingAmountTarget: 5000,
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getUserInfo',
      'getUserIsCivicLiker',
      'getUserIsCivicLikerV3',
    ]),
    status() {
      if (this.stakingAmount >= this.stakingAmountTarget) {
        return this.getUserIsCivicLiker && this.getUserIsCivicLikerV3
          ? 'active'
          : 'activating';
      }
      return 'inactive';
    },
    stakingValidatorName() {
      return CIVIC_LIKER_V3_VALIDATOR_NAME;
    },
    stakingManagementURL() {
      return CIVIC_LIKER_V3_STAKING_URL;
    },
    signInURL() {
      return getOAuthLoginAPI();
    },
    activeSince() {
      return new Date(this.getUserInfo.civicLikerSince);
    },
  },
  mounted() {
    this.fetchStaking();
  },
  methods: {
    async fetchStaking() {
      try {
        const { stakingAmount, stakingAmountTarget } = await this.$api.$get(
          getCivicLikerStakingAPI()
        );
        this.stakingAmount = stakingAmount;
        this.stakingAmountTarget = stakingAmountTarget;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
};
</script>
