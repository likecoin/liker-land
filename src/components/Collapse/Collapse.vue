<template>
  <div ref="root" :class="rootClass">
    <div ref="content" class="collapse__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collapse',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rootClass() {
      return [
        'collapse',
        {
          'collapse--show': this.isShow,
        },
      ];
    },
  },
  watch: {
    isShow(isShow) {
      if (isShow) {
        this.$gsap.TweenLite.fromTo(
          this.$refs.root,
          0.25,
          {
            height: 0,
          },
          {
            height: this.$refs.content.offsetHeight,
            clearProps: 'height',
          }
        );
      } else {
        this.$gsap.TweenLite.to(this.$refs.root, 0.25, {
          height: 0,
        });
      }
    },
  },
  mounted() {
    if (!this.isShow) {
      this.$gsap.TweenLite.set(this.$refs.root, { height: 0 });
    }
  },
};
</script>

<style lang="scss">
.collapse {
  overflow: hidden;
}
</style>
