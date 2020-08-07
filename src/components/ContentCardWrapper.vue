<template>
  <lazy-component
    v-if="isLoading || hasContent"
    class="content-card-wrapper"
    @show="fetchContent"
  >
    <ContentCard
      :src="internalUrl"
      :href="href"
      :author="author"
      :title="internalTitle"
      :description="internalDescription"
      :cover-src="internalCoverSrc"
      :like-count="internalLikeCount"
      :is-bookmarked="getIsInBookmark(referrer)"
      :is-followed="getIsFollowedAuthor(author.user)"
      @bookmark-click="onClickBookmark(referrer)"
      @toggle-follow="onClickFollowAuthor"
    />
  </lazy-component>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import ContentCard from '~/components/ContentCard';

import { logTrackerEvent } from '~/util/EventLogger';
import { getSuperLikeRedirectLink } from '@/util/api';

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
    superLikeId: {
      type: String,
      default: undefined,
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
      'getIsFollowedAuthor',
    ]),

    hasContent() {
      return (
        this.getIsInBookmark(this.referrer) ||
        this.internalTitle ||
        this.internalCoverSrc
      );
    },
    shouldFetchArticle() {
      return !this.internalTitle || !this.internalLikeCount;
    },
    href() {
      return this.superLikeId
        ? getSuperLikeRedirectLink(this.superLikeId)
        : this.internalUrl;
    },
  },

  methods: {
    ...mapActions([
      'fetchUserInfo',
      'fetchArticleInfo',
      'addBookmark',
      'removeBookmark',
      'followAuthor',
      'unfollowAuthor',
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
        this.$nuxt.error({
          message: 'LOGIN_NEEDED_TO_BOOKMARK',
          statusCode: 401,
        });
        return;
      }
      if (this.getIsInBookmark(referrer)) {
        this.removeBookmark(referrer);
        logTrackerEvent(this, 'Bookmark', 'BookmarkRemove', referrer, 1);
      } else {
        this.addBookmark(referrer);
        logTrackerEvent(this, 'Bookmark', 'BookmarkAdd', referrer, 1);
      }
    },

    async onClickFollowAuthor(done) {
      if (!this.getUserId) {
        this.$nuxt.error({
          message: 'LOGIN_NEEDED_TO_FOLLOW_AUTHOR',
          statusCode: 401,
        });
        return;
      }
      const { user: id } = this.author;
      if (this.getIsFollowedAuthor(id)) {
        await this.unfollowAuthor(id);
      } else {
        await this.followAuthor(id);
      }
      done();
    },
  },
};
</script>

<style lang="scss">
.content-card-wrapper {
  min-height: 8rem;
}
</style>
