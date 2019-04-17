<template>
  <ul
    v-if="isLoading"
    class="author-follow-settings-list author-follow-settings-list--loading"
  >
    <AuthorFollowSettingsListItem
      v-for="key in 5"
      :key="key"
    />
  </ul>
  <ul
    v-else-if="authorLikerIds.length"
    class="author-follow-settings-list"
  >
    <AuthorFollowSettingsListItem
      v-for="id in authorLikerIds"
      :key="id"
      :liker-id="id"
      :is-following="isShowingFollowingAuthors"
    />
  </ul>
  <div
    v-else
    class="text-gray-c text-center px-16 py-48"
  >{{ emptyListText }}</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import AuthorFollowSettingsListItem from '~/components/AuthorFollowSettingsListItem';

export default {
  components: {
    AuthorFollowSettingsListItem,
  },
  data() {
    return {
      isLoading: true,
    };
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
    ...mapActions(['fetchReaderIndex']),

    async fetchAuthors() {
      try {
        this.isLoading = true;
        await this.fetchReaderIndex();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.author-follow-settings-list {
  @apply list-reset;
}
</style>
