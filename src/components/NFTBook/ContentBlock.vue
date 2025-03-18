<template>
  <div class="text-dark-gray">
    <h4 class="text-16 font-600 mb-[6px]" v-text="title" />
    <p class="text-14 whitespace-pre-line" v-text="content" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: undefined,
    },
    content: {
      type: String,
      default: undefined,
    },
  },
};
</script>
