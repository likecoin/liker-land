<template>
  <NuxtLink
    :class="[
      'flex',
      'phone:flex-col',
      'items-center',

      'gap-[16px]',
      'phone:gap-[8px]',

      'pl-[8px]',
      'pr-[24px]',
      'py-[8px]',
      'phone:pr-[12px]',

      'bg-white',
      'phone:rounded-[14px]',
      'rounded-full',
      'cursor-pointer',

      wrapperClasses
    ]"
    :to="toRoute"
  >
    <Identity
      class="flex-shrink-0"
      :avatar-url="userAvatar"
      :avatar-size="avatarSize"
      :is-avatar-outlined="isUserCivicLiker"
    />
    <div>
      <div
        v-if="isShowTypeLabel"
        class="text-[12px] text-medium-gray phone:text-center"
      >{{ userLabel }}</div>
      <Label class="text-like-green" :preset="userLabelSize" align="center">{{ userDisplayName }}</Label>
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
    avatarSize: {
      type: Number,
      default: 42,
    },
  },
  computed: {
    toRoute() {
      return this.localeLocation({
        name: 'id',
        params: { id: this.walletAddress },
        query: { tab: this.type === 'creator' ? 'created' : 'collected' },
      });
    },
    userLabel() {
      return this.$t(
        this.type === 'creator'
          ? 'identity_type_creator'
          : 'identity_type_collector'
      );
    },
    userLabelSize() {
      switch (this.avatarSize) {
        case 32:
          return 'p6';
        case 48:
        default:
          return 'h5';
      }
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
