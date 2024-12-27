<template>
  <component :is="tag">
    <NFTBookSpecTableLabel
      :text="$t('nft_details_page_label_access_methods')"
    />
    <NFTBookSpecTableValue
      :text="value"
      :preset="preset"
      :tooltip-title="tooltipsContent.title"
      :tooltip-text="tooltipsContent.text"
      @clickTooltip="$emit('clickTooltip')"
    />
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
    preset: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    value() {
      return this.isDownloadable
        ? this.$t('nft_details_page_label_access_methods_downloadable')
        : this.$t('nft_details_page_label_access_methods_web_only');
    },
    tooltipsContent() {
      return this.isDownloadable
        ? {
            title: this.$t(
              'nft_details_page_label_access_methods_tooltips_title_drm_free'
            ),
            text: this.$t(
              'nft_details_page_label_access_methods_tooltip_text_drm_free'
            ),
          }
        : {
            title: this.$t(
              'nft_details_page_label_access_methods_tooltips_title_drm'
            ),
            text: this.$t(
              'nft_details_page_label_access_methods_tooltip_text_drm'
            ),
          };
    },
  },
};
</script>
