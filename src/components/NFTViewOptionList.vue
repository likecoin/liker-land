<template>
  <div v-if="shouldShowContentUrlButtons" class="flex flex-col gap-[8px]">
    <ButtonV2
      v-if="externalUrl"
      class="w-full"
      preset="outline"
      :text="
        $t(
          isNftBook
            ? 'nft_details_page_button_view_nft_book'
            : 'nft_details_page_button_view'
        )
      "
      :href="externalUrl"
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

    <ButtonV2
      v-if="contentUrls.length === 1"
      class="w-full"
      :text="
        $t(
          isNftBook
            ? 'nft_details_page_download_nft_book_button'
            : 'nft_details_page_download_button'
        )
      "
      preset="outline"
      :is-disabled="!isContentViewable"
      @click="
        e => {
          handleClickViewContentURL(e, contentUrls[0], 0);
          e.preventDefault();
        }
      "
    >
      <template #prepend>
        <IconBook class="w-20 h-20" />
      </template>
      <!-- HACK: Append an empty icon to keep the button width consistent -->
      <template #append>
        <IconArrowDown class="w-16 h-16 opacity-[0]" />
      </template>
    </ButtonV2>

    <template v-else-if="contentUrls.length > 1">
      <Dropdown class="hidden w-full laptop:block" direction="center">
        <template #trigger>
          <ButtonV2
            class="w-full"
            :text="
              $t(
                isNftBook
                  ? 'nft_details_page_download_nft_book_button'
                  : 'nft_details_page_download_button'
              )
            "
            preset="outline"
            :is-disabled="!isContentViewable"
            @click="e => e.preventDefault()"
          >
            <template #prepend>
              <IconBook class="w-20 h-20" />
            </template>
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
                class="w-full"
                preset="plain"
                :text="
                  getFilenameFromURL(contentUrl) ||
                    getContentUrlButtonText(contentUrl)
                "
                :download="getDownloadFilenameFromURL(contentUrl)"
                @click="e => handleClickViewContentURL(e, contentUrl, index)"
              >
                <template #append>
                  <IconLinkExternal class="flex-shrink-0" />
                </template>
              </ButtonV2>
            </li>
          </ul>
        </MenuList>
      </Dropdown>
      <ButtonV2
        class="w-full laptop:hidden"
        :text="
          $t(
            isNftBook
              ? 'nft_details_page_download_nft_book_button'
              : 'nft_details_page_download_button'
          )
        "
        preset="outline"
        :is-disabled="!isContentViewable"
        @click.prevent="handleOpenOptionListForMobile"
      >
        <template #prepend>
          <IconBook class="w-20 h-20" />
        </template>
        <template #append>
          <IconArrowDown class="w-16 h-16" />
        </template>
      </ButtonV2>
      <NFTClaimOptionListForMobile
        v-if="isShowingOptionListForMobile"
        class="w-full"
        :class-id="classId"
        :content-urls="contentUrls"
        :external-url="externalUrl"
        :is-nft-book="isNftBook"
        :is-content-viewable="isContentViewable"
        @view-content-url="
          (e, url, type) => $emit('view-content-url', e, url, type)
        "
        @close="handleCloseOptionListForMobile"
      />
    </template>
  </div>
</template>

<script>
import alertMixin from '~/mixins/alert';

import { getContentUrlType } from '~/util/misc';
import { parseNFTMetadataURL } from '~/util/nft';
import {
  getFilenameFromURL,
  getDownloadFilenameFromURL,
} from '~/util/nft-book';

export default {
  name: 'NFTViewOptionList',
  mixins: [alertMixin],
  props: {
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
  data() {
    return { isShowingOptionListForMobile: false };
  },
  computed: {
    normalizedContentURLs() {
      // NOTE: Assuming if only `url` is set, it must contain the actual content rather than the book info
      return this.contentUrls.length ? this.contentUrls : [this.externalUrl];
    },
    shouldShowViewContentButton() {
      return !!this.normalizedContentURLs.includes(this.externalUrl);
    },
  },
  methods: {
    parseNFTMetadataURL,
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
    getFilenameFromURL,
    getDownloadFilenameFromURL,
    handleClickViewContent(e) {
      e.stopPropagation();
      this.$emit('view-content');
    },
    handleClickViewContentURL(e, contentUrl, index) {
      const type = getContentUrlType(contentUrl);
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
    handleOpenOptionListForMobile() {
      this.isShowingOptionListForMobile = true;
      document.body.style.overflow = 'hidden';
    },
    handleCloseOptionListForMobile() {
      this.isShowingOptionListForMobile = false;
      document.body.style.overflow = '';
    },
  },
};
</script>
