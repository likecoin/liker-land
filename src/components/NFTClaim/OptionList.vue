<template>
  <Dropdown
    :content-classes="[
      'absolute',
      'right-0',
      'bottom-full',
      'laptop:top-full',

      'mb-[8px]',
      'laptop:my-[8px]',
      'z-10',
    ]"
  >
    <template #trigger="{ toggle }">
      <ButtonV2
        class="w-full"
        preset="tertiary"
        :is-disabled="!isContentViewable"
        @click="toggle"
      >
        <template #default>{{ $t('nft_claim_claimed_download') }}</template>
      </ButtonV2>
    </template>
    <MenuList :has-padding="false">
      <ul>
        <li
          v-for="(contentUrl, index) in normalizedContentURLs"
          :key="contentUrl?.url || contentUrl"
        >
          <ButtonV2
            preset="plain"
            :download="contentUrl.name || 'content'"
            @click="e => handleClickViewContentURL(e, contentUrl, index)"
          >
            {{ contentUrl.name }}&nbsp;<IconLinkExternal />
          </ButtonV2>
        </li>
      </ul>
    </MenuList>
  </Dropdown>
</template>

<script>
import alertMixin from '~/mixins/alert';

import { getContentUrlType } from '~/util/misc';
import { parseNFTMetadataURL } from '~/util/nft';
import { getFilenameFromURL } from '~/util/nft-book';

export default {
  name: 'NFTClaimOptionList',
  mixins: [alertMixin],
  props: {
    classId: {
      type: String,
      default: undefined,
    },
    contentUrls: {
      type: Array,
      default: () => [],
    },
    externalUrl: {
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
    getContentUrlButtonText(url) {
      const type = getContentUrlType(url);
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
