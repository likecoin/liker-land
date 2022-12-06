<template>
  <NuxtLink
    :class="[
      'flex',
      'items-center',
      'gap-[16px]',
      'pl-[8px]',
      'pr-[24px]',
      'py-[8px]',
      'bg-white',
      'rounded-full',
      'cursor-pointer',
      wrapperClasses
    ]"
    :to="toRoute"
  >
    <Identity
      :avatar-url="userAvatar"
      :avatar-size="42"
      :is-avatar-outlined="isUserCivicLiker"
    />
    <div>
      <div
        v-if="isShowTypeLabel"
        class="text-[12px] text-medium-gray"
      >{{ userLabel }}</div>
      <Label class="text-like-green" preset="h5">{{ userDisplayName }}</Label>
    </div>
  </NuxtLink>
</template>

<script>
import { mapActions } from 'vuex';

import { createUserInfoMixin } from '~/mixins/user-info';

const userInfoMixin = createUserInfoMixin({ walletKey: 'walletAddress' });

export default {
  name: 'MessageIdentiy',
  mixins: [userInfoMixin],
  props: {
    walletAddress: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'collector',
    },
    wrapperClasses: {
      type: [String, Array],
      default: undefined,
    },
    isShowTypeLabel: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    toRoute() {
      return {
        name: 'id',
        params: { id: this.walletAddress },
        query: { tab: this.type === 'creator' ? 'created' : 'collected' },
      };
    },
    userLabel() {
      return this.$t(
        this.type === 'creator'
          ? 'identity_type_creator'
          : 'identity_type_collector'
      );
    },
  },
  watch: {
    walletAddress() {
      this.lazyGetUserInfoByAddress(this.walletAddress);
    },
  },
  mounted() {
    if (this.walletAddress) {
      this.lazyGetUserInfoByAddress(this.walletAddress);
    }
  },
  methods: {
    ...mapActions(['lazyGetUserInfoByAddress']),
  },
};
</script>
