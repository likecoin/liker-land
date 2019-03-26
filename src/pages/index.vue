<template>
  <div class="home-page">
    <PageHeader
      class="z-1"
      :is-floatable="true"
    >
      <template v-slot="{ isFloating }">
        <SiteNavBar class="bg-like-green" />

        <div
          v-if="!isFloating"
          :class="[
            'text-center bg-like-green px-16',
            getUserId ? 'pb-16' : 'pb-0',
          ]"
        >
          <div class="text-like-cyan font-200 text-30 mb-16">
            Trade a coffee for a better world
          </div>
          <NuxtLink
            :class="[
              'btn btn--outlined btn--dark mx-0',
              {
                'mb-0': !getUserId,
              },
            ]"
            :to="{ name: 'civic' }"
          >Be a Civic Liker</NuxtLink>
        </div>

        <TabBar>
          <TabBarItem
            :class="{ 'pointer-events-none': !getUserId }"
            :is-active="$route.name === 'index'"
            :to="{ name: 'index' }"
          >
            <FeaturedIcon :class="{ invisible: !getUserId }" />
          </TabBarItem>
          <TabBarItem
            v-if="getUserId"
            :is-active="$route.name === 'following'"
            :to="{ name: 'following' }"
          >
            <WatchingIcon />
          </TabBarItem>
          <TabBarItem
            v-if="getUserId"
            :is-active="$route.name === 'bookmarks'"
            :to="{ name: 'bookmarks' }"
          >
            <BookmarkIcon />
          </TabBarItem>
        </TabBar>
      </template>
    </PageHeader>

    <nuxt-child />

    <!-- Sign in/sign up banner -->
    <div
      v-if="!getUserId"
      class="text-center bg-like-green px-12 pt-32 pb-40"
    >
      <div class="text-like-cyan text-30 font-200 mb-24">Sign up / Sign in to read more</div>
      <a
        :href="getOAuthLoginAPI()"
        class="btn btn--outlined btn--dark"
      >Sign up / Sign in</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '@/util/api';

import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';
import TabBar from '~/components/TabBar';
import TabBarItem from '~/components/TabBarItem';

import BookmarkIcon from '~/assets/icons/bookmark.svg';
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
    ...mapGetters(['getUserId']),
  },
  methods: {
    getOAuthLoginAPI,
  },
};
</script>

<style lang="scss">
.home-page {
  &::before {
    z-index: -1;

    content: '';

    @apply fixed;
    @apply pin;

    @apply bg-gray-f7;

    @apply max-w-phone;
    @apply w-full;
    @apply mx-auto;
  }
}

.page-header--floating {
  .site-nav-bar {
    @apply absolute;
    @apply pin;

    @apply bg-transparent;

    @apply py-0;
  }
}
</style>
