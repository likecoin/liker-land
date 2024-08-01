<template>
  <div class="fixed inset-0 flex flex-col">
    <header class="border-b border-[#ccc]">
      <div class="flex items-center justify-between px-[16px] py-[8px]">
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="
              localeLocation({
                name: 'feed',
                query: {
                  view: 'collectibles',
                  tab: 'collected',
                  type: 'nft_book',
                },
              })
            "
            :alt="$t('main_menu_my_portfolio')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-20"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </NuxtLink>

          <div class="relative">
            <ButtonV2 preset="outline" size="tiny">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-20"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </ButtonV2>
            <select
              v-if="toc.length"
              v-model="selectedChapter"
              class="absolute inset-0 opacity-0"
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
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button @click="handleSearchButtonClick">
            <IconSearch class="w-20 h-20" />
          </button>

          <button v-if="!hideDownload" @click="onClickDownloadEpub">
            <IconDownload class="w-20 h-20" />
          </button>
        </div>
      </div>

      {{ /* Search Bar */ }}
      <div
        v-if="isShowSearchBar"
        class="flex items-center gap-4 px-[16px] py-[8px] bg-gray-f7 border-t border-[#ccc]"
      >
        <input
          ref="searchInput"
          v-model="searchText"
          class="grow shadow-sm rounded-4 px-[8px] border border-[#ccc]"
          placeholder="Search for ..."
          @input="handleSearchInput"
        />

        <span v-if="searchResults.length"
          >{{ selectedSearchResultIndex + 1 }}/{{ searchResults.length }}</span
        >

        <button
          :disabled="!searchResults.length"
          :class="{ 'opacity-[0.2]': !searchResults.length }"
          @click="handlePrevSearchResultButtonClick"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="w-[20px]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <button
          :disabled="!searchResults.length"
          :class="{ 'opacity-[0.2]': !searchResults.length }"
          @click="handleNextSearchResultButtonClick"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="w-[20px]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        <button @click="handleClearSearchInputButtonClick">
          <IconClose class="w-20 h-20" />
        </button>
      </div>
    </header>

    <main class="relative grow bg-gray-f7">
      <div class="absolute inset-0 laptop:inset-[24px] laptop:inset-x-[32px]">
        <div
          id="viewer"
          ref="epubViewer"
          :key="cacheKey"
          :class="[
            'relative',

            'w-full',
            'h-full',
            'max-w-[1200px]',
            'mx-auto',
            'my-0',

            'bg-white',
            'shadow-lg',
            'rounded-[8px]',
          ]"
        />
      </div>

      <div
        :class="[
          'absolute',
          'inset-0',

          'flex',
          'justify-center',
          'items-stretch',

          'text-[64px]',
          'text-like-green',
          'font-bold',
          'no-underline',

          'pointer-events-none',
        ]"
      >
        <button
          class="flex items-center cursor-pointer select-none pointer-events-auto laptop:p-[8px]"
          @click="onClickGoToPrevPage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="4"
            stroke="currentColor"
            class="w-[20px] laptop:w-[24px]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div class="grow max-w-[1200px]" />
        <button
          class="flex items-center cursor-pointer select-none pointer-events-auto laptop:p-[8px]"
          @click="onClickGoToNextPage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="4"
            stroke="currentColor"
            class="w-[20px] laptop:w-[24px]"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </main>

    <div
      v-if="isLoading"
      class="z-[10] fixed inset-0 flex flex-col justify-center items-center gap-[16px] bg-white"
    >
      <ProgressIndicator
        :type="progressIndicatorType"
        :value="progressPercent"
      />
      <span class="text-like-green text-center">{{ progressLabelText }}</span>
    </div>
  </div>
</template>

<script>
import Epub, { EpubCFI } from 'epubjs';
import { saveAs } from 'file-saver';
import debounce from 'lodash.debounce';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import readerMixin from '~/mixins/reader';

import { logTrackerEvent } from '~/util/EventLogger';
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

      isShowSearchBar: false,
      searchText: '',
      searchResults: [], // Store CFI string of search results
      selectedSearchResultIndex: 0,
    };
  },
  computed: {
    hideDownload() {
      return this.$route.query.download === '0' || this.nftIsDownloadHidden;
    },
  },
  watch: {
    isShowSearchBar(isShow) {
      if (!isShow) {
        this.searchText = '';
      }
      this.$nextTick(() => {
        this.rendition.resize();
      });
    },
    searchText(text, prevText) {
      if (prevText !== text && !text) {
        this.searchResults = [];
        this.selectedSearchResultIndex = 0;
        this.removeSearchResultHighlights();
      }
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
        this.rendition.on('rendered', () => {
          const path = this.rendition.currentLocation().start.href;
          const pathArr = path.split('/');
          this.selectedChapter = pathArr.pop();
          this.dirPath = pathArr.join('/');
        });

        this.rendition.on('relocated', location => {
          this.saveToLocalStorage(location.start.cfi);
        });
        this.rendition.on('keydown', this.keyListener);
        this.rendition.on(
          'locationChanged',
          this.highlightVisibleSearchResults
        );
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

    // Search related methods
    compareCFIWithCurrent(cfiInput) {
      const cfi = new EpubCFI(cfiInput);
      const { start, end } = this.rendition.currentLocation();
      // Returns -1 if input is before, returns 1 if input is after, returns 0 if equal
      const compareStart = cfi.compare(cfi, start.cfi);
      const compareEnd = cfi.compare(cfi, end.cfi);
      return {
        compareStart,
        compareEnd,
      };
    },
    highlightVisibleSearchResults: debounce(function highlightResults() {
      if (!this.searchResults.length) return;

      this.removeSearchResultHighlights();

      for (let i = 0; i < this.searchResults.length; i += 1) {
        const cfi = this.searchResults[i];
        const { compareStart, compareEnd } = this.compareCFIWithCurrent(cfi);
        if (compareStart >= 0 && compareEnd <= 0) {
          this.rendition.annotations.highlight(cfi, {}, {}, '', {
            fill: this.selectedSearchResultIndex === i ? '#ffbf44' : '#50e3c2',
          });
        }
      }
    }, 200),
    removeSearchResultHighlights() {
      this.searchResults.forEach(cfi => {
        this.rendition.annotations.remove(cfi, 'highlight');
      });
    },
    async searchChapter(chapter) {
      try {
        await chapter.load(this.book.load.bind(this.book));
        const results = await chapter.find(this.searchText);
        return results.map(r => r.cfi);
      } finally {
        chapter.unload.bind(chapter)();
      }
    },
    searchBook: debounce(async function searchBook() {
      if (!this.searchText.length) return;

      const searchResultsByChapters = await Promise.all(
        this.book.spine.spineItems.map(this.searchChapter)
      );
      this.searchResults = searchResultsByChapters.flat();
      if (!this.searchResults.length) return;

      this.selectedSearchResultIndex = this.findSelectedSearchResultIndex();

      this.focusSelectedSearchResult();
    }, 1000),
    findSelectedSearchResultIndex() {
      if (!this.searchResults.length) return 0;

      // Find the first search result that is after the current location
      let start = 0;
      let end = this.searchResults.length - 1;
      while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const cfi = this.searchResults[mid];
        const { compareStart } = this.compareCFIWithCurrent(cfi);

        if (compareStart === 0) {
          return mid;
        }
        if (compareStart < 0) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }

      return start < this.searchResults.length ? start : 0;
    },
    async focusSelectedSearchResult() {
      if (!this.searchResults.length) return;

      const cfiString = this.searchResults[
        this.selectedSearchResultIndex
      ].toString();
      await this.rendition.display(cfiString);
    },
    handleSearchButtonClick() {
      if (this.isShowSearchBar) {
        this.isShowSearchBar = false;
        this.removeSearchResultHighlights();
      } else {
        this.isShowSearchBar = true;
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
    handleSearchInput() {
      this.removeSearchResultHighlights();
      this.searchBook();
    },
    handleClearSearchInputButtonClick() {
      if (this.searchText) {
        this.searchText = '';
        this.removeSearchResultHighlights();
      } else {
        this.isShowSearchBar = false;
      }
    },
    cycleSearchResult(direction) {
      if (!this.searchResults.length) return;

      const { length } = this.searchResults;
      this.selectedSearchResultIndex =
        (this.selectedSearchResultIndex + direction + length) % length;

      this.focusSelectedSearchResult();
    },
    handlePrevSearchResultButtonClick() {
      this.cycleSearchResult(-1);
    },
    handleNextSearchResultButtonClick() {
      this.cycleSearchResult(1);
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
  },
};
</script>

<style>
@media (min-width: 928px) {
  #viewer:after {
    position: absolute;
    width: 1px;
    border-right: 1px #00000020 solid;
    height: 100%;
    z-index: 1;
    left: 50%;
    margin-left: -1px;
    top: 0;
    bottom: 0;
    box-shadow: -2px 0 24px rgba(0, 0, 0, 1);
    content: '';
  }
}
</style>
