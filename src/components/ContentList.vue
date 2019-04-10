<template>
  <div class="content-list">
    <transition
      name="content-list-layout-"
      mode="in-out"
    >
      <div
        :key="state"
        class="content-list-layout"
      >

        <div
          v-if="headerLabel"
          class="content-list__header"
        >
          <div class="content-list__header-label">{{ headerLabel }}</div>
        </div>

        <div class="content-list__body">
          <template v-if="state === 'loading'">
            <div
              v-for="key in 5"
              :key="key"
              class="content-card-wrapper"
            >
              <ContentCard />
            </div>
          </template>
          <template v-else-if="state === 'content'">
            <ContentCardWrapper
              v-for="item in items"
              :key="item.referrer"
              :referrer="item.referrer"
              :src="item.url || item.referrer"
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
                <div class="p-40">
                  <h1>{{ $t('ContentList.empty') }}</h1>
                </div>
              </slot>
            </div>
          </template>
        </div>

      </div>
    </transition>
  </div>
</template>

<script>
import ContentCard from '~/components/ContentCard';
import ContentCardWrapper from '~/components/ContentCardWrapper';

export default {
  name: 'ContentList',
  components: {
    ContentCard,
    ContentCardWrapper,
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
  @apply relative;

  &-layout {
    @apply px-16;
    @apply py-24;

    @apply w-full;

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
        @apply relative;

        transition-timing-function: ease;
      }
      &leave-active {
        @apply absolute;

        transition-timing-function: ease;
      }
    }
  }

  &__body {
    .content-card-wrapper {
      &:not(:first-child) {
        @apply mt-16;
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
    @apply leading-1_5;

    @apply fill-current;

    @apply rounded;

    @apply bg-white;

    h1 {
      @apply text-20;
      @apply font-600;
      @apply mt-4;
    }

    p {
      @apply mt-20;
    }
  }
}
</style>
