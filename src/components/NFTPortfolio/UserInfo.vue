<template>
  <CardV2 :class="['flex', 'flex-col', 'items-center', 'w-full']">
    <Identity :avatar-url="userAvatar" :avatar-size="88" :is-avatar-outlined="isUserCivicLiker" />
    <Label preset="h3" :class="['text-like-green', 'mt-[18px]']">
      {{ userDisplayName | ellipsis }}
    </Label>
    <template v-if="userDescription">
      <hr :class="['w-full', 'border-shade-gray', 'my-[16px]']">
      <Label preset="p6" class="break-all font-200 my-[12px]">
        {{ userDescription }}
      </Label>
    </template>
    <slot />
  </CardV2>
</template>
<script>
import { ellipsis } from '~/util/ui';
import { getIdenticonAvatar } from '~/util/api';

export default {
  filters: {
    ellipsis,
  },
  props: {
    userInfo: {
      type: Object,
      default: null,
    },
    wallet: {
      type: String,
      default: null,
    },
  },
  computed: {
    userAvatar() {
      return this.userInfo?.avatar || getIdenticonAvatar(this.wallet);
    },
    isUserCivicLiker() {
      return !!(
        this.userInfo?.isCivicLikerTrial ||
        this.userInfo?.isSubscribedCivicLiker
      );
    },
    userDisplayName() {
      return this.userInfo?.displayName || this.wallet;
    },
    userDescription() {
      return this.userInfo?.description;
    },
  },
};
</script>
