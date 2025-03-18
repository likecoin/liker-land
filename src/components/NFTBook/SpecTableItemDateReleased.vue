<template>
  <component :is="tag">
    <NFTBookSpecTableLabel :text="label" />
    <NFTBookSpecTableValue :text="dateValue" :preset="preset" />
  </component>
</template>
<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'li',
    },
    date: {
      type: [String, Number],
      default: '',
    },
    isPublishedDate: {
      type: Boolean,
      default: false,
    },
    preset: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    label() {
      return this.isPublishedDate
        ? this.$t('nft_details_page_label_published_date')
        : this.$t('nft_details_page_label_released_date');
    },
    dateValue() {
      return new Date(this.date).toLocaleDateString();
    },
  },
};
</script>
