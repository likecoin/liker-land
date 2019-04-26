<template>
  <Transition name="fade" mode="out-in">
    <ul
      v-if="isLoading"
      key="loading"
      class="author-follow-settings-list author-follow-settings-list--loading"
    >
      <AuthorFollowSettingsListItem
        v-for="key in 3"
        :key="key"
      />
    </ul>
    <ul
      v-else-if="authorLikerIds.length"
      key="content"
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
      key="empty"
      class="author-follow-settings-list author-follow-settings-list--empty"
    >{{ emptyListText }}</div>
  </Transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import AuthorFollowSettingsListItem from '~/components/AuthorFollowSettingsListItem';

export default {
  components: {
    AuthorFollowSettingsListItem,
  },
  middleware: 'authenticated',
  data() {
    return {
      isLoading: false,
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
  min-height: 10rem;

  @apply list-reset;

  &--empty {
    @apply text-gray-c;
    @apply text-center;

    @apply p-16;

    @apply flex;
    @apply justify-center;
    @apply items-center;
  }
}
</style>
