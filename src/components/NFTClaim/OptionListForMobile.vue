<template>
  <div class="fixed inset-0 z-50 bg-black bg-opacity-[30%]">
    <div
      class="fixed left-0 bottom-0 flex flex-col items-center gap-[8px] w-full bg-white pt-[12px] pb-[28px]"
    >
      <div class="flex justify-between items-center w-full pl-[16px] pr-[8px]">
        <div v-text="$t('nft_claim_option_list_title')" />
        <ButtonV2 preset="plain" @click.prevent="close">
          <IconClose class="w-[20px]" />
        </ButtonV2>
      </div>
      <div class="w-full h-[1px] bg-medium-gray" />
      <MenuList :has-padding="false" class="w-full border-0 px-[8px]">
        <ul>
          <li
            v-for="(contentUrl, index) in normalizedContentURLs"
            :key="contentUrl"
          >
            <ButtonV2
              class="w-full"
              preset="plain"
              :download="contentUrl.name || 'content'"
              @click="e => handleClickViewContentURL(e, contentUrl, index)"
              >{{ contentUrl.name }}&nbsp;<IconLinkExternal />
            </ButtonV2>
          </li>
        </ul>
      </MenuList>
    </div>
  </div>
</template>

<script>
import { getContentUrlType } from '~/util/misc';
import { parseNFTMetadataURL } from '~/util/nft';
import { getFilenameFromURL } from '~/util/nft-book';

export default {
  name: 'NFTClaimOptionListForMobile',
  props: {
    externalUrl: {
      type: String,
      default: undefined,
    },
    classId: {
      type: String,
      default: undefined,
    },
    contentUrls: {
      type: Array,
      default: () => [],
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
    isContentDownloadable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    normalizedContentURLs() {
      // NOTE: Assuming if only `externalUrl` is set, it must contain the actual content rather than the book info
      const urls = this.contentUrls.length
        ? this.contentUrls
        : [this.externalUrl].map(url => ({
            url: parseNFTMetadataURL(url),
            name: getFilenameFromURL(url) || this.getContentUrlButtonText(url),
            type: getContentUrlType(url),
          }));
      return urls;
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    getContentUrlButtonText({ type }) {
      switch (type) {
        case 'epub':
          return this.$t('nft_details_page_button_view_epub');
        case 'pdf':
          return this.$t('nft_details_page_button_view_pdf');
        default:
          return this.$t('nft_details_page_button_view_unknown');
      }
    },
    handleClickViewContentURL(e, contentUrl, index) {
      const { type, url } = contentUrl;
      this.$emit('view-content-url', e, url, type);
      if (['pdf', 'epub'].includes(type)) {
        e.preventDefault();
        this.$router.push(
          this.localeLocation({
            name: `reader-${type}`,
            query: {
              download: this.isContentDownloadable ? '1' : '0',
              classId: this.classId,
              format: type,
              index,
            },
          })
        );
      }
    },
  },
};
</script>
