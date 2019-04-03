<template>
  <ContentCardPlaceholder v-if="isLoading" />
  <ContentCard
    v-else-if="hasContent"
    :src="internalUrl"
    :author="author"
    :title="internalTitle"
    :description="internalDescription"
    :cover-src="internalCoverSrc"
    :like-count="internalLikeCount"
  />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ContentCard from '~/components/ContentCard';
import ContentCardPlaceholder from '~/components/ContentCardPlaceholder';

export default {
  name: 'ContentCardWrapper',
  components: {
    ContentCard,
    ContentCardPlaceholder,
  },
  props: {
    src: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    coverSrc: {
      type: String,
      default: '',
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isLoading: true,
      author: { user: this.authorId },
      internalUrl: this.src,
      internalTitle: this.title,
      internalDescription: this.description,
      internalCoverSrc: this.coverSrc,
      internalLikeCount: this.likeCount,
    };
  },
  computed: {
    ...mapGetters(['getUserInfoById', 'getArticleInfoByReferrer']),

    hasContent() {
      return this.internalTitle || this.internalCoverSrc;
    },
    shouldFetchArticle() {
      return !this.internalTitle || !this.internalLikeCount;
    },
  },
  mounted() {
    this.fetchContent();
  },
  methods: {
    ...mapActions(['fetchUserInfo', 'fetchArticleInfo']),
    async fetchContent() {
      try {
        this.isLoading = true;
        const promises = [];
        if (
          this.shouldFetchArticle &&
          !this.getArticleInfoByReferrer(this.referrer)
        ) {
          promises.push(
            this.fetchArticleInfo(this.referrer)
              .then(() => this.updateArticleInfo())
              .catch(() => ({}))
          );
        } else {
          this.updateArticleInfo();
        }
        if (!this.author.user) await Promise.all(promises);
        if (this.author.user && !this.getUserInfoById(this.author.user)) {
          promises.push(
            this.fetchUserInfo(this.author.user)
              .then(() => this.updateAuthorInfo())
              .catch(() => ({}))
          );
        } else {
          this.updateAuthorInfo();
        }
        await Promise.all(promises);
      } finally {
        this.isLoading = false;
      }
    },
    updateArticleInfo() {
      if (this.getArticleInfoByReferrer(this.referrer)) {
        const {
          url,
          image,
          title,
          description,
          like,
          user,
        } = this.getArticleInfoByReferrer(this.referrer);
        this.internalUrl = url;
        this.internalTitle = title;
        this.internalDescription = description;
        this.internalCoverSrc = image;
        this.internalLikeCount = like;
        // If authorId is not given, we can retrieve from article info
        if (!this.author.user) {
          this.author = { user };
        }
      }
    },
    updateAuthorInfo() {
      this.author = this.getUserInfoById(this.author.user) || this.author;
    },
  },
};
</script>
