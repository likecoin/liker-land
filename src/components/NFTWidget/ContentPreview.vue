<template>
  <div class="flex flex-col overflow-hidden rounded-[8px] bg-gray-f7">
    <div
      v-if="imgSrc"
      class="grow bg-gray-9b"
    >
      <img class="block object-contain" :src="imgSrc" :alt="title">
    </div>
    <div class="p-[16px] shrink-0">
      <div class="text-[16px] leading-[1.25] font-[600]">{{ title }}</div>
      <div class="text-[16px] leading-[1.25] font-[400] mt-[4px]">
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgSrc: {
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
  },
};
</script>
