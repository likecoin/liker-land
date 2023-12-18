<template>
  <div class="flex flex-col justify-center items-center">
    <ProgressIndicator v-if="isLoading" />
    <Component
      :is="isLoginRequired ? 'AuthRequiredView' : 'div'"
      v-else
      class="w-full h-full"
      :login-label="$t('dashboard_login_in')"
      :login-button-label="$t('header_button_connect_to_wallet')"
    >
      <ProgressIndicator v-if="!fileSrc" />
      <iframe
        v-else-if="format === 'pdf'"
        class="fixed inset-0"
        :src="pdfIframeSrc"
        width="100%"
        height="100%"
        style="border:none"
      />
      <template v-else-if="format === 'epub'">
        <div class="flex justify-between items-center">
          <div class="grow" />
          <select
            v-model="epubSelectedChapter"
            class="my-[10px] shadow-md rounded-4"
            @change="onChangeEpubChapter"
          >
            <option
              v-for="chapter in epubTOC"
              :key="chapter.href"
              :value="chapter.href"
            >
              {{ chapter.label }}
            </option>
          </select>
          <div class="flex grow justify-end">
            <button
              v-if="!hideDownload"
              class="w-[50px] my-[10px]"
              @click="onClickDownloadEpub"
            >
              <IconDownload class="w-20 h-20" />
            </button>
          </div>
        </div>
        <a
          class="left-0 laptop:left-10 fixed z-10 top-1/2 text-[64px] text-like-green font-bold cursor-pointer select-none no-underline"
          @click="onClickEpubPrev"
          >‹</a
        >
        <div
          id="viewer"
          class="mx-auto my-0 w-full h-dynamic laptop:w-[1200px] laptop:h-[700px] shadow-md rounded-4 p-0 relative"
        />
        <a
          class="right-0 laptop:right-10 fixed z-10 top-1/2 text-[64px] text-like-green font-bold cursor-pointer select-none no-underline"
          @click="onClickEpubNext"
          >›</a
        >
      </template>
      <div v-else>
        Not implemented
      </div>
    </Component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Epub from 'epubjs';
import { saveAs } from 'file-saver';

import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';

import { getDownloadFilenameFromURL } from '~/util/nft-book';

export default {
  name: 'ReaderPage',
  mixins: [nftMixin, walletMixin],
  layout: 'empty',
  data() {
    return {
      isLoading: true,
      epubTOC: [],
      epubSelectedChapter: '',
      epubBook: null,
      epubRendition: null,
    };
  },
  computed: {
    ...mapGetters(['getHomeRoute']),
    classId() {
      return this.$route.query.classId;
    },
    format() {
      return this.$route.query.format || 'pdf';
    },
    fileSrc() {
      const { src } = this.$route.query;
      // TODO: check src exists in ISCN
      // if (src && this.iscnContentUrls.find(url => url === src)) {
      if (src) {
        return src;
      }
      return this.iscnContentUrls.find(url => url.includes(this.format));
    },
    isLoginRequired() {
      return !!(this.nftIsDownloadHidden || this.nftMustClaimToView);
    },
    hideDownload() {
      return this.$route.query.download === '0' || this.nftIsDownloadHidden;
    },
    pdfIframeSrc() {
      const download = this.hideDownload ? '0' : '1';
      const encodedUrl = encodeURIComponent(this.fileSrc);
      const encodedCorsUrl = encodeURIComponent(
        `https://pdf-cors-ufdrogmd2q-uw.a.run.app/pdf-cors?url=${encodedUrl}`
      );
      // TODO: customize pdf.js instead of using default build
      return `https://likecoin.github.io/pdf.js/web/viewer.html?download=${download}&file=${encodedCorsUrl}`;
    },
  },
  watch: {
    // TODO: use loginAddress
    async getAddress(address) {
      if (address) {
        await this.fetchUserCollectedCount();
        if (!this.userCollectedCount && this.isLoginRequired) {
          this.$router.replace(
            this.localeLocation({
              name: 'nft-class-classId',
              params: { classId: this.classId },
            })
          );
        }
      }
    },
  },
  async mounted() {
    try {
      this.isLoading = true;
      if (!this.classId) {
        this.$router.replace(this.localeLocation(this.getHomeRoute));
        return;
      }
      this.fetchNFTBookInfoByClassId(this.classId).catch();
      await this.lazyFetchNFTClassMetadata();
      await this.fetchISCNMetadata();
      await this.restoreSession();
      // TODO: use loginAddress
      if (this.getAddress) {
        await this.fetchUserCollectedCount();
        if (!this.userCollectedCount && this.isLoginRequired) {
          this.$router.replace(
            this.localeLocation({
              name: 'nft-class-classId',
              params: { classId: this.classId },
            })
          );
          return;
        }
      } else {
        this.connectWallet();
      }

      if (this.format === 'epub') {
        this.initEpubRendition();
      }
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    initEpubRendition() {
      this.epubBook = Epub(this.fileSrc);
      this.epubBook.loaded.navigation.then(
        navigation => (this.epubTOC = navigation.toc)
      );
      this.epubRendition = this.epubBook.renderTo('viewer', {
        width: '100%',
        height: '100%',
        spread: 'always',
      });
      this.epubRendition.display();
      this.epubRendition.on('rendered', () => {
        this.epubSelectedChapter = this.epubRendition.currentLocation().start.href;
      });
    },
    onChangeEpubChapter() {
      this.epubRendition.display(this.epubSelectedChapter);
    },
    onClickEpubPrev() {
      this.epubRendition.prev();
    },
    onClickEpubNext() {
      this.epubRendition.next();
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
