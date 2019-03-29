<template>
  <ContentCardPlaceholder v-if="!loaded"/>
  <ContentCard
    v-else
    :src="src"
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
import { getUserMinAPI } from '~/util/api';

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
    ...mapGetters(['getUserInfoById', 'getArticleInfoByUrl']),
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
      internalTitle: this.title,
      internalDescription: this.description,
      internalCoverSrc: this.coverSrc,
      internalLikeCount: this.likeCount,
    };
  },
  async mounted() {
    if (this.authorId) console.log(this.authorId);
    let promises = [];
    if (this.articleNeedFetch && !this.getArticleInfoByUrl(this.src)) {
      promises.push(this.fetchArticleInfo(this.src).catch(() => ({})));
    }
    if (!this.author.user) await Promise.all(promises);
    if (this.getArticleInfoByUrl(this.src)) {
      const {
        image,
        title,
        description,
        like,
        user,
      } = this.getArticleInfoByUrl(this.src);
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
  },
  methods: {
    ...mapActions(['fetchUserInfo', 'fetchArticleInfo']),
  },
}
</script>
