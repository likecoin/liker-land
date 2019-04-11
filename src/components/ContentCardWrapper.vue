<template>
  <lazy-component
    v-if="isLoading || hasContent"
    class="content-card-wrapper"
    @show="fetchContent"
  >
    <ContentCard
      :src="internalUrl"
      :author="author"
      :title="internalTitle"
      :description="internalDescription"
      :cover-src="internalCoverSrc"
      :like-count="internalLikeCount"
      :is-bookmarked="getIsInBookmark(referrer)"
      @bookmark-click="onClickBookmark(referrer)"
    />
  </lazy-component>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ContentCard from '~/components/ContentCard';

import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'ContentCardWrapper',
  components: {
    ContentCard,
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
      default: undefined,
    },
    title: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      default: undefined,
    },
    coverSrc: {
      type: String,
      default: undefined,
    },
    likeCount: {
      type: Number,
      default: -1,
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
    ...mapGetters([
      'getUserId',
      'getUserInfoById',
      'getArticleInfoByReferrer',
      'getIsInBookmark',
    ]),

    hasContent() {
      return this.internalTitle || this.internalCoverSrc;
    },
    shouldFetchArticle() {
      return !this.internalTitle || !this.internalLikeCount;
    },
  },

  methods: {
    ...mapActions([
      'fetchUserInfo',
      'fetchArticleInfo',
      'addBookmark',
      'removeBookmark',
    ]),

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

    onClickBookmark(referrer) {
      if (!this.getUserId) {
        throw new Error('LOGIN_NEEDED_TO_BOOKMARK');
      }
      if (this.getIsInBookmark(referrer)) {
        this.removeBookmark(referrer);
        logTrackerEvent(this, 'Bookmark', 'BookmarkRemove', referrer, 1);
      } else {
        this.addBookmark(referrer);
        logTrackerEvent(this, 'Bookmark', 'BookmarkAdd', referrer, 1);
      }
    },
  },
};
</script>

<style lang="scss">
.content-card-wrapper {
  min-height: 8rem;
}
</style>
