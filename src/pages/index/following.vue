<template>
  <main class="page-content">
    <ContentList
      :is-loading="isLoading"
      :items="items"
      :header-label="$t('FollowingPage.headerLabel')"
    />
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ContentList from '~/components/ContentList';

export default {
  name: 'Following',
  components: {
    ContentList,
  },
  middleware: 'authenticated',
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters(['getAllArticles', 'getSubscribedAuthors']),
    items() {
      return this.getAllArticles.slice(0, 40);
    },
  },
  mounted() {
    this.fetchContent();
  },
  methods: {
    ...mapActions(['fetchReaderIndex', 'fetchArticle']),

    async fetchContent() {
      try {
        this.isLoading = true;
        await this.fetchReaderIndex();
        this.getSubscribedAuthors.forEach(u => this.fetchArticle(u));
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
