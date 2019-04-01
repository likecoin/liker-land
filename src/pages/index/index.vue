<template>
  <main class="page-content">
    <ContentList
      :is-loading="isLoading"
      :items="items"
    />
  </main>
</template>

<script>
import { mapActions } from 'vuex';

import ContentList from '~/components/ContentList';

export default {
  name: 'Index',
  components: {
    ContentList,
  },
  data() {
    return {
      isLoading: true,
      articles: [],
    };
  },
  computed: {
    items() {
      return this.articles.slice(0, 40);
    },
  },
  fetch({ from, query, redirect, store }) {
    if (!from && store.getters.getUserId) {
      redirect(307, { name: 'index-following', query });
    }
  },
  mounted() {
    this.fetchContent();
  },
  methods: {
    ...mapActions(['fetchSuggestedArticles']),

    async fetchContent() {
      try {
        this.isLoading = true;
        this.articles = await this.fetchSuggestedArticles();
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
