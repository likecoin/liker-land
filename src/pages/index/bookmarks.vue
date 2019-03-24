<template>
  <main class="page-content">
    <ContentList
      :is-loading="isLoading"
      :items="items"
    />
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ContentList from '~/components/ContentList';

export default {
  name: 'Bookmarks',
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
    ...mapGetters([]),
    items() {
      return [];
    },
  },
  mounted() {
    this.fetchContent();
  },
  methods: {
    ...mapActions([]),

    fetchContent() {
      try {
        this.isLoading = true;
        // TODO
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
