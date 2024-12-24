<template>
  <div
    class="relative flex hover-animate"
    :style="{
      '--animation-duration': durationTime,
    }"
  >
    <ul class="flex animate-scroll">
      <slot name="item" />
    </ul>
    <ul class="flex animate-scroll delay">
      <slot name="item" />
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ScrollingList',
  props: {
    animationDuration: {
      type: String,
      default: '60s',
    },
  },
  computed: {
    durationTime() {
      return this.animationDuration;
    },
  },
};
</script>

<style scoped>
.animate-scroll {
  animation: scroll var(--animation-duration, 60s) infinite linear;
}

.animate-scroll.delay {
  animation: scroll var(--animation-duration, 60s) infinite linear;
  animation-delay: calc(var(--animation-duration, 60s) * -1);
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
