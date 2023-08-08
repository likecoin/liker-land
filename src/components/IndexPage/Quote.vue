<template>
  <blockquote ref="root" class="text-[1rem]">
    <div class="flex gap-[1em]">
      <Quotemark class="shrink-0 w-[1.5em] laptop:w-[2em] rotate-180 self-start" />
      <p :class="['font-proxima font-[300]', isSmall ? 'text-[1.375rem]' : 'text-[1.875em]']">
        {{ text }}
      </p>
      <Quotemark class="shrink-0 w-[1.5em] laptop:w-[2em] self-end" />
    </div>
    <footer class="mt-[1.5em] text-[1em] text-right opacity-[0.6]">
      <cite>{{ author }}</cite>
      <div>{{ authorTitle }}</div>
    </footer>
  </blockquote>
</template>

<script>
import Quotemark from '~/assets/images/index/quotemark.svg?inline';

export default {
  name: 'IndexPageQuote',
  components: {
    Quotemark,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: '',
    },
    authorTitle: {
      type: String,
      default: '',
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
