<template>
  <header :class="getRootClass()">
    <slot v-bind="getSlotProps()" />

    <portal
      v-if="isFloatable"
      to="floating-page-header-container"
    >
      <div
        class="floating-page-header-container"
        :style="floatingHeaderStyle"
      >
        <header :class="getRootClass(true)">
          <slot v-bind="getSlotProps(true)" />
        </header>
      </div>
    </portal>
  </header>
</template>

<script>
import throttle from 'lodash.throttle';

const PAGE_HEADER_CLASS = 'page-header';
const FLOATING_PAGE_HEADER_CLASS = `${PAGE_HEADER_CLASS}--floating`;
const FLOATING_PAGE_HEADER_MIN_HEIGHT = 8; // In px;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getElementHeight(className) {
  const el = document.querySelector(`.${className}`);
  return el ? el.clientHeight : 0;
}

export default {
  name: 'PageHeader',
  isTicking: false,
  props: {
    isFloatable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      y: 0,
      scrollY: 0,
    };
  },
  computed: {
    floatingHeaderStyle() {
      const style = {
        transform: `translateY(${this.y}px)`,
      };
      if (this.scrollY === 0) {
        style.visibility = 'hidden';
      }
      return style;
    },
  },
  mounted() {
    if (this.isFloatable) {
      if (window.requestAnimationFrame) {
        this.throttledUpdateLayout = () => {
          if (!this.$options.isTicking) {
            window.requestAnimationFrame(this.updateLayout);
            this.$options.isTicking = true;
          }
        };
      } else {
        // Fallback if requestAnimationFrame is not support
        this.throttledUpdateLayout = throttle(this.updateLayout, 16);
      }
      window.addEventListener('scroll', this.throttledUpdateLayout);
      window.addEventListener('resize', this.throttledUpdateLayout);
      this.updateLayout();
    }
  },
  beforeDestroy() {
    if (this.isFloatable) {
      window.removeEventListener('scroll', this.throttledUpdateLayout);
      window.removeEventListener('resize', this.throttledUpdateLayout);
    }
  },
  methods: {
    getSlotProps(isFloating = false) {
      return {
        isFloating,
      };
    },
    getRootClass(isFloating = false) {
      return [
        PAGE_HEADER_CLASS,
        {
          [FLOATING_PAGE_HEADER_CLASS]: isFloating,
        },
      ];
    },

    updateLayout() {
      const headerHeight = getElementHeight(PAGE_HEADER_CLASS);
      const floatingHeaderHeight = getElementHeight(FLOATING_PAGE_HEADER_CLASS);

      const {
        innerWidth: windowWidth,
        innerHeight: windowHeight,
        pageYOffset: scrollY,
      } = window;
      const { scrollHeight } = document.documentElement;
      const diff = scrollY - this.scrollY;
      const isScrollingUp = diff < 0;
      this.scrollY = scrollY;

      /* eslint-disable prettier/prettier */
      if (scrollY < headerHeight) {
        // CONDITION:
        // The relative header is visible and the floating header is invisible
        //
        // BEHAVIOR:
        // Hide the floating header
        this.y = -999;
      } else if (scrollY >= scrollHeight - windowHeight - floatingHeaderHeight) {
        // CONDITION:
        // The floating header is invisible and scrollY nearly touch bottom
        //
        // BEHAVIOR:
        // Moving down the floating header
        this.y = clamp(
          this.y + Math.abs(diff),
          -floatingHeaderHeight,
          0
        );
      } else if (
        (scrollY < headerHeight + floatingHeaderHeight + windowHeight && diff > 0) ||
        (scrollY < headerHeight + floatingHeaderHeight)
      ) {
        // CONDITION:
        // The relative header is invisible and the floating header is visible
        //
        // BEHAVIOR:
        // Moving down the floating header and
        // fully visible for scrolling of a height of window
        // When it's moving up, keep the floating header visible
        // until the relative header is visible
        this.y = clamp(
          this.y + (diff * (isScrollingUp ? 1 : 0.2)),
          -floatingHeaderHeight,
          0
        );
      } else {
        // CONDITION:
        // The relative header is invisible and the floating header is visible
        //
        // BEHAVIOR:
        // Moving up the floating header until its visible height is minimum
        this.y = clamp(
          this.y - (diff * (isScrollingUp ? 1 : 0.2)),
          windowWidth > 528 ? 0 : FLOATING_PAGE_HEADER_MIN_HEIGHT - floatingHeaderHeight,
          0
        );
      }
      /* eslint-enable prettier/prettier */
      this.$options.isTicking = false;
    },
  },
};
</script>

<style lang="scss">
.floating-page-header-container {
  right: 100%;

  @apply absolute;
  @apply pin-t;

  @apply w-screen;
}

.page-header {
  @media screen and (min-width: config('screens.desktop.min')) {
    .site-nav-bar {
      @apply px-64;
    }

    &--floating .site-nav-bar {
      @apply absolute;
      @apply pin;

      @apply bg-transparent;
    }

    &:not(&--floating) .site-nav-bar {
      @apply pt-32;
    }
  }
}
</style>
