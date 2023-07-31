<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdown-container" v-html="markdownToHtml" />
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { escapeHtml, unescapeHtml } from '@/util/misc';

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
      const text = escapeHtml(unescapeHtml(this.mdString));
      const rawHtml = marked(text);
      return DOMPurify.sanitize(rawHtml);
    },
  },
};
</script>

<style>
/* Import the custom styles for Markdown rendering */
@import '@/assets/css/markdownStyle.css';
</style>
