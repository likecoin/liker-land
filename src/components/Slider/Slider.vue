<template>
  <div class="slider py-8">
    <div class="relative">
      <input
        class="block w-full h-8 opacity-0"
        type="range"
        v-bind="{ value, min, max }"
        @input="$emit('input', $event.target.value)"
      >
      <div class="slider__track absolute pin w-full bg-gray-e6 rounded-full pointer-events-none">
        <div class="relative h-full">
          <span
            class="slider__thumb absolute w-24 h-24 bg-white rounded-full border-like-cyan-light border-2 shadow-md"
            :style="{ left: `${value / max * 100}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.slider {
  .slider__track {
    padding: 0 6px;
  }

  .slider__thumb {
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
