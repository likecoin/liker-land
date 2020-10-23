<template>
  <div class="identity">
    <Avatar
      class="identity__avatar"
      :url="avatarUrl"
      :size="avatarSize"
      :is-outlined="isAvatarOutlined"
      :is-disabled="isAvatarDisabled"
      @click="onClickAvatar"
    />
    <div class="identity__display-name">{{ displayName }}</div>
  </div>
</template>

<script>
import Avatar from './Identity.avatar';

export default {
  name: 'Identity',
  components: {
    Avatar,
  },
  props: {
    avatarSize: {
      type: Number,
      default: 40,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isAvatarDisabled: {
      type: Boolean,
      default: false,
    },
    isAvatarOutlined: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
      default: '',
    },
  },
  methods: {
    onClickAvatar(e) {
      this.$emit('click-avatar', e);
    },
  },
};
</script>

<style lang="scss">
.identity {
  display: flex;
  align-items: center;

  &__display-name {
    margin: 0.5em;
    color: #28646e;
    font-family: Source Sans Pro, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 500;
  }
}
</style>
