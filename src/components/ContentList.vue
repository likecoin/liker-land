<template>
  <transition
    name="content-list-"
    mode="out-in"
  >
    <div
      v-if="isLoading"
      key="loading"
      class="content-list"
    >
      <div class="content-list__body mt-32">
        <ContentCardPlaceholder
          v-for="key in 2"
          :key="key"
        />
      </div>
    </div>

    <div
      v-else-if="items.length"
      key="content"
      class="content-list"
    >
      <div class="content-list__header">
        <div class="content-list__start-reading-label">
          {{ $t('ContentList.startReading') }}</div>
      </div>
      <div class="content-list__body">
        <ContentCard
          v-for="item in items"
          :key="item.url"
          :src="item.url"
          :author="item.user"
          :cover-src="item.image"
          :title="item.title"
          :description="item.description"
        />
      </div>
    </div>

    <div
      v-else
      key="empty"
      class="content-list"
    >
      <div class="content-list__body">
        <div class="content-list__empty">
          <slot name="empty">
            <h1>{{ $t('ContentList.empty') }}</h1>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ContentCard from '~/components/ContentCard';
import ContentCardPlaceholder from '~/components/ContentCardPlaceholder';

export default {
  name: 'ContentList',
  components: {
    ContentCard,
    ContentCardPlaceholder,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss">
.content-list {
  @apply flex-grow;

  @apply w-full;
  @apply max-w-phone;

  @apply mx-auto;
  @apply px-16;
  @apply py-24;

  @media screen and (min-width: config('screens.tablet.min')) {
    @apply px-24;
  }

  &-- {
    &enter,
    &leave-to {
      opacity: 0;
    }

    &enter-active,
    &leave-active {
      transition-property: opacity;
      transition-duration: 0.5s;
    }
    &enter-active {
      transition-timing-function: ease-out;
    }
    &leave-active {
      transition-timing-function: ease-in;
    }
  }

  &__body {
    .content-card {
      &,
      &-placeholder {
        &:not(:first-child) {
          @apply mt-16;
        }
      }
    }
  }

  &__start-reading-label {
    @apply text-like-cyan;
    @apply text-14;
    @apply font-600;
    @apply text-center;

    @apply py-8;
  }

  &__empty {
    @apply text-gray-9b;
    @apply text-14;
    @apply text-center;

    @apply rounded;

    @apply bg-white;

    @apply p-40;

    h1 {
      @apply text-20;
      @apply font-600;
    }

    > *:not(:first-child) {
      @apply mt-20;
    }
  }
}
</style>
