<template>
  <transition
    name="content-list-"
    mode="out-in"
  >
    <div
      :key="state"
      class="content-list"
    >
      <div
        v-if="headerLabel"
        class="content-list__header"
      >
        <div class="content-list__header-label">{{ headerLabel }}</div>
      </div>
      <div class="content-list__body">
        <template v-if="state === 'loading'">
          <ContentCardPlaceholder
            v-for="key in 2"
            :key="key"
          />
        </template>
        <template v-else-if="state === 'content'">
          <ContentCardWrapper
            v-for="item in items"
            :key="item.referrer"
            :referrer="item.referrer"
            :src="item.url"
            :author-id="item.user"
            :cover-src="item.image"
            :title="item.title"
            :description="item.description"
            :like-count="item.like"
          />
        </template>
        <template v-else>
          <div class="content-list__empty">
            <slot name="empty">
              <h1>{{ $t('ContentList.empty') }}</h1>
            </slot>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import ContentCardWrapper from '~/components/ContentCardWrapper';
import ContentCardPlaceholder from '~/components/ContentCardPlaceholder';

export default {
  name: 'ContentList',
  components: {
    ContentCardWrapper,
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
    headerLabel: {
      type: String,
      default: '',
    },
  },
  computed: {
    state() {
      if (this.isLoading) {
        return 'loading';
      }
      if (this.items.length) {
        return 'content';
      }
      return 'empty';
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

  &__header-label {
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
