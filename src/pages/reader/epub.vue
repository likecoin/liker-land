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
      <template v-else>
        <div class="flex justify-between items-center">
          <div class="grow" />
          <select
            v-model="selectedChapter"
            class="my-[10px] shadow-md rounded-4"
            @change="onChangeEpubChapter"
          >
            <option
              v-for="chapter in toc"
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
  name: 'EPUBReaderPage',
  mixins: [nftMixin, walletMixin],
  layout: 'empty',
  data() {
    return {
      isLoading: true,
      toc: [],
      selectedChapter: '',
      book: null,
      rendition: null,
    };
  },
  computed: {
    ...mapGetters(['getHomeRoute']),
    classId() {
      return this.$route.query.classId;
    },
    fileSrc() {
      const { src } = this.$route.query;
      // TODO: check src exists in ISCN
      // if (src && this.iscnContentUrls.find(url => url === src)) {
      if (src) {
        return src;
      }
      return this.iscnContentUrls.find(url => url.includes('epub'));
    },
    isLoginRequired() {
      return !!(this.nftIsDownloadHidden || this.nftMustClaimToView);
    },
    hideDownload() {
      return this.$route.query.download === '0' || this.nftIsDownloadHidden;
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

      this.initRendition();
    } finally {
      this.isLoading = false;
    }
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
    onChangeEpubChapter() {
      this.rendition.display(this.selectedChapter);
    },
    onClickEpubPrev() {
      this.rendition.prev();
    },
    onClickEpubNext() {
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
