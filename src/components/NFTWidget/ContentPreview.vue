<template>
  <component
    :is="tag"
    class="flex flex-col overflow-hidden rounded-[8px] bg-gray-f7"
    v-bind="$attrs"
    @click="handleClick"
  >
    <NFTCover
      v-if="imgSrc"
      class="grow"
      :src="imgSrc"
      :size="450"
      :is-fixed-height="isFixedHeight"
      :alt="title"
    />
    <div class="p-[16px] shrink-0">
      <div
        :class="[
          'text-[16px]',
          'leading-[1.25]',
          'font-[600]',
          isFixedHeight ? 'line-clamp-1' : 'line-clamp-2',
        ]"
      >{{ title }}</div>
      <div
        :class="[
          'text-[16px]',
          'leading-[1.25]',
          'font-[400]',
          'mt-[4px]',
          isFixedHeight ? 'line-clamp-1' : 'line-clamp-4',
        ]"
      >{{ description }}</div>
    </div>
  </component>
</template>

<script>
export default {
  props: {
    imgSrc: {
      type: String,
      default: undefined,
    },
    imgBgColor: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'div',
    },
    isFixedHeight: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>
