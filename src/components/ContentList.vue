<template>
  <div class="content-list">

    <div
      class="content-list-layout"
    >
      <div
        v-if="headerLabel"
        class="content-list__header"
      >
        <div class="content-list__header-label">{{ headerLabel }}</div>
      </div>

      <Transition
        :name="transitionName"
        mode="out-in"
        @after-enter="$Lazyload.lazyLoadHandler()"
      >
        <div
          :key="state"
          class="content-list__body"
        >
          <template v-if="state === 'loading'">
            <div
              v-for="key in 5"
              :key="key"
              class="content-card-wrapper"
            >
              <Card>
                <Placeholder class="w-3/5 h-16" />
                <Placeholder class="w-full h-16 mt-12" />
                <Placeholder class="w-2/5 h-16 mt-8" />
              </Card>
            </div>
          </template>
          <template v-else-if="state === 'content'">
            <SuperLikeContentCard
              v-for="item in items"
              :key="item.superLikeID || item.referrer"
              class="content-list__card"
              :referrer="item.referrer"
              :super-like-iscn-id="item.superLikeIscnId"
              :author-id="item.user"
              :cover-src="item.image"
              :title="item.title"
              :description="item.description"
              :like-count="item.like"
              :super-like-id="item.superLikeID"
              :super-like-short-id="item.superLikeShortID"
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
      </Transition>

    </div>
  </div>
</template>

<script>
import Card from '~/components/LegacyCard/Card';
import Placeholder from '~/components/Placeholder/Placeholder';
import SuperLikeContentCard from '~/components/SuperLikeContentCard';

export default {
  name: 'ContentList',
  components: {
    Card,
    Placeholder,
    SuperLikeContentCard,
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
  data() {
    return {
      isShowTransition: true,
    };
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
    transitionName() {
      return this.isShowTransition ? 'content-list-layout-' : undefined;
    },
  },
  watch: {
    state(newState, oldState) {
      // Don't show transition when loading -> content
      this.isShowTransition = oldState !== 'loading' || newState !== 'content';
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

    @media screen and (min-width: config('theme.screens.tablet.min')) {
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
      &enter-active,
      &leave-active {
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

    @apply rounded-[8px];

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

  &__card {
    &:not(:first-child) {
      @apply mt-24;
    }
  }
}
</style>
