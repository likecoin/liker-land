<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdown-container" v-html="markdownToHtml" />
</template>

<script>
import { marked } from 'marked';

export default {
  name: 'Markdown',
  props: {
    mdString: {
      type: String,
      default: '',
    },
  },
  computed: {
    markdownToHtml() {
      return marked(this.mdString);
    },
  },
};
</script>

<style>
/* Import the custom styles for Markdown rendering */
@import '@/assets/css/markdownStyle.css';
</style>
