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
      <template v-if="hasDuplicatedContentTypes">
        <Dropdown>
          <template #trigger="{ toggle }">
            <ButtonV2
              class="w-full"
              preset="outline"
              :is-disabled="!isContentViewable"
              @click="toggle"
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
              <li v-for="contentUrl in normalizedContentURLs" :key="contentUrl">
                <ButtonV2
                  :href="parseNFTMetadataURL(contentUrl)"
                  preset="plain"
                  :download="getDownloadFilenameFromURL(contentUrl)"
                  @click="e => handleClickViewContentURL(e, contentUrl)"
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
      <template v-else>
        <ButtonV2
          v-for="contentUrl in normalizedContentURLs"
          :key="contentUrl"
          class="mt-[12px] w-full"
          preset="outline"
          :text="getContentUrlButtonText(contentUrl)"
          :href="parseNFTMetadataURL(contentUrl)"
          :is-disabled="!isContentViewable"
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
    </template>
  </div>
</template>

<script>
import querystring from 'querystring';
import { saveAs } from 'file-saver';

import alertMixin from '~/mixins/alert';

import { parseNFTMetadataURL } from '~/util/nft';

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
    hasDuplicatedContentTypes() {
      const set = new Set(
        this.normalizedContentURLs.map(
          url => url === this.getContentUrlType(url)
        )
      );
      return set.size !== this.normalizedContentURLs.length;
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
    getFilenameFromURL(url) {
      const qsStr = url.split('?').pop();
      const qs = querystring.parse(qsStr);
      return qs?.name || '';
    },
    getDownloadFilenameFromURL(url) {
      return `${this.getFilenameFromURL(url) || 'content'}`;
    },
    handleClickViewContent() {
      this.$emit('view-content');
    },
    async handleClickViewContentURL(e, contentUrl) {
      const type = this.getContentUrlType(contentUrl);
      const url = parseNFTMetadataURL(contentUrl);
      this.$emit('view-content-url', e, url, type);
      if (type === 'pdf') {
        e.preventDefault();
        this.$router.push(
          this.localeLocation({
            name: 'reader',
            query: {
              download: this.isContentDownloadable ? '1' : '0',
              classId: this.classId,
              format: type,
              src: url,
            },
          })
        );
      } else if (type === 'epub') {
        e.preventDefault();
        // NOTE: Allow user to download epub file before we have web epub reader
        try {
          this.alertPromptSuccess(this.$t('nft_download_content_prepare'));
          const blob = await this.$axios.$get(url, { responseType: 'blob' });
          saveAs(blob, this.getDownloadFilenameFromURL(contentUrl));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
          this.alertPromptError(this.$t('nft_download_content_error'));
        }
      }
    },
  },
};
</script>
