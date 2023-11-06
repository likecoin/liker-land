<template>
  <UserInfoCard
    :wallet="wallet"
    :display-name="userDisplayNameFull"
    :avatar-src="userAvatar"
    :is-civic-liker="isUserCivicLiker"
  >
    <slot name="gem" />
    <template v-if="userDescription">
      <Label preset="p6" class="break-normal font-200">
        {{ userDescription }}
      </Label>
    </template>
    <slot name="stats" />
    <div v-if="$slots.follow">
      <slot name="follow" />
    </div>
  </UserInfoCard>
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
