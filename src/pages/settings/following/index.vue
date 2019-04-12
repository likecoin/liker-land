<template>
  <ul class="author-list">
    <template v-if="authorLikerIds.length">
      <AuthorListItem
        v-for="id in authorLikerIds"
        :key="id"
        :liker-id="id"
      >
        <template
          v-if="isShowingFollowingAuthors"
          v-slot:accessory-view-button
        >
          <button
            key="unfollow-button"
            class="unfollow-button"
            @click="onClickActionButton(id)"
          >{{ actionButtonText }}</button>
        </template>
        <template
          v-else
          v-slot:accessory-view
        >
          <button
            class="btn btn--plain no-underline btn--block"
            @click="onClickActionButton(id)"
          >{{ actionButtonText }}</button>
        </template>
      </AuthorListItem>
    </template>
    <div
      v-else
      class="text-gray-c text-center px-16 py-48"
    >{{ emptyListText }}</div>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import AuthorListItem from '~/components/AuthorListItem';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  components: {
    AuthorListItem,
  },
  computed: {
    ...mapGetters(['getFollowedAuthors', 'getUnfollowedAuthors']),

    isShowingFollowingAuthors() {
      return this.$route.name === 'settings-following';
    },

    authorLikerIds() {
      return this.isShowingFollowingAuthors
        ? this.getFollowedAuthors
        : this.getUnfollowedAuthors;
    },
    actionButtonText() {
      return this.$t(
        `SettingsFollowingPage.${
          this.isShowingFollowingAuthors ? 'unfollow' : 'follow'
        }`
      );
    },
    emptyListText() {
      return this.$t(
        `SettingsFollowingPage.${
          this.isShowingFollowingAuthors ? 'noFollowing' : 'noUnfollowed'
        }`
      );
    },
  },
  mounted() {
    this.fetchAuthors();
  },
  methods: {
    ...mapActions(['fetchReaderIndex', 'followAuthor', 'unfollowAuthor']),

    async fetchAuthors() {
      try {
        // TODO: Show loading screen
        await this.fetchReaderIndex();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },

    async onClickActionButton(likerId) {
      try {
        // TODO: Block user interaction
        if (this.isShowingFollowingAuthors) {
          await this.unfollowAuthor(likerId);
          logTrackerEvent(this, 'Follow', 'FollowRemove', likerId, 1);
        } else {
          await this.followAuthor(likerId);
          logTrackerEvent(this, 'Follow', 'FollowAdd', likerId, 1);
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
.author-list {
  list-style: none; // Can use @apply list-none for Tailwind CSS v1.0.0+

  @apply p-0;

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
