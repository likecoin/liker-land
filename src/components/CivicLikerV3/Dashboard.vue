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
import { getOAuthLoginAPI } from '../../util/api';

import CivicLikerV3PureDashboard from './PureDashboard.vue';

export default {
  name: 'CivicLikerV3Dashboard',
  components: {
    CivicLikerV3PureDashboard,
  },
  data() {
    return {
      status: 'inactive',
      stakingAmount: 0,
      stakingAmountTarget: 5000,
      activeSince: new Date(),
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'getUserInfo']),
    stakingValidatorName() {
      return CIVIC_LIKER_V3_VALIDATOR_NAME;
    },
    stakingManagementURL() {
      return CIVIC_LIKER_V3_STAKING_URL;
    },
    signInURL() {
      return getOAuthLoginAPI();
    },
  },
};
</script>
