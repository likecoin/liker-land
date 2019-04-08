<template>
  <ContentList
    :is-loading="isLoading"
    :items="items"
    :header-label="$t('BookmarksPage.headerLabel')"
  >
    <template #empty>
      <div class="pt-24 px-40">
        <EmptyIcon class="block mx-auto" style="width:5.5rem" />
        <h1>{{ $t('BookmarksPage.empty.title') }}</h1>
        <p>{{ $t('BookmarksPage.empty.content') }}</p>
      </div>

      <div class="flex justify-center py-24">
        <NuxtLink
          class="btn btn--plain btn--auto-size btn--with-icon btn--icon-top flex-1 m-0 pt-32"
          :to="{ name: 'index-following' }"
        >
          <FollowingIcon class="btn__icon w-24 h-24" />
          {{ $t('BookmarksPage.empty.goToFollowing') }}
        </NuxtLink>
        <NuxtLink
          class="btn btn--plain btn--auto-size btn--with-icon btn--icon-top flex-1 m-0 pt-32"
          :to="{ name: 'index' }"
        >
          <FeaturedIcon class="btn__icon w-24 h-24" />
          {{ $t('BookmarksPage.empty.goToFeaturing') }}
        </NuxtLink>
      </div>
    </template>
  </ContentList>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ContentList from '~/components/ContentList';

import EmptyIcon from '~/assets/images/bookmarks-empty.svg';
import FeaturedIcon from '~/assets/icons/featured.svg';
import FollowingIcon from '~/assets/icons/watching.svg';

export default {
  name: 'Bookmarks',
  scrollToTop: true,
  components: {
    ContentList,
    EmptyIcon,
    FeaturedIcon,
    FollowingIcon,
  },
  middleware: 'authenticated',
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters(['getUserBookmarks']),
    items() {
      return this.getUserBookmarks.map(referrer => ({ referrer }));
    },
  },
  mounted() {
    this.fetchContent();
  },
  methods: {
    ...mapActions(['refreshBookmarkList']),
    async fetchContent() {
      try {
        this.isLoading = true;
        await this.refreshBookmarkList();
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
