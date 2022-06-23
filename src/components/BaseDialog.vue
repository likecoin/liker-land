<template lang="pug">
  Transition(
    :css="isAnimated"
    appear
    name="base-dialog-"
    v-on="transitionListeners"
  )
    div(
      v-if="isShow"
      :class="rootClass"
      @click="onClickDialog"
    )
      .base-dialog__backdrop
        slot(name="backdrop")
      Transition(
        name="fade"
        mode="out-in"
      )
        .base-dialog__content-container(
          ref="contentContainer"
          :class="contentContainerWrapperClass"
          :key="contentKey"
        )
          header(v-if="$slots.header")
            slot(name="header")
          main(:class="contentContainerClass")
            slot
          footer(v-if="$slots.footer")
            slot(name="footer")
</template>

<script>
import { ResizeObserver } from 'resize-observer';

export default {
  props: {
    isShow: {
      type: [Boolean, String],
      default: false,
    },
    isFullscreen: {
      type: [Boolean, String],
      default: false,
    },
    isShowBackdrop: {
      type: [Boolean, String],
      default: true,
    },
    isBackdropOpaque: {
      type: [Boolean, String],
      default: false,
    },
    isClosable: {
      type: [Boolean, String],
      default: true,
    },
    isAnimated: {
      type: [Boolean, String],
      default: true,
    },
    contentContainerClass: {
      type: [String, Array, Object],
      default: undefined,
    },
    contentContainerWrapperClass: {
      type: [String, Array, Object],
      default: undefined,
    },
    contentKey: {
      type: String,
      default: undefined,
    },
    isAbsolute: {
      type: [Boolean, String],
      default: true,
    },
  },
  computed: {
    rootClass() {
      return {
        'base-dialog': true,
        'base-dialog--absolute': this.isAbsolute,
        'base-dialog--fullscreen': !!this.isFullscreen,
        'base-dialog--with-backdrop': this.isShowBackdrop,
        'base-dialog--with-backdrop-opaque': this.isBackdropOpaque,
      };
    },
    transitionListeners() {
      const {
        resize,
        'click-outside': clickOutside,
        'update:isShow': updateIsShow,
        ...listeners
      } = this.$listeners;
      return listeners;
    },
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(this.onResize);
    if (this.isShow) this.onResize();
  },
  beforeDestroy() {
    this.resizeObserver.disconnect();
  },
  methods: {
    onBeforeEnter(el) {
      this.$emit('before-enter', el);
    },
    onEnter(el, done) {
      const dialogs = document.querySelectorAll('.base-dialog');
      if (dialogs && dialogs.length) {
        const pageWrapper = document.querySelector('.page-wrapper');
        pageWrapper.style.maxHeight = '100vh';
        pageWrapper.style.overflow = 'hidden';
      }
      this.$emit('enter', el, done);
    },
    onAfterEnter() {
      this.$emit('after-enter');
      if (this.resizeObserver && this.$refs.contentContainer) {
        this.resizeObserver.observe(document.documentElement, {
          box: 'border-box',
        });
        this.resizeObserver.observe(this.$refs.contentContainer, {
          box: 'border-box',
        });
      }
    },
    onBeforeLeave(el) {
      this.$emit('before-leave', el);
      this.resizeObserver.unobserve(document.documentElement);
      this.resizeObserver.unobserve(this.$refs.contentContainer);
    },
    onLeave(el, done) {
      this.$emit('leave', el, done);
    },
    onAfterLeave() {
      this.$emit('after-leave');
      const dialogs = document.querySelectorAll('.base-dialog');
      if (!dialogs.length) {
        const pageWrapper = document.querySelector('.page-wrapper');
        pageWrapper.style.removeProperty('max-height');
        pageWrapper.style.removeProperty('overflow');
      }
    },
    onResize() {
      if (!this.$refs.contentContainer) return;
      const windowHeight = window.innerHeight;
      const {
        offsetWidth: width,
        offsetHeight: contentHeight,
        style,
      } = this.$refs.contentContainer;

      // Align the dialog to the vertical center of window
      style.marginTop =
        !this.isFullscreen && contentHeight < windowHeight
          ? `${Math.min((windowHeight - contentHeight) / 2, 128)}px`
          : 0;

      this.$emit('resize', {
        width,
        height: contentHeight,
      });
    },
    onClickDialog(e) {
      if (e.target.contains(this.$refs.contentContainer)) {
        this.onClickOutside(e);
      }
    },
    onClickOutside(e) {
      if (this.isClosable) {
        this.$emit('click-outside', e);
        this.$emit('update:isShow', false);
      }
    },
  },
};
</script>

<style lang="scss">
.base-dialog {
  position: relative;
  z-index: 1000;

  width: 100%;

  &-- {
    &enter,
    &leave-to {
      opacity: 0;
    }

    &enter-active,
    &leave-active {
      transition-duration: 0.25s;
      transition-property: opacity, transform !important;
    }
    &enter-active {
      transition-timing-function: ease-out;
    }
    &leave-active {
      transition-timing-function: ease-in;
    }
  }

  &--absolute {
    position: absolute;
    top: 0;
    left: 0;

    pointer-events: none;
  }

  &--with-backdrop {
    &:not(#{&}--fullscreen) {
      &::before {
        position: fixed;
        top: -50vh;
        right: -50vw;
        bottom: -50vh;
        left: -50vw;

        content: '';

        pointer-events: auto;

        background: rgba(#e6e6e6, 0.5);
      }
    }

    &-opaque::before {
      background-color: #e6e6e6 !important;
    }
  }

  &__content-container {
    position: relative;

    pointer-events: auto;

    width: 100%;

    .base-dialog:not(.base-dialog--fullscreen) & {
      max-width: config('theme.screens.phone.max');

      main {
        background-color: white;
        box-shadow: 0 4px 25px 0 rgba(black, 0.4);
      }

      @media screen and (min-width: config('theme.screens.tablet.min')) {
        margin: 104px auto 56px;
      }
    }

    .base-dialog:not(.base-dialog--absolute) & {
      margin-top: 0 !important;
    }
  }
}
</style>
