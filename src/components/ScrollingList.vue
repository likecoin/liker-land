<template>
  <div
    ref="sliderContainer"
    :class="[
      'relative',
      'flex',
      'overflow-x-auto laptop:overflow-x-hidden',
      'hover-animate',

      'select-none',
      'scrollbar-custom',
    ]"
    :style="{
      '--animation-duration': durationTime,
    }"
    @mousedown="startDrag"
    @mousemove="onDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    @touchstart="startDrag"
    @touchmove="onDrag"
    @touchend="endDrag"
  >
    <ul class="flex animate-scroll">
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
    },
    onDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      const pageX = event.pageX || event.touches[0].pageX;
      const x = pageX - this.$refs.sliderContainer.offsetLeft;
      const walk = (x - this.startX) * 1.5;
      this.$refs.sliderContainer.scrollLeft = this.scrollLeft - walk;
    },
    endDrag() {
      this.isDragging = false;
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
