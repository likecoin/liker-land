<template>
  <div :class="['relative', 'flex', 'flex-col', 'gap-[24px]', 'max-w-[220px]']">
    <img class="shadow-2xl" :src="imgSrc" :alt="title" />
    <div
      :class="[
        'absolute',
        'flex',
        'flex-col',
        'justify-start',
        'gap-[12px]',
        'translate-y-[100%]',
        'bottom-[-24px]',
      ]"
    >
      <Label align="left" preset="h4" :text="title" />
      <Label :class="['text-[14px]', 'text-medium-gray']" :text="author" />
      <div :class="['flex']">
        <GutenbergButton
          :class="['w-min', 'mt-[8px]']"
          :text="$t('gutenberg_download')"
          @click="handleDownload"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bookInfo: {
      type: Object,
      default: null,
    },
  },
  computed: {
    imgSrc() {
      return this.bookInfo?.imgSrc || '';
    },
    title() {
      return this.bookInfo?.title || '';
    },
    author() {
      return this.bookInfo?.author || '';
    },
  },
  methods: {
    handleDownload() {
      this.$emit('download', this.book.classId);
    },
  },
};
</script>
