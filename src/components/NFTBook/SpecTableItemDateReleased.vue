<template>
  <component :is="tag">
    <NFTBookSpecTableLabel :text="label" />
    <NFTBookSpecTableValue :label="date" :is-campaign="isCampaign" />
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
      type: String,
      default: '',
    },
    isPublishedDate: {
      type: Boolean,
      default: false,
    },
    isCampaign: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    label() {
      return this.isPublishedDate
        ? this.$t('nft_details_page_label_published_date')
        : this.$t('nft_details_page_label_released_date');
    },
  },
};
</script>
