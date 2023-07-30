<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdown-container" v-html="markdownToHtml" />
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';

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
      const rawHtml = marked(this.mdString);
      return DOMPurify.sanitize(rawHtml);
    },
  },
};
</script>

<style>
/* Import the custom styles for Markdown rendering */
@import '@/assets/css/markdownStyle.css';
</style>
