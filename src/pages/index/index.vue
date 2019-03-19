<template>
  <main class="page-content">
    <div class="content-list pt-24">
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
        <div class="text-gray-9b text-center  bg-white rounded-8 p-40 ">
          <div class="text-20 font-600">
            There are no artical on your reading list
          </div>
          <div class="text-gray-9b text-14 mt-20">
            Artical will appear here if you started to like some artical. Find some artical from the recommending list.
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '@/util/api';

import ContentCard from '~/components/ContentCard';

export default {
  name: 'Index',
  components: {
    ContentCard,
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
  @apply flex-grow;

  @apply w-full;
  @apply max-w-phone;

  @apply mx-auto;
  @apply px-16;
  @apply py-24;

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
