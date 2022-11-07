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
      :avatar-url="avatarURL"
      :avatar-size="42"
      :is-avatar-outlined="isAvatarOutlined"
    />
    <div>
      <div class="text-[12px] text-medium-gray">{{ identityLabel }}</div>
      <Label class="text-like-green" preset="h5">{{ displayName | ellipsis }}</Label>
    </div>
  </NuxtLink>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getIdenticonAvatar } from '~/util/api';

import { ellipsis } from '~/util/ui';

export default {
  name: 'MessageIdentiy',
  filters: {
    ellipsis,
  },
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
  },
  computed: {
    ...mapGetters(['getUserInfoByAddress']),
    toRoute() {
      return {
        name: 'id',
        params: { id: this.walletAddress },
        query: { tab: this.type === 'creator' ? 'created' : 'collected' },
      };
    },
    identifyInfo() {
      return this.getUserInfoByAddress(this.walletAddress) || {};
    },
    identityLabel() {
      return this.$t(
        this.type === 'creator'
          ? 'identity_type_creator'
          : 'identity_type_collector'
      );
    },
    displayName() {
      return this.identifyInfo.displayName;
    },
    avatarURL() {
      return this.identifyInfo.avatar || getIdenticonAvatar(this.walletAddress);
    },
    isAvatarOutlined() {
      return !!(
        this.identifyInfo?.isCivicLikerTrial ||
        this.identifyInfo?.isSubscribedCivicLiker
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
