<template>
  <div>
    <div
      v-if="isLoading"
      class="fixed inset-0 flex flex-col justify-center items-center gap-[16px] bg-white"
    >
      <ProgressIndicator
        :type="progressIndicatorType"
        :value="progressPercent"
      />
      <span class="text-like-green text-center">{{ progressLabelText }}</span>
    </div>
    <div v-else class="flex items-center justify-between">
      <div class="grow" />
      <select
        v-if="toc.length"
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
      <div class="flex justify-end gap-4 mr-8 grow">
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
      ref="epubViewer"
      :key="cacheKey"
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
import { logTrackerEvent } from '~/util/EventLogger';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import readerMixin from '~/mixins/reader';

import { getDownloadFilenameFromURL } from '~/util/nft-book';

export default {
  name: 'EPUBReaderPage',
  mixins: [nftMixin, walletMixin, readerMixin],
  data() {
    return {
      isLoading: false,
      toc: [],
      dirPath: '',
      selectedChapter: '',
      book: null,
      rendition: null,
      contents: null,
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
  beforeUnmount() {
    if (this.rendition) {
      this.rendition.destroy();
      this.rendition = null;
    }
    if (this.book) {
      this.book.destroy();
      this.book = null;
    }
    document.removeEventListener('keydown', this.keyListener);
  },
  mounted() {
    this.initRendition();
    document.addEventListener('keydown', this.keyListener, false);
  },
  methods: {
    async initRendition() {
      try {
        this.isLoading = true;
        const buffer = await this.getFileBuffer('reader-epub');
        if (this.book) return;
        this.book = Epub(buffer);
        await this.book.ready;
        this.isLoading = false;
        this.book.loaded.navigation.then(
          navigation => (this.toc = navigation.toc)
        );
        const viewerEl = this.$refs.epubViewer;
        if (!viewerEl) return;
        if (this.rendition) return;
        this.rendition = this.book.renderTo(viewerEl, {
          width: '100%',
          height: '100%',
          spread: 'always',
        });
        const cfi = this.resumeFromLocalStorage();
        this.rendition.display(cfi);
        this.rendition.on('rendered', (cfiRange, contents) => {
          const path = this.rendition.currentLocation().start.href;
          const pathArr = path.split('/');
          this.selectedChapter = pathArr.pop();
          this.dirPath = pathArr.join('/');
          this.contents = contents;
        });

        this.rendition.on('relocated', location => {
          this.saveToLocalStorage(location.start.cfi);
        });
        this.rendition.on('keydown', this.keyListener);
      } catch (err) {
        const errData = err.response || err;
        const errMessage = errData.data || errData.message || errData;
        console.error(errMessage); // eslint-disable-line no-console
        logTrackerEvent(this, 'ReaderEpub', 'ReaderEpubError', errMessage, 1);
        this.$router.replace(
          this.localeLocation({
            name: 'nft-class-classId',
            params: { classId: this.classId },
          })
        );
      }
    },
    keyListener(e) {
      const inputs = ['input', 'select', 'button', 'textarea'];
      if (inputs.includes(document.activeElement?.tagName.toLowerCase())) {
        return;
      }

      if (!this.rendition) return;
      // Left Key
      if ((e.keyCode || e.which) === 37) {
        this.rendition.prev();
      }
      // Right Key
      if ((e.keyCode || e.which) === 39) {
        this.rendition.next();
      }
    },
    onChangeChapter() {
      const chapter = this.dirPath
        ? `${this.dirPath}/${this.selectedChapter}`
        : this.selectedChapter;
      this.rendition.display(chapter);
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
        const buffer = await this.getFileBuffer('reader-epub');
        saveAs(
          new Blob([buffer], {
            type: 'application/epub+zip',
          }),
          getDownloadFilenameFromURL(this.fileSrc)
        );
      } catch (error) {
        if (error.message === 'Network Error') {
          // bypass CORS
          window.open(this.fileSrc);
        } else {
          // eslint-disable-next-line no-console
          console.error(error);
          this.alertPromptError(this.$t('nft_download_content_error'));
        }
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
    saveToLocalStorage(currentCfi) {
      if (window.localStorage && currentCfi) {
        window.localStorage.setItem(
          `epub-reader-${this.cacheKey}`,
          JSON.stringify({ currentCfi: currentCfi.toString() })
        );
      }
    },
    resumeFromLocalStorage() {
      if (window.localStorage) {
        const epubData = window.localStorage.getItem(
          `epub-reader-${this.cacheKey}`
        );
        if (epubData) {
          try {
            const { currentCfi } = JSON.parse(epubData);
            return currentCfi;
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }
      }
      return undefined;
    },
    async directToSelectedSearchResult() {
      if (!this.searchResults.length) return;
      const cfiString = this.searchResults[
        this.searchResultIndex
      ].cfi.toString();
      await this.rendition.display(cfiString);
      const range = this.rendition.getRange(cfiString);
      const selection = this.contents.window.getSelection();
      // TODO: selection is null when the page is not rendered (e.g. change chapter)
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
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
