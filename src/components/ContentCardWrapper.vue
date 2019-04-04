<template>
  <div
    v-if="isLoading || hasContent"
    class="content-card-wrapper"
  >
    <lazy-component
      class="content-card-wrapper__lazy-load-detector"
      @show="fetchContent"
    />
    <transition
      :css="false"
      @before-enter="onBeforeEnter"
      @before-leave="onBeforeLeave"
      @enter="onEnter"
      @leave="onLeave"
      @after-enter="onAfterEnter"
    >
      <ContentCardPlaceholder
        v-if="isLoading"
        key="placeholder"
      />
      <ContentCard
        v-else-if="hasContent"
        key="card"
        :src="internalUrl"
        :author="author"
        :title="internalTitle"
        :description="internalDescription"
        :cover-src="internalCoverSrc"
        :should-fetch-cover="!isAnimating"
        :like-count="internalLikeCount"
        :can-bookmark="!!getUserId"
        :is-bookmarked="getIsInBookmark(referrer)"
        @bookmark-click="onClickBookmark(referrer)"
      />
    </transition>
  </div>
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
      isAnimating: true,

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

    /* eslint-disable no-param-reassign */
    onBeforeEnter(el) {
      el.style.opacity = 0;
    },
    onBeforeLeave(el) {
      // Set the wrapper's height to the leaving element's height
      this.$el.style.height = `${el.offsetHeight}px`;
      el.style.position = 'absolute';
      // Set left, right & height to prevent collapse if position of the element is absolute
      el.style.left = 0;
      el.style.right = 0;
      el.style.height = 'inherit';
    },
    onEnter(el, done) {
      if (!this.$velocity) {
        done();
        return;
      }

      // Fade in the entering element
      this.$velocity(el, { opacity: [1, 'easeOutCubic'] }, { duration: 1000 });

      // Set the wrapper's height to the entering element's height
      this.$velocity(
        this.$el,
        { height: el.offsetHeight },
        { duration: 1000, easing: 'easeOutCubic', complete: done }
      );
    },
    onLeave(el, done) {
      if (!this.$velocity) {
        done();
        return;
      }
      // Fade out the leaving element
      this.$velocity(
        el,
        { opacity: 1 },
        { duration: 500, easing: 'easeOutCubic', complete: done }
      );
    },
    onAfterEnter(el) {
      // Remove the wrapper's fixed height
      el.removeAttribute('style');
      this.$el.removeAttribute('style');
      this.isAnimating = false;
    },
    /* eslint-enable no-param-reassign */

    onClickBookmark(referrer) {
      if (this.getIsInBookmark(referrer)) {
        this.removeBookmark(referrer);
      } else {
        this.addBookmark(referrer);
      }
    },
  },
};
</script>

<style lang="scss">
.content-card-wrapper {
  @apply relative;

  &__lazy-load-detector {
    @apply absolute;
    @apply pin;

    @apply pointer-events-none;
  }
}
</style>
