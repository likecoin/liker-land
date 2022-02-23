<template>
  <div v-if="!validatorAddress" class="p-32">
    <Spinner class="mx-auto" />
  </div>
  <CivicLikerV3PureDashboard
    v-else
    :status="status"
    :is-signed-in="!!getUserId"
    :avatar-src="getUserInfo && getUserInfo.avatar"
    :staking-validator-name="validatorName"
    :staking-management-url="stakingManagementURL"
    :staking-amount="stakingAmount"
    :staking-amount-target="stakingAmountTarget"
    :active-since="activeSince"
    @sign-in="handleSignIn"
  />
</template>

<script>
import { mapGetters } from 'vuex';

import { CIVIC_LIKER_V3_STAKING_ENDPOINT } from '../../constant';
import {
  getCivicLikerStakingAPI,
  getCivicLikerStakingInfoAPI,
} from '../../util/api';

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
      stakingAmountTarget: 0,
      stakingAmount: 0,
      status: 'fetching',
      activeSince: null,
    };
  },
  computed: {
    ...mapGetters(['getUserId', 'getUserInfo']),
    stakingManagementURL() {
      return `${CIVIC_LIKER_V3_STAKING_ENDPOINT}/${this.validatorAddress}`;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    handleSignIn() {
      this.$router.push({ name: 'civic-dashboard' });
    },
    async fetchData() {
      const fetches = [this.fetchStakingInfo()];
      if (this.getUserId) {
        fetches.push(this.fetchStaking());
      }
      await Promise.all(fetches);
      if (!this.getUserId) {
        this.status = 'inactive';
      }
    },
    async fetchStakingInfo() {
      try {
        const {
          operatorAddress,
          name,
          stakingAmountTarget,
        } = await this.$api.$get(getCivicLikerStakingInfoAPI());
        this.validatorName = name;
        this.validatorAddress = operatorAddress;
        this.stakingAmountTarget = stakingAmountTarget;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async fetchStaking() {
      try {
        const { status, stakingAmount, activeSince } = await this.$api.$get(
          getCivicLikerStakingAPI()
        );
        this.status = status;
        this.stakingAmount = stakingAmount;
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
