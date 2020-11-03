<template lang="pug">
  lazy-component(
    class="super-like-content-card"
    @show="fetchContent"
  )
    Card(v-if="isLoading")
      Placeholder(style="width: 60%;height: 16px")
      Placeholder(style="width: 100%;height: 16px;margin-top: 12px")
      Placeholder(style="width: 40%;height: 16px;margin-top: 8px")
    Card(
      v-else
      :href="href"
      :title="internalTitle"
      :description="internalDescription"
      :image-src="internalCoverSrc"
    )
      template(#footer-left)
        NuxtLink(
          v-if="preset === 'default' && author && author.user"
          :to="{ name: 'id', params: { id: author.user } }"
        )
          Identity(
            :avatar-url="author.avatar"
            :is-avatar-outlined="author.isSubscribedCivicLiker || author.isCivicLikerTrial"
            :display-name="author.displayName || author.user"
          )
        .super-like-content-card__timestamp(
          v-else-if="preset === 'work'"
        )
          | {{ formatDate(timestamp) }}

      template(#footer-right)
        Button(
          :preset="getIsInBookmark(referrer) ? 'primary' : 'secondary'"
          @click.prevent="onClickBookmark"
        )
          BookmarkFilledIcon(v-if="getIsInBookmark(referrer)")
          BookmarkOutlinedIcon(v-else)
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import { getSuperLikeRedirectLink } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';

import BookmarkFilledIcon from '~/components/Icon/BookmarkFilled';
import BookmarkOutlinedIcon from '~/components/Icon/BookmarkOutlined';
import Button from '~/components/Button/Button';
import Card from '~/components/Card/Card';
import Identity from '~/components/Identity/Identity';
import Placeholder from '~/components/Placeholder/Placeholder';

export default {
  name: 'SuperLikeContentCard',
  components: {
    BookmarkFilledIcon,
    BookmarkOutlinedIcon,
    Button,
    Card,
    Identity,
    Placeholder,
  },
  props: {
    preset: {
      type: String,
      default: 'default',
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
    superLikeShortId: {
      type: String,
      default: undefined,
    },
    timestamp: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isLoading: true,

      author: { user: this.authorId },
      internalUrl: this.referrer,
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

    shouldFetchArticle() {
      return !this.internalTitle;
    },
    href() {
      if (this.superLikeShortId) {
        return getSuperLikeRedirectLink(this.superLikeShortId);
      }
      if (this.superLikeId) return getSuperLikeRedirectLink(this.superLikeId);
      return this.internalUrl;
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

    formatDate(timestamp) {
      return dateFormat(new Date(timestamp), 'DD/MM/YYYY');
    },

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
        this.$emit('fetched');
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

    onClickBookmark() {
      if (!this.getUserId) {
        this.$nuxt.error({
          message: 'LOGIN_NEEDED_TO_BOOKMARK',
          statusCode: 401,
        });
        return;
      }
      if (this.getIsInBookmark(this.referrer)) {
        this.removeBookmark(this.referrer);
        logTrackerEvent(this, 'Bookmark', 'BookmarkRemove', this.referrer, 1);
      } else {
        this.addBookmark(this.referrer);
        logTrackerEvent(this, 'Bookmark', 'BookmarkAdd', this.referrer, 1);
      }
    },

    async onClickFollowAuthor() {
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
    },
  },
};
</script>

<style lang="scss">
.super-like-content-card {
  /* Prevent the height too short for lazy-component */
  min-height: 78px;

  &__timestamp {
    @apply text-gray-9b;
    @apply font-200;
    @apply text-14;
  }
}
</style>
