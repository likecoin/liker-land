<template>
  <ContentCardPlaceholder v-if="!isLoaded" />
  <ContentCard
    v-else
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

    isLoaded() {
      return !!this.internalTitle;
    },
    shouldFetchArticle() {
      return !this.internalTitle || !this.internalLikeCount;
    },
  },
  async mounted() {
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
  },
  methods: {
    ...mapActions(['fetchUserInfo', 'fetchArticleInfo']),
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
