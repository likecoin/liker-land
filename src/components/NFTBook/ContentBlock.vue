<template>
  <div class="flex flex-col">
    <h4 :class="['text-[18px]', 'font-600']" v-text="title" />
    <p :class="['whitespace-pre-line']" v-text="content" />
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
