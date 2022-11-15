<template>
  <CardV2 :class="['flex', 'flex-col', 'items-center', 'w-full']">
    <Identity :avatar-url="userAvatar" :avatar-size="88" :is-avatar-outlined="isUserCivicLiker" />
    <Label preset="h3" :class="['text-like-green', 'mt-[18px]']">
      {{ userDisplayName }}
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
import userInfoMixin from '~/mixins/user-info';

export default {
  mixins: [userInfoMixin],
  props: {
    wallet: {
      type: String,
      default: null,
    },
  },
};
</script>
