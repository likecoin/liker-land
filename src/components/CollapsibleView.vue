<template lang="pug">
  div(:class="rootClass")
    .collapsible-view__content-container(ref="content")
      slot(#default)
    .collapsible-view__toggle-button-wrapper(
      v-if="isCollapsible"
    )
      button.btn.btn--mini(
        @click="isShow = !isShow"
      )
        svg(
          width="16"
          height="16"
          viewBox="0 0 16 16"
        )
          polyline(
            ref="arrow"
            fill="transparent"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            :points="arrowPoints"
          )
        | {{ titleForToggleButton }}
</template>

<script>
export default {
  name: 'CollapsibleView',
  props: {
    isCollapsible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: !this.isCollapsible,
      arrowPoints: this.getArrowPoints(!this.isCollapsible),
    };
  },
  computed: {
    rootClass() {
      return {
        'collapsible-view': true,
        'collapsible-view--collapsible': this.isCollapsible,
        'collapsible-view--collapsed': !this.isShow,
      };
    },
    titleForToggleButton() {
      return this.$t(`CollapsibleView.${this.isShow ? 'less' : 'more'}`);
    },
  },
  watch: {
    isCollapsible(isCollapsible) {
      this.isShow = !isCollapsible;
    },
    isShow(isShow) {
      this.toggle(isShow);
    },
  },
  mounted() {
    this.toggle(this.isShow);
  },
  methods: {
    getArrowPoints(isUp) {
      if (isUp) {
        return '13,10 8,6 3,10';
      }
      return '13,6 8,10 3,6';
    },
    toggle(isShow) {
      const { arrow, content } = this.$refs;
      const duration = 1;
      const ease = 'easeOutPower4';

      const opts = {
        // XXX: Minus 2 to match actual height
        height: `${isShow ? content.scrollHeight - 2 : 32}px`,
        ease,
      };
      if (isShow) {
        opts.clearProps = 'all';
      }
      this.$gsap.TweenLite.to(content, duration, opts);

      if (arrow) {
        const points = this.getArrowPoints(isShow);
        this.$gsap.TweenLite.to(arrow, duration, {
          attr: { points },
          ease,
          onComplete: () => {
            this.arrowPoints = points;
          },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.collapsible-view {
  &__content-container {
    position: relative;

    overflow: hidden;

    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;

      height: 32px;

      content: '';

      transition: opacity 0.5s ease-out;

      pointer-events: none;

      opacity: 0;
      background-image: linear-gradient(to bottom, rgba(white, 0), white);

      .collapsible-view--collapsed & {
        opacity: 1;
      }
    }
  }

  &__toggle-button-wrapper {
    text-align: center;

    @apply text-12;
    @apply leading-1;

    @apply my-8;

    button svg {
      @apply mr-4;
    }
  }
}
</style>
