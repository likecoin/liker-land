<template>
  <a
    class="content-card"
    :href="src"
    :title="title"
    target="_blank"
  >
    <div class="content-card__header content-card__inset">
      <span class="content-card__author-name">
        <a
          :href="authorURL"
          :title="author"
          target="_blank"
        >{{ author }}</a>
      </span>
    </div>

    <div
      v-if="coverSrc"
      class="content-card__cover-photo"
    >
      <img
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

export default {
  props: {
    /* The URL of the content */
    src: {
      type: String,
      required: true,
    },
    author: {
      type: String,
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
  },
  computed: {
    authorURL() {
      return `${LIKE_CO_URL_BASE}/${this.author}`;
    },
    url() {
      return new URL(this.src);
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
  }

  &__author-name {
    @apply flex-grow;

    > a {
      @apply text-18;
      @apply text-like-green;
      @apply font-600;

      &:hover {
        @apply text-like-green-dark;
      }
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
