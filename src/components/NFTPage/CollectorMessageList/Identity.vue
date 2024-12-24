<template>
  <component
    :is="walletAddress ? 'NuxtLink' : 'div'"
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

      wrapperClasses,
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
      <p class="text-like-green hover:underline" align="center">
        {{ userDisplayNameFull | ellipsisCollectorAddress }}
      </p>
    </div>
  </component>
</template>

<script>
import { mapActions } from 'vuex';

import { createUserInfoMixin } from '~/mixins/user-info';
import { ellipsisCollectorAddress } from '~/util/ui';

const userInfoMixin = createUserInfoMixin({ walletKey: 'walletAddress' });

export default {
  name: 'NFTPageCollectorMessageListIdentity',
  filters: {
    ellipsisCollectorAddress,
  },
  mixins: [userInfoMixin],
  props: {
    walletAddress: {
      type: String,
      default: '',
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
      if (!this.walletAddress) {
        return '';
      }

      return this.localeLocation({
        name: 'id',
        params: { id: this.walletAddress },
        query: { tab: this.isCreatedTab ? 'created' : 'collected' },
      });
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
