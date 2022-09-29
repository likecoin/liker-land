<template>
  <div class="relative flex items-center justify-center mx-auto">
    <!-- Square gem -->
    <div
      v-if="level && level < 13"
      class="w-[24px] h-[24px]"
    >
      <img :src="levelImgSrc" :alt="`Level ${level}`">
    </div>

    <!-- Spark background -->
    <div
      v-if="level && level >= 13"
      class="relative flex items-center justify-center"
    >
      <div
        class="absolute w-[24px] h-[24px]"
      >
        <img :src="levelImgSrc" :alt="`Level ${level}`">
      </div>
      <img :src="sparkImgSrc" :alt="`Level ${level}`">
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
      default: undefined,
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
      ].concat(this.gemColorClasses);
    },
    gemColorClasses() {
      switch (true) {
        case this.level <= 3:
          return ['hidden'];

        case this.level <= 5:
          return ['via-[#D0D0D0]'];

        case this.level <= 7:
          return ['via-[#50E3C2]'];

        case this.level <= 9:
          return ['via-[#6CCAFF]'];

        case this.level <= 11:
          return ['via-[#FDAFFF]'];

        case this.level <= 13:
          return ['via-[#FFD748]'];

        case this.level === 14:
          return ['via-[#FF6464]'];

        case this.level === 15:
          return ['via-[#C0E1FF]'];

        default:
          return [];
      }
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
