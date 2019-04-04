<template>
  <ContentList
    :is-loading="isLoading"
    :items="items"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ContentList from '~/components/ContentList';

export default {
  name: 'Index',
  scrollToTop: true,
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
    ...mapGetters(['getSuggestedArticles']),
    items() {
      return this.getSuggestedArticles.slice(0, 40);
    },
  },
  fetch({ from, query, redirect, store }) {
    if (!from && store.getters.getUserId) {
      redirect(307, { ...store.getters.getHomeRoute, query });
    }
  },
  mounted() {
    this.fetchContent();
  },
  methods: {
    ...mapActions(['fetchSuggestedArticles']),

    async fetchContent() {
      try {
        this.isLoading = !this.items.length;
        const fetchArticles = this.fetchSuggestedArticles();
        if (!this.items.length) await fetchArticles;
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
