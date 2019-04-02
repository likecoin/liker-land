<template>
  <a
    class="content-card"
    :href="src"
    :title="title"
    target="_blank"
  >
    <div class="content-card__header content-card__inset">
      <span class="content-card__author">
        <a
          :href="authorURL"
          :title="authorId"
          target="_blank"
        >
          <LcAvatar
            v-lazy-container="{ selector: 'img' }"
            class="content-card__author-avatar"
            :src="authorAavtarSrc"
            :halo="authorAvatarHalo"
          />{{ authorId }}</a>
      </span>

      <span
        class="content-card__like-count"
      >{{ formattedLikeCount }}<LikeUnit /></span>
    </div>

    <div
      v-if="coverSrc"
      class="content-card__cover-photo"
    >
      <img
        v-lazy="coverSrc"
        :src="coverSrc"
        :alt="title"
      >
    </div>

    <div class="content-card__info content-card__inset">
      <a
        class="content-card__domain"
        :href="url.origin"
        target="_blank"
      >{{ url.hostname }}</a>
      <div
        v-if="title"
        class="content-card__title"
      >{{ title }}</div>
      <div
        v-if="description"
        class="content-card__description"
      >{{ description }}</div>
    </div>
  </a>
</template>

<script>
import { LIKE_CO_URL_BASE } from '~/constant';

import LikeUnit from '~/assets/icons/like-unit.svg';
import { getAvatarHaloTypeFromUser } from '~/util/user';

export default {
  components: {
    LikeUnit,
  },
  props: {
    /* The URL of the content */
    src: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
    /* The title of the content */
    title: {
      type: String,
      default: '',
    },
    /* The description of the content */
    description: {
      type: String,
      default: '',
    },
    /* The URL of the cover photo of the content */
    coverSrc: {
      type: String,
      default: '',
    },
    /* Total like of the content */
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    authorId() {
      return this.author.user;
    },
    authorURL() {
      return `${LIKE_CO_URL_BASE}/${this.author.user}`;
    },
    authorAvatarHalo() {
      return getAvatarHaloTypeFromUser(this.author);
    },
    authorAavtarSrc() {
      return this.author.avatar;
    },
    url() {
      return new URL(this.src);
    },
    formattedLikeCount() {
      let { likeCount } = this;
      let suffix = '';
      if (likeCount > 1000) {
        likeCount = Math.floor(likeCount / 1000);
        suffix = 'k';
      }
      return `${likeCount.toLocaleString('en')}${suffix}`;
    },
    coverPhotoStyle() {
      return { backgroundImage: `url(${this.coverSrc})` };
    },
  },
};
</script>

<style lang="scss">
.content-card {
  @apply block;
  @apply relative;

  @apply text-left;

  @apply bg-white;

  @apply border;
  @apply border-gray-e6;
  @apply rounded-8;

  &:hover {
    @apply bg-gray-f7;
  }

  &__inset {
    @apply px-16;
    @apply py-12;

    & + & {
      @apply pt-0;
    }
  }

  &__header {
    @apply flex;
    @apply items-center;
  }

  &__author-avatar {
    width: 2.25rem;
    height: 2.25rem;

    @apply mr-8;

    .lc-avatar__content {
      width: inherit !important;
      height: inherit !important;
    }
  }

  &__author {
    @apply flex-grow;

    > a {
      @apply text-18;
      @apply text-like-green;
      @apply font-600;

      @apply flex;
      @apply items-center;

      &:hover {
        @apply text-like-green-dark;
      }
    }
  }

  &__like-count {
    line-height: 0.5;

    @apply text-14;
    @apply text-gray-4a;
    @apply font-600;

    @apply flex;
    @apply items-center;
    @apply flex-no-grow;

    svg {
      width: 2rem;
      height: 0.85em;
      margin-bottom: 0.1rem;

      @apply ml-8;

      @apply fill-current;
    }
  }

  &__cover-photo {
    @apply relative;

    @apply truncate;

    @apply border;
    @apply border-l-0;
    @apply border-r-0;

    > img {
      @apply block;
      @apply object-cover;

      @apply min-w-full;
    }

    &:after {
      content: '';

      @apply absolute;
      @apply pin;

      @apply pointer-events-none;

      .content-card:hover & {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }

  &__domain {
    @apply inline-block;

    @apply text-14;
    @apply text-gray-4a;

    &:hover {
      @apply text-gray-31;
      @apply underline;
    }
  }

  &__title {
    @apply text-20;
    @apply text-black;
    @apply font-600;
    @apply whitespace-normal;
    @apply break-words;

    @apply mt-4;
  }

  &__description {
    @apply text-14;
    @apply text-gray-4a;
    @apply whitespace-normal;
    @apply break-words;

    @apply mt-8;
  }
}
</style>
