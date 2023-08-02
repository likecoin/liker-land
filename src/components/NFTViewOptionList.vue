<template>
  <div>
    <ButtonV2
      v-if="url"
      class="w-full"
      preset="outline"
      :text="$t(isNftBook ? 'nft_details_page_button_view_nft_book' : 'nft_details_page_button_view')"
      :href="url"
      target="_blank"
      @click="handleClickViewContent"
    >
      <template #prepend>
        <IconArticle />
      </template>
      <template #append>
        <IconLinkExternal />
      </template>
    </ButtonV2>

    <p
      v-if="contentUrls.length && !isContentViewable"
      class="text-[14px] text-medium-gray text-center mt-[16px]"
    >{{ $t('nft_details_page_button_collect_to_view') }}</p>

    <template v-if="shouldShowContentUrlButtons">
      <ButtonV2
        v-for="contentUrl in contentUrls"
        :key="contentUrl"
        class="mt-[12px] w-full"
        preset="outline"
        :text="getContentUrlButtonText(contentUrl)"
        :href="contentUrl"
        :is-disabled="!isContentViewable"
        target="_blank"
        @click="e => handleClickViewContentURL(e, contentUrl)"
      >
        <template #prepend>
          <IconArticle />
        </template>
        <template #append>
          <IconLinkExternal />
        </template>
      </ButtonV2>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: undefined,
    },
    contentUrls: {
      type: Array,
      default: () => [],
    },
    iscnUrl: {
      type: String,
      default: undefined,
    },
    isNftBook: {
      type: Boolean,
      default: false,
    },
    isContentViewable: {
      type: Boolean,
      default: true,
    },
    shouldShowContentUrlButtons: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    getContentUrlType(url) {
      if (url.includes('epub')) return 'epub';
      if (url.includes('pdf')) return 'pdf';
      return 'unknown';
    },
    getContentUrlButtonText(url) {
      const type = this.getContentUrlType(url);
      switch (type) {
        case 'epub':
          return this.$t('nft_details_page_button_view_epub');
        case 'pdf':
          return this.$t('nft_details_page_button_view_pdf');
        default:
          return this.$t('nft_details_page_button_view_unknown');
      }
    },
    handleClickViewContent() {
      this.$emit('view-content');
    },
    handleClickViewContentURL(e, contentUrl) {
      const type = this.getContentUrlType(contentUrl);
      this.$emit('view-content-url', e, contentUrl, type);
    },
  },
};
</script>
