<template>
  <AuthorListItem
    class="author-follow-settings-list-item"
    :liker-id="likerId"
    tag="li"
  >
    <template
      v-if="isFollowing"
      v-slot:accessory-view-button
    >
      <button
        key="unfollow-button"
        class="unfollow-button"
        @click="onClickActionButton"
      >{{ $t('SettingsFollowingPage.unfollow') }}</button>
    </template>
    <template
      v-else
      v-slot:accessory-view
    >
      <button
        class="btn btn--plain no-underline btn--block"
        @click="onClickActionButton"
      >{{ $t('SettingsFollowingPage.follow') }}</button>
    </template>
  </AuthorListItem>
</template>

<script>
import { mapActions } from 'vuex';

import AuthorListItem from '~/components/AuthorListItem';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  components: {
    AuthorListItem,
  },
  props: {
    likerId: {
      type: String,
      default: undefined,
    },
    isFollowing: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    ...mapActions(['followAuthor', 'unfollowAuthor']),

    async onClickActionButton() {
      try {
        // TODO: Block user interaction
        if (this.isFollowing) {
          await this.unfollowAuthor(this.likerId);
          logTrackerEvent(this, 'Follow', 'FollowRemove', this.likerId, 1);
        } else {
          await this.followAuthor(this.likerId);
          logTrackerEvent(this, 'Follow', 'FollowAdd', this.likerId, 1);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss">
.author-follow-settings-list-item {
  .unfollow-button {
    background: #6e2828;

    transition: opacity 0.25s ease;

    @apply text-white;
    @apply text-14;

    &:active {
      @apply opacity-75;
    }
  }
}
</style>
