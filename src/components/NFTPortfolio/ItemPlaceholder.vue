<template>
  <div class="bg-white rounded-[24px] overflow-hidden">
    <div :class="coverClass" />
    <div class="relative pt-[0] p-[24px] flex flex-col items-center">
      <div class="top-[-20px] w-[48px] h-[48px] mx-auto -mt-[20px] bg-white rounded-full p-[2px]">
        <div :class="creatorAvatarClass" />
      </div>
      <div :class="creatorDisplayNameClass" />
      <div :class="titleLine1Class" />
      <div :class="titleLine2Class" />
      <div :class="buttonClass" />
      <div :class="statsClass" />
    </div>
  </div>
</template>

<script>
function pickRandomItemFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default {
  name: 'NFTPortfolioItemPlaceholder',
  computed: {
    baseClass() {
      return ['bg-shade-gray', 'animate-pulse'];
    },
    coverClass() {
      return [
        this.baseClass,
        pickRandomItemFromArray(['h-[180px]', 'h-[240px]', 'h-[300px]']),
      ];
    },
    textClass() {
      return [this.baseClass, 'rounded-full'];
    },
    creatorAvatarClass() {
      return [this.baseClass, 'rounded-full', 'w-full', 'h-full'];
    },
    creatorDisplayNameClass() {
      return [
        this.textClass,
        'h-[14px]',
        'mt-[4px]',
        pickRandomItemFromArray(['w-[35%]', 'w-[40%]', 'w-[45%]']),
      ];
    },
    titleLine1Class() {
      return [this.textClass, 'h-[16px]', 'mt-[16px]', 'w-[80%]'];
    },
    titleLine2Class() {
      return [
        this.textClass,
        'h-[16px]',
        'mt-[8px]',
        pickRandomItemFromArray(['w-[50%]', 'w-[60%]', 'w-[70%]']),
      ];
    },
    buttonClass() {
      return [
        this.baseClass,
        'h-[44px]',
        'rounded-[8px]',
        'w-[100px]',
        'mt-[16px]',
      ];
    },
    statsClass() {
      return [this.textClass, 'h-[14px]', 'w-[140px]', 'mt-[16px]'];
    },
  },
};
</script>
