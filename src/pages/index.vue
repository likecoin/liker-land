<template>
  <div class="home-page">
    <PageHeader :is-floatable="true">
      <template v-slot="{ isFloating }">
        <SiteNavBar class="bg-like-green" />

        <div
          v-if="!isFloating"
          class="text-center bg-like-green px-16 pb-16"
        >
          <div class="text-like-cyan font-200 text-30 mb-16">
            Trade a coffee for a better world
          </div>
          <NuxtLink
            :to="{ name: 'civic' }"
            class="btn btn--outlined btn--dark mx-0"
          >Be a Civic Liker</NuxtLink>
        </div>

        <TabBar v-if="getUserId">
          <TabBarItem
            :is-active="$route.name === 'index'"
            :to="{ name: 'index' }"
          >
            <FeaturedIcon />
          </TabBarItem>
          <TabBarItem
            :is-active="$route.name === 'following'"
            :to="{ name: 'following' }"
          >
            <WatchingIcon />
          </TabBarItem>
          <TabBarItem
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
