<template>
  <component :is="tag">
    <NFTBookSpecTableLabel
      :text="$t('nft_details_page_label_access_methods')"
    />
    <div class="font-[600]">{{ label }}</div>
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'li',
    },
    isDownloadable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    label() {
      return this.isDownloadable
        ? this.$t('nft_details_page_label_access_methods_downloadable')
        : this.$t('nft_details_page_label_access_methods_web_only');
    },
  },
};
</script>
