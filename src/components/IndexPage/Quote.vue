<template>
  <blockquote ref="root" class="text-[1rem]">
    <div class="flex gap-[1em]">
      <Quotemark class="shrink-0 w-[1.5em] laptop:w-[2em] rotate-180 self-start" />
      <p :class="['font-proxima font-[300]', isSmall ? 'text-[1.375rem]' : 'text-[1.875em]']">
        {{ text }}
      </p>
      <Quotemark class="shrink-0 w-[1.5em] laptop:w-[2em] self-end" />
    </div>
    <footer class="flex flex-col items-end mt-[1.5em] text-[1em] text-right">
      <IdentityAvatar
        v-if="authorAvatarSrc"
        :url="authorAvatarSrc"
        :size="64"
        :is-outline-extruded="true"
        :should-resize-image="false"
      />
      <div class="mt-[0.5rem] opacity-[0.6]">
        <cite>{{ author }}</cite>
        <div>{{ authorTitle }}</div>
      </div>
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
    authorAvatarSrc: {
      type: String,
      default: undefined,
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
