<template>
  <ul class="author-list">
    <template v-if="authorLikerIds.length">
      <AuthorListItem
        v-for="id in authorLikerIds"
        :key="id"
        :liker-id="id"
      >
        <template>
          <button
            class="btn btn--outlined btn--block"
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
        if (this.$route.name === 'settings-following') {
          await this.unfollowAuthor(likerId);
        } else {
          await this.followAuthor(likerId);
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
}
</style>
