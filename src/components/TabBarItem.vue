<template>
  <li
    :class="[
      'tab-bar-item',
      {
        'tab-bar-item--active': isActive,
      }
    ]"
  >
    <nuxt-link
      class="tab-bar-item-button"
      :to="to"
    >
      <div
        :class="[
          'tab-bar-item-button__content',
          {
            'tab-bar-item-button__content--icon': !!$slots.icon,
          }
        ]"
      >
        <div v-if="shouldShowContent">
          <slot />
        </div>
      </div>

      <div class="tab-bar-item-indicator">
        <svg
          class="tab-bar-item-indicator__notch"
          viewBox="0 0 6 2"
        >
          <path d="M0,2h0.2C0.6,0.8,1.7,0,3,0H0V2zM3,0c1.3,0,2.4,0.8,2.8,2H6V0H3z" />
        </svg>
        <svg
          class="tab-bar-item-indicator__extrusion"
          viewBox="0 0 56.6 12"
        >
          <path d="M28.3,12C41.4,12,41.4,0,56.6,0H0C16.3,0,15.1,12,28.3,12z" />
        </svg>
        <span class="tab-bar-item-indicator__light" />
      </div>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    to: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    shouldShowContent() {
      return Object.keys(this.$slots).length;
    },
  },
};
</script>

<style lang="scss">
.tab-bar-item {
  @apply text-center;

  @apply flex-1;

  &-button {
    color: inherit;

    transition: opacity 0.25s ease;

    @apply flex;
    @apply flex-col;
    @apply justify-end;

    @apply w-full;
    @apply h-full;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      opacity: 0.95;
    }

    &__content {
      @apply bg-inherit-color;

      @apply flex;
      @apply justify-center;
      @apply items-center;
      @apply flex-grow;

      > div {
        transition: color 0.5s ease;

        @apply text-white;

        @apply flex;
        @apply justify-center;
        @apply items-center;

        @apply px-12;
        @apply py-8;

        @apply fill-current;

        .tab-bar-item--active & {
          @apply text-like-cyan;
        }

        svg {
          @apply w-24;
          @apply h-24;
        }
      }
    }
  }

  &-indicator {
    height: 2px;

    @apply relative;
    @apply flex;

    &:before,
    &:after {
      content: '';

      @apply bg-current;

      @apply flex-1;
    }

    &__notch {
      @apply block;

      @apply h-full;

      @apply shrink-0;
      @apply grow-0;

      @apply fill-current;
    }

    &__extrusion {
      top: 100%;
      left: 50%;

      height: 12px;

      transform: translateX(-50%) scaleY(0);

      transform-origin: center top;
      transition: transform 0.3s ease;

      @apply absolute;

      @apply w-auto;

      @apply fill-current;

      .tab-bar-item--active & {
        transform: translateX(-50%) scaleY(1);
      }
    }

    &__light {
      top: 0;
      left: calc((100% - 6px) / 2);

      width: 6px;
      height: 6px;

      transition-property: opacity, transform;
      transition-duration: 0.25s;
      transition-timing-function: ease-in-out;

      @apply block;
      @apply absolute;
      @apply opacity-0;
      @apply z-10;

      @apply bg-like-cyan;

      @apply rounded-[8px];

      .tab-bar-item--active & {
        transform: translateY(-2px);

        @apply opacity-100;
      }
    }
  }
}
</style>
