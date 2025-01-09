<template>
  <div
    ref="sliderContainer"
    :class="[
      'relative',
      'flex',
      'overflow-x-scroll laptop:overflow-x-hidden',
      'hover-animate',

      'select-none',
      'scrollbar-custom',
    ]"
    :style="{
      '--animation-duration': durationTime,
    }"
  >
    <ul class="flex laptop:hidden">
      <slot name="item" />
    </ul>
    <ul class="hidden laptop:flex animate-scroll">
      <slot name="item" />
    </ul>
    <ul class="hidden laptop:flex animate-scroll delay">
      <slot name="item" />
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ScrollingList',
  props: {
    animationDuration: {
      type: [String, Number],
      default: '60',
    },
  },
  data() {
    return {
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
      velocity: 0,
      animationFrame: null,
    };
  },
  computed: {
    durationTime() {
      return `${this.animationDuration}s`;
    },
  },
  methods: {
    startDrag(event) {
      this.isDragging = true;
      const pageX = event.pageX || event.touches[0].pageX;
      this.startX = pageX - this.$refs.sliderContainer.offsetLeft;
      this.scrollLeft = this.$refs.sliderContainer.scrollLeft;

      cancelAnimationFrame(this.animationFrame);
      this.velocity = 0;
    },
    onDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      const pageX = event.pageX || event.touches[0].pageX;
      const x = pageX - this.$refs.sliderContainer.offsetLeft;
      const delta = x - this.startX;
      this.$refs.sliderContainer.scrollLeft = this.scrollLeft - delta;
      this.velocity = delta;
    },
    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.startInertiaScroll();
    },
    startInertiaScroll() {
      const friction = 0.95;
      const step = () => {
        if (Math.abs(this.velocity) < 0.1) {
          cancelAnimationFrame(this.animationFrame);
          return;
        }

        this.$refs.sliderContainer.scrollLeft -= this.velocity;

        this.velocity *= friction;

        this.animationFrame = requestAnimationFrame(step);
      };

      step();
    },
  },
};
</script>

<style scoped>
@screen laptop {
  .animate-scroll,
  .animate-scroll.delay {
    animation: scroll var(--animation-duration, 60s) infinite linear;
  }
  .animate-scroll.delay {
    animation-delay: calc(var(--animation-duration, 60s) * -1);
  }
}

.hover-animate:hover .animate-scroll,
.hover-animate:hover .animate-scroll.delay {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(100);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
