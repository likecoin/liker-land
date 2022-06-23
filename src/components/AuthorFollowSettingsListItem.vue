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
      >
        <LcLoadingIndicator v-if="isUpdating" />
        <template v-else>{{ $t('SettingsFollowingPage.unfollow') }}</template>
      </button>
    </template>
    <template
      v-else
      v-slot:accessory-view
    >
      <button
        class="no-underline btn btn--plain btn--block"
        @click="onClickActionButton"
      >
        <LcLoadingIndicator v-if="isUpdating" />
        <template v-else>{{ $t('SettingsFollowingPage.follow') }}</template>
      </button>
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
  data() {
    return {
      isUpdating: false,
    };
  },
  methods: {
    ...mapActions(['followAuthor', 'unfollowAuthor']),

    async onClickActionButton() {
      if (this.isUpdating) return;
      try {
        this.isUpdating = true;
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
      } finally {
        this.isUpdating = false;
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
    @apply text-[14px];

    &:active {
      @apply opacity-75;
    }
  }

  .lc-loading-indicator {
    @apply text-12;

    @apply m-0;
  }
}
</style>
