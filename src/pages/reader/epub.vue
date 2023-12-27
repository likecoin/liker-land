<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="grow" />
      <select
        v-model="selectedChapter"
        class="my-[10px] shadow-md rounded-4"
        @change="onChangeChapter"
      >
        <option
          v-for="chapter in toc"
          :key="chapter.href"
          :value="chapter.href"
        >
          {{ chapter.label }}
        </option>
      </select>
      <div class="flex grow justify-end mr-8 gap-4">
        <button class="my-[10px]" @click="onClickSearchButton">
          <IconSearch class="w-20 h-20" />
        </button>
        <div v-if="showSearch" class="flex items-center gap-4">
          <input
            ref="searchInput"
            v-model="searchText"
            class="w-[120px] my-[10px] shadow-md rounded-4"
            placeholder="Search for ..."
            @input="onInputSearch"
          />
          <button
            :disabled="!searchText"
            class="my-[10px]"
            @click="onClickClearSearch"
          >
            <IconClose class="w-20 h-20" />
          </button>
          <button
            :disabled="!searchResults.length"
            class="w-[20px] text-[30px]"
            @click="onClickGoToPrevSearchResult"
          >
            ‹
          </button>
          <button
            :disabled="!searchResults.length"
            class="w-[20px] text-[30px]"
            @click="onClickGoToNextSearchResult"
          >
            ›
          </button>
        </div>
        <button
          v-if="!hideDownload"
          class="my-[10px]"
          @click="onClickDownloadEpub"
        >
          <IconDownload class="w-20 h-20" />
        </button>
      </div>
    </div>
    <a
      class="left-0 laptop:left-10 fixed z-10 top-1/2 text-[64px] text-like-green font-bold cursor-pointer select-none no-underline"
      @click="onClickGoToPrevPage"
      >‹</a
    >
    <div
      id="viewer"
      class="mx-auto my-0 w-full h-dynamic laptop:w-[1200px] laptop:h-[700px] shadow-md rounded-4 p-0 relative"
    />
    <a
      class="right-0 laptop:right-10 fixed z-10 top-1/2 text-[64px] text-like-green font-bold cursor-pointer select-none no-underline"
      @click="onClickGoToNextPage"
      >›</a
    >
  </div>
</template>

<script>
import Epub, { EpubCFI } from 'epubjs';
import { saveAs } from 'file-saver';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

import { getDownloadFilenameFromURL } from '~/util/nft-book';

export default {
  name: 'EPUBReaderPage',
  mixins: [nftMixin, walletMixin],
  props: {
    fileSrc: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      toc: [],
      selectedChapter: '',
      book: null,
      rendition: null,
      showSearch: false,
      searchText: '',
      searchResults: [],
      searchResultIndex: 0,
    };
  },
  computed: {
    hideDownload() {
      return this.$route.query.download === '0' || this.nftIsDownloadHidden;
    },
  },
  mounted() {
    this.initRendition();
  },
  methods: {
    initRendition() {
      this.book = Epub(this.fileSrc);
      this.book.loaded.navigation.then(
        navigation => (this.toc = navigation.toc)
      );
      this.rendition = this.book.renderTo('viewer', {
        width: '100%',
        height: '100%',
        spread: 'always',
      });
      this.rendition.display();
      this.rendition.on('rendered', () => {
        this.selectedChapter = this.rendition.currentLocation().start.href;
      });

      const keyListener = e => {
        const inputs = ['input', 'select', 'button', 'textarea'];
        if (inputs.includes(document.activeElement?.tagName.toLowerCase())) {
          return;
        }

        // Left Key
        if ((e.keyCode || e.which) === 37) {
          this.rendition.prev();
        }
        // Right Key
        if ((e.keyCode || e.which) === 39) {
          this.rendition.next();
        }
      };
      this.rendition.on('keydown', keyListener);
      document.addEventListener('keydown', keyListener, false);
    },
    onChangeChapter() {
      this.rendition.display(this.selectedChapter);
    },
    onClickGoToPrevPage() {
      this.rendition.prev();
    },
    onClickGoToNextPage() {
      this.rendition.next();
    },
    async onClickDownloadEpub() {
      try {
        this.alertPromptSuccess(this.$t('nft_download_content_prepare'));
        const blob = await this.$axios.$get(this.fileSrc, {
          responseType: 'blob',
        });
        saveAs(blob, getDownloadFilenameFromURL(this.fileSrc));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        this.alertPromptError(this.$t('nft_download_content_error'));
      }
    },
    removeHighlight() {
      this.searchResults.forEach(result => {
        this.rendition.annotations.remove(result.cfi, 'highlight');
      });
    },
    async searchFromChapter(chapter) {
      try {
        await chapter.load(this.book.load.bind(this.book));
        const result = await chapter.find(this.searchText);
        return result;
      } finally {
        chapter.unload.bind(chapter)();
      }
    },
    async searchEntireBook() {
      if (this.searchText.length < 3) return [];
      const results = await Promise.all(
        this.book.spine.spineItems.map(this.searchFromChapter)
      );
      return results.flat().slice(0, 1000);
    },
    updateSearchResults(searchResults = []) {
      this.searchResults = searchResults;
      this.searchResults.forEach(result => {
        this.rendition.annotations.highlight(result.cfi);
      });
    },
    directToSelectedSearchResult() {
      if (!this.searchResults.length) return;
      const cfiString = this.searchResults[
        this.searchResultIndex
      ].cfi.toString();
      this.rendition.display(cfiString);
    },
    directToNextSearchResult() {
      if (!this.searchResults.length) return;
      this.searchResultIndex = 0;
      const currentLocation = this.rendition.currentLocation();
      const currStartCFI = new EpubCFI(currentLocation.start.cfi);
      const currEndCFI = new EpubCFI(currentLocation.end.cfi);
      for (let i = 0; i < this.searchResults.length; i += 1) {
        const cfi = new EpubCFI(this.searchResults[i].cfi);
        const compareStart = cfi.compare(cfi, currStartCFI);
        const compareEnd = cfi.compare(cfi, currEndCFI);
        if (compareStart >= 0) {
          if (compareEnd === -1) {
            this.searchResultIndex = i;
            break;
          } else if (compareEnd === 1 && this.searchResultIndex === 0) {
            this.searchResultIndex = i;
          }
        }
      }
      this.directToSelectedSearchResult();
    },
    async onClickSearchButton() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.removeHighlight();
      } else {
        const searchResults = await this.searchEntireBook();
        this.updateSearchResults(searchResults);
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
    async onInputSearch() {
      this.removeHighlight();
      const searchResults = await this.searchEntireBook();
      this.updateSearchResults(searchResults);
      this.directToNextSearchResult();
    },
    onClickGoToPrevSearchResult() {
      if (!this.searchResults.length) return;
      if (this.searchResultIndex > 0) {
        this.searchResultIndex -= 1;
      } else {
        this.searchResultIndex = this.searchResults.length - 1;
      }
      this.directToSelectedSearchResult();
    },
    onClickGoToNextSearchResult() {
      if (!this.searchResults.length) return;
      if (this.searchResultIndex < this.searchResults.length - 1) {
        this.searchResultIndex += 1;
      } else {
        this.searchResultIndex = 0;
      }
      this.directToSelectedSearchResult();
    },
    onClickClearSearch() {
      this.searchText = '';
      this.removeHighlight();
      this.searchResultIndex = 0;
    },
  },
};
</script>

<style>
.h-dynamic {
  height: calc(100vh - 64px);
}

@media (min-width: 769px) {
  #viewer:after {
    position: absolute;
    width: 1px;
    border-right: 1px #000 solid;
    height: 90%;
    z-index: 1;
    left: 50%;
    margin-left: -1px;
    top: 5%;
    opacity: 0.15;
    box-shadow: -2px 0 15px rgba(0, 0, 0, 1);
    content: '';
  }
}
</style>
