<template>
  <main class="page-content">
    <ContentList
      :is-loading="isLoading"
      :items="items"
      :header-label="$t('FollowingPage.headerLabel')"
    >
      <template #empty>
        <div class="pt-24 px-40">
          <EmptyIcon class="block mx-auto" style="width:5.5rem" />
          <h1>{{ $t('FollowingPage.empty.title') }}</h1>
          <p>{{ $t('FollowingPage.empty.content') }}</p>
        </div>

        <div class="flex justify-center py-24">
          <NuxtLink
            class="btn btn--plain btn--auto-size btn--with-icon btn--icon-top flex-1 m-0 pt-32"
            :to="{ name: 'index' }"
          >
            <FeaturedIcon class="btn__icon w-24 p-24" />
            {{ $t('FollowingPage.empty.goToFeaturing') }}
          </NuxtLink>
        </div>
      </template>
    </ContentList>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ContentList from '~/components/ContentList';

import EmptyIcon from '~/assets/images/following-empty.svg';
import FeaturedIcon from '~/assets/icons/featured.svg';

export default {
  name: 'Following',
  components: {
    ContentList,
    EmptyIcon,
    FeaturedIcon,
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
