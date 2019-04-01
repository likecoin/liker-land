<template>
  <ContentCardPlaceholder v-if="!loaded" />
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
  computed: {
    ...mapGetters(['getUserInfoById', 'getArticleInfoByReferrer']),
    loaded() {
      return !!this.internalTitle;
    },
    articleNeedFetch() {
      return !this.internalTitle || !this.internalLikeCount;
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
  async mounted() {
    const promises = [];
    if (
      this.articleNeedFetch &&
      !this.getArticleInfoByReferrer(this.referrer)
    ) {
      promises.push(this.fetchArticleInfo(this.referrer).catch(() => ({})));
    }
    if (!this.author.user) await Promise.all(promises);
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
      if (!this.author.user) {
        this.author = { user };
      }
    }
    if (!this.getUserInfoById(this.author.user)) {
      promises.push(this.fetchUserInfo(this.author.user).catch(() => ({})));
    }
    await Promise.all(promises);
    this.author = this.getUserInfoById(this.author.user) || this.author;
  },
  methods: {
    ...mapActions(['fetchUserInfo', 'fetchArticleInfo']),
  },
};
</script>
