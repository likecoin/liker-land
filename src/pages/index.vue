<template>
  <div class="home-page">
    <PageHeader
      class="z-1"
      :is-floatable="true"
    >
      <template v-slot="{ isFloating }">
        <SiteNavBar
          :class="[
            'bg-like-green',
            {
              'relative': isFloating && !getUserId,
            },
          ]"
        />

        <div
          v-if="!isFloating && (!getUserId || !getUserIsCivicLiker)"
          class="text-center bg-like-green px-16 pb-20"
        >
          <div class="text-like-cyan text-30 font-200 mb-16">
            {{ $t(getUserId ? 'CivicLikerCTA.slogan' : 'SignUpSignInCTA.slogan') }}
          </div>

          <NuxtLink
            v-if="getUserId"
            :class="[
              'btn btn--outlined btn--dark mx-0',
              {
                'mb-0': !getUserId,
              },
            ]"
            :to="{ name: 'civic' }"
          >{{ $t('CivicLikerCTA.button') }}</NuxtLink>
          <template v-else>
            <a
              :href="getOAuthLoginAPI()"
              class="btn btn--outlined btn--dark"
            >{{ $t('signUp') }}</a><br><a
              :href="getOAuthLoginAPI()"
              class="btn btn--plain btn--dark text-12 m-0 p-0"
            >{{ $t('signIn') }}</a>
          </template>

        </div>

        <TabBar>
          <TabBarItem
            :is-active="$route.name === 'index'"
            :to="{ name: 'index' }"
          >
            <FeaturedIcon v-if="getUserId" />
          </TabBarItem>
          <TabBarItem
            v-if="getUserId"
            :is-active="$route.name === 'index-following'"
            :to="{ name: 'index-following' }"
          >
            <WatchingIcon />
          </TabBarItem>
          <TabBarItem
            v-if="getUserId"
            :is-active="$route.name === 'index-bookmarks'"
            :to="{ name: 'index-bookmarks' }"
          >
            <BookmarkIcon />
          </TabBarItem>
        </TabBar>
      </template>
    </PageHeader>

    <main class="page-content">
      <nuxt-child />
    </main>

    <!-- Sign in/sign up banner -->
    <div
      v-if="!getUserId"
      class="text-center bg-like-green px-12 pt-32 pb-40"
    >
      <div class="text-like-cyan text-30 font-200 mb-24">
        {{ $t('SignUpSignInCTA.slogan') }}
      </div>
      <a
        :href="getOAuthLoginAPI()"
        class="btn btn--outlined btn--dark"
      >{{ $t('signUp') }}</a><br><a
        :href="getOAuthLoginAPI()"
        class="btn btn--plain btn--dark text-12 m-0 p-0"
      >{{ $t('signIn') }}</a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '@/util/api';

import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import TabBar from '~/components/TabBar';
import TabBarItem from '~/components/TabBarItem';

import BookmarkIcon from '~/assets/icons/bookmark-outlined.svg';
import FeaturedIcon from '~/assets/icons/featured.svg';
import WatchingIcon from '~/assets/icons/watching.svg';

export default {
  name: 'Index',
  components: {
    PageHeader,
    SiteNavBar,
    TabBar,
    TabBarItem,

    BookmarkIcon,
    FeaturedIcon,
    WatchingIcon,
  },
  computed: {
    ...mapGetters(['getUserId', 'getUserIsCivicLiker', 'getUserBookmarks']),
  },
  mounted() {
    this.fetchSharedContent();
  },
  methods: {
    getOAuthLoginAPI,
    ...mapActions(['refreshBookmarkList']),
    async fetchSharedContent() {
      try {
        const promises = [];
        if (this.getUsreId && !this.getUserBookmarks.length)
          promises.push(this.refreshBookmarkList());
        await Promise.all(promises);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    },
  },
};
</script>

<style lang="scss">
.home-page {
  .page-content {
    @apply relative;

    @apply bg-gray-f7;

    @apply flex-grow;

    @apply w-full;
    @apply max-w-phone;

    @apply mx-auto;
  }
}
</style>
