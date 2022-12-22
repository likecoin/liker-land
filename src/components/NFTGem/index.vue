<template>
  <div class="absolute left-[50%] translate-x-[-50%] flex items-center justify-center mx-auto">
    <!-- Square gem -->
    <div
      v-if="level !== undefined && level < 13"
      class="w-[24px] h-[24px]"
    >
      <ToolTips :tool-tip-text="name">
        <img :src="levelImgSrc" :title="name" :alt="name">
      </ToolTips>
    </div>

    <!-- Spark background -->
    <div
      v-if="level !== undefined && level >= 13"
      class="relative flex items-center justify-center"
    >
      <div
        class="absolute w-[24px] h-[24px]"
      >
        <ToolTips :tool-tip-text="name">
          <img :src="levelImgSrc" :title="name" :alt="name">
        </ToolTips>
      </div>
      <img :src="sparkImgSrc" :title="name" :alt="name">
    </div>

    <!-- Gem line -->
    <div :class="gemLineClasses" />
  </div>
</template>

<script>
const getLevelImg = require.context('./level/', false, /\.png$/);
const getSparkImg = require.context('./spark/', false, /\.png$/);

export default {
  props: {
    level: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: '',
    },
    colorClasses: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    gemLineClasses() {
      return [
        'absolute',
        'top-[50%]',
        'translate-y-[-50%]',
        'w-full',
        'h-[3px]',
        'z-[-1]',
        'bg-gradient-to-r',
        'from-transparent',
        'to-transparent',
      ].concat(this.colorClasses);
    },
    filename() {
      return `./${this.level >= 10 ? this.level : `0${this.level}`}.png`;
    },
    levelImgSrc() {
      return getLevelImg(this.filename);
    },
    sparkImgSrc() {
      return getSparkImg(this.filename);
    },
  },
};
</script>
