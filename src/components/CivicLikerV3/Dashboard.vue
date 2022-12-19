<template>
  <div class="min-h-[720px]">
    <Transition name="fade" mode="out-in">
      <div
        v-if="!validatorAddress"
        key="loading"
        class="flex items-center justify-center min-h-[180px]"
      >
        <Spinner class="mx-auto" />
      </div>
      <CivicLikerV3PureDashboard
        v-else
        key="dashboard"
        :status="status"
        :is-signed-in="!!getAddress"
        :avatar-src="walletUserAvatar"
        :staking-validator-name="validatorName"
        :staking-management-url="stakingManagementURL"
        :staking-amount="stakingAmount"
        :staking-amount-target="stakingAmountTarget"
        :active-since="activeSince"
        @register="handleRegister"
        @sign-in="handleSignIn"
      />
    </Transition>
  </div>
</template>

<script>
import walletMixin from '~/mixins/wallet';

import { CIVIC_LIKER_V3_STAKING_ENDPOINT } from '~/constant';
import {
  getCivicLikerStakingAPI,
  getCivicLikerStakingInfoAPI,
} from '~/util/api';

export default {
  name: 'CivicLikerV3Dashboard',
  mixins: [walletMixin],
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
    stakingManagementURL() {
      return `${CIVIC_LIKER_V3_STAKING_ENDPOINT}/${this.validatorAddress}`;
    },
  },
  watch: {
    getAddress(address) {
      if (address) {
        this.fetchData();
      } else {
        this.stakingAmount = 0;
        this.status = 'unregistered';
        this.activeSince = null;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    handleRegister() {
      this.navigateToSettings();
    },
    handleSignIn() {
      this.connectWallet();
    },
    async fetchData() {
      this.status = 'fetching';
      const fetches = [this.fetchStakingInfo()];
      if (this.getAddress) {
        fetches.push(this.fetchStakingStatus());
      }
      await Promise.all(fetches);
      if (!this.getAddress) {
        this.status = 'unregistered';
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
    async fetchStakingStatus() {
      try {
        const { status, stakingAmount, activeSince } = await this.$api.$get(
          getCivicLikerStakingAPI(this.getAddress)
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
