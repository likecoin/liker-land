<template>
  <Dropdown
    :content-classes="[
      'absolute',
      'right-0',
      'bottom-full',
      'mt-[8px]',
      'z-10',
    ]"
  >
    <template #trigger="{ toggle }">
      <ButtonV2
        class="w-full underline text-medium-gray"
        preset="plain"
        :is-disabled="!isContentViewable"
        @click="toggle"
      >
        <template #default>{{ $t('nft_claim_claimed_download') }}</template>
      </ButtonV2>
    </template>
    <MenuList>
      <ul>
        <li
          v-for="(contentUrl, index) in normalizedContentURLs"
          :key="contentUrl"
        >
          <ButtonV2
            :href="parseNFTMetadataURL(contentUrl)"
            preset="plain"
            :download="getDownloadFilenameFromURL(contentUrl)"
            @click="e => handleClickViewContentURL(e, contentUrl, index)"
          >
            {{
              getFilenameFromURL(contentUrl) ||
                getContentUrlButtonText(contentUrl)
            }}&nbsp;<IconLinkExternal />
          </ButtonV2>
        </li>
      </ul>
    </MenuList>
  </Dropdown>
</template>

<script>
import alertMixin from '~/mixins/alert';

import { parseNFTMetadataURL } from '~/util/nft';
import {
  getFilenameFromURL,
  getDownloadFilenameFromURL,
} from '~/util/nft-book';

export default {
  name: 'NFTClaimOptionList',
  mixins: [alertMixin],
  props: {
    url: {
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
    isContentDownloadable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    normalizedContentURLs() {
      // NOTE: Assuming if only `url` is set, it must contain the actual content rather than the book info
      return this.contentUrls.length ? this.contentUrls : [this.url];
    },
  },
  methods: {
    parseNFTMetadataURL,
    getContentUrlType(url) {
      if (url?.includes('epub')) return 'epub';
      if (url?.includes('pdf')) return 'pdf';
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
    getFilenameFromURL,
    getDownloadFilenameFromURL,
    handleClickViewContentURL(e, contentUrl, index) {
      const type = this.getContentUrlType(contentUrl);
      const url = parseNFTMetadataURL(contentUrl);
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
