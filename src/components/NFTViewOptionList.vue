<template>
  <div>
    <ButtonV2
      v-if="url && shouldShowViewContentButton"
      class="w-full"
      preset="outline"
      :text="
        $t(
          isNftBook
            ? 'nft_details_page_button_view_nft_book'
            : 'nft_details_page_button_view'
        )
      "
      :href="url"
      rel="noopener ugc"
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
      v-if="normalizedContentURLs.length && !isContentViewable"
      class="text-[14px] text-medium-gray text-center mt-[16px]"
    >
      {{
        $t(
          isNftBook
            ? 'nft_details_page_button_collect_to_view_nft_book'
            : 'nft_details_page_button_collect_to_view'
        )
      }}
    </p>

    <template v-if="contentUrls.length && shouldShowContentUrlButtons">
      <Dropdown>
        <template #trigger="{ toggle }">
          <ButtonV2
            class="w-full"
            preset="outline"
            :is-disabled="!isContentViewable"
            @click="
              e => {
                e.preventDefault();
                toggle();
              }
            "
          >
            <template #prepend>
              <IconDownload class="w-20 h-20" />
            </template>
            <template #default>{{
              $t(
                isNftBook
                  ? 'nft_details_page_download_nft_book_button'
                  : 'nft_details_page_download_button'
              )
            }}</template>
            <template #append>
              <IconArrowDown class="w-16 h-16" />
            </template>
          </ButtonV2>
        </template>
        <MenuList>
          <ul>
            <li
              v-for="(contentUrl, index) in normalizedContentURLs"
              :key="contentUrl"
            >
              <ButtonV2
                preset="plain"
                :download="getDownloadFilenameFromURL(contentUrl)"
                @click="e => handleClickViewContentURL(e, contentUrl, index)"
                >{{
                  getFilenameFromURL(contentUrl) ||
                    getContentUrlButtonText(contentUrl)
                }}&nbsp;<IconLinkExternal
              /></ButtonV2>
            </li>
          </ul>
        </MenuList>
      </Dropdown>
    </template>
  </div>
</template>

<script>
import alertMixin from '~/mixins/alert';

import { parseNFTMetadataURL } from '~/util/nft';
import {
  getFilenameFromURL,
  getDownloadFilenameFromURL,
} from '~/util/nft-book';

export default {
  name: 'NFTViewOptionList',
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
    nftId: {
      type: String,
      default: '',
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
    shouldShowViewContentButton() {
      return !!this.normalizedContentURLs.includes(this.url);
    },
  },
  methods: {
    parseNFTMetadataURL,
    getContentUrlType(url) {
      if (url?.includes('epub')) return 'epub';
      if (url?.includes('pdf')) return 'pdf';
      return undefined;
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
    handleClickViewContent() {
      this.$emit('view-content');
    },
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
              nftId: this.nftId,
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
