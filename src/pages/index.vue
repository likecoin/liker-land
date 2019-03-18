<template>
  <div class="home-page">
    <PageHeader :is-floatable="true">
      <template v-slot="{ isFloating }">
        <SiteNavBar class="bg-like-green" />

        <div
          v-if="!isFloating"
          class="text-center bg-like-green px-16 pb-4"
        >
          <div class="text-like-cyan font-200 text-30 mb-16">
            Trade a coffee for a better world
          </div>
          <NuxtLink
            :to="{ name: 'civic' }"
            class="btn btn--outlined btn--dark mx-0"
          >Be a Civic Liker</NuxtLink>
        </div>
      </template>
    </PageHeader>

    <main class="page-content">
      <div class="content-list">
        <div class="content-list__header">
          <div>Start Reading</div>
        </div>

        <div
          v-if="list.length"
          class="content-list__body"
        >
          <ContentCard
            v-for="item in list"
            :key="item.url"
            :src="item.url"
            :author="item.user"
            :cover-src="item.image"
            :title="item.title"
            :description="item.description"
          />
        </div>

        <!-- Show empty if no article -->
        <div
          v-else-if="isLoggedIn"
          class="content-list__body"
        >
          <div class="text-gray-9b text-center rounded bg-white p-40">
            <div class="text-20 font-600">
              There are no artical on your reading list
            </div>
            <div class="text-14 text-gray-9b mt-24">
              Artical will appear here if you started to like some artical. Find some artical from the recommending list.
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Sign in/sign up banner -->
    <div
      v-if="!isLoggedIn"
      class="text-center bg-like-green px-12 pt-32 pb-40"
    >
      <div class="text-like-cyan text-30 font-200 mb-24">Sign up / Sign in to read more</div>
      <a
        :href="getLoginUrl()"
        class="btn btn--outlined btn--dark"
      >Sign up / Sign in</a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '@/util/api';

import ContentCard from '~/components/ContentCard';
import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

export default {
  name: 'Index',
  components: {
    ContentCard,
    PageHeader,
    SiteNavBar,
  },
  data() {
    return {
      isLoggedIn: !!this.$store.getters.getUserId,
      user: '',
      suggestedList: [],
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getSubscribedAuthors',
      'getUnsubscribedAuthors',
      'getAllArticles',
      'getUserArticles',
    ]),
    list() {
      if (!this.getSubscribedAuthors) return this.suggestedList.slice(0, 40);
      if (!this.user) {
        let list = this.getAllArticles.slice(0, 40);
        if (list.length < 40)
          list = list.concat(this.suggestedList).slice(0, 40);
        return list;
      }
      return this.getUserArticles(this.user);
    },
  },
  async mounted() {
    try {
      if (this.isLoggedIn) {
        await this.fetchReaderIndex();
        this.getSubscribedAuthors.forEach(u => this.fetchArticle(u));
      }
      this.suggestedList = await this.fetchSuggestedArticles();
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  },
  methods: {
    ...mapActions([
      'fetchLoginStatus',
      'fetchReaderIndex',
      'fetchArticle',
      'fetchSuggestedArticles',
      'subscribeAuthor',
      'unsubscribeAuthor',
    ]),
    setUser(user) {
      this.user = user;
    },
    subscribeUser(user) {
      this.subscribeAuthor(user);
    },
    unsubscribeUser(user) {
      this.user = undefined;
      this.unsubscribeAuthor(user);
    },
    getLoginUrl() {
      return getOAuthLoginAPI();
    },
  },
};
</script>

<style lang="scss">
.content-list {
  max-width: config('screens.tablet.min');

  @apply bg-gray-f7;

  @apply flex-grow;

  @apply mx-auto;
  @apply p-16;
  @apply pt-0;

  @apply w-full;

  @media screen and (min-width: config('screens.tablet.min')) {
    @apply px-24;
  }

  &__header {
    @apply text-like-cyan;
    @apply text-14;
    @apply font-600;
    @apply text-center;

    @apply py-8;
  }

  &__body {
    .content-card {
      &:not(first-child) {
        @apply mt-16;
      }
    }
  }
}
</style>
