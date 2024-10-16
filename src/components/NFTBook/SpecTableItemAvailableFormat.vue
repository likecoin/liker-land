<template>
  <component :is="tag">
    <NFTBookSpecTableLabel :text="$t('nft_details_page_label_content_types')" />
    <NFTBookSpecTableValue :label="label" :is-campaign="isCampaign" />
  </component>
</template>
<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'li',
    },
    contentTypes: {
      type: Array,
      default: () => [],
    },
    isCampaign: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    label() {
      return this.contentTypes
        .map(type => this.getContentType(type))
        .join(' + ');
    },
  },
  methods: {
    getContentType(type) {
      switch (type) {
        case 'epub':
          return this.$t('nft_details_page_button_type_epub');
        case 'pdf':
          return this.$t('nft_details_page_button_type_pdf');
        case 'nft':
          return this.$t('nft_details_page_button_type_nft');
        case 'collection':
          return this.$t('nft_details_page_button_type_collection');
        default:
          return this.$t('nft_details_page_button_type_other');
      }
    },
  },
};
</script>
