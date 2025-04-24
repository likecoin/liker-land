<template>
  <div class="fixed inset-0 flex flex-col">
    <header class="border-b border-[#ccc]">
      <div class="flex items-center justify-between px-[16px] py-[8px]">
        <div class="flex items-center gap-4">
          <NuxtLink
            :to="
              localeLocation(
                getSessionWallet
                  ? {
                      name: 'id',
                      params: { id: getSessionWallet },
                      query: { tab: 'collected' },
                    }
                  : {
                      name: 'nft-class-classId',
                      params: { classId: classId },
                      query: { ll_medium: 'reader', ll_source: classId },
                    }
              )
            "
            :alt="$t('back')"
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
        </div>
      </div>
    </header>

    <main class="relative grow">
      <iframe
        ref="pdfIframe"
        class="absolute inset-0 w-full h-full"
        :src="pdfIframeSrc"
        style="border:none"
      />
    </main>

    <div
      v-if="isLoading"
      class="z-[10] fixed inset-0 flex flex-col justify-center items-center gap-[16px] bg-like-green"
    >
      <ProgressIndicator
        :type="progressIndicatorType"
        :value="progressPercent"
      />
      <span class="text-center text-white">{{ progressLabelText }}</span>
    </div>
  </div>
</template>

<script>
import nftMixin from '~/mixins/nft';
import walletMixin from '~/mixins/wallet';
import readerMixin from '~/mixins/reader';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'PDFReaderPage',
  mixins: [nftMixin, walletMixin, readerMixin],
  data() {
    return {
      isLoading: false,
      isIframeReady: false,
      fileData: null,
    };
  },
  computed: {
    iframeOrigin() {
      return 'https://likecoin.github.io';
    },
    pdfIframeSrc() {
      const download =
        this.$route.query.download === '0' || this.nftIsDownloadHidden
          ? '0'
          : '1';
      // TODO: customize pdf.js instead of using default build
      return `https://likecoin.github.io/pdf.js/legacy/web/viewer.html?download=${download}&file=`;
    },
  },
  mounted() {
    logTrackerEvent(this, 'ReaderPdf', 'ReaderPdfMounted', this.classId, 1);
    window.addEventListener('message', this.handleIframeMessage);
    this.initRendition();
  },
  beforeUnmount() {
    logTrackerEvent(this, 'ReaderPdf', 'ReaderPdfUnmounted', this.classId, 1);
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleIframeMessage);
  },
  methods: {
    handleIframeMessage(event) {
      if (event.origin !== this.iframeOrigin) return;
      if (event.data === 'ready') {
        this.isIframeReady = true;
        if (this.fileData) {
          const buffer = this.fileData;
          this.$refs.pdfIframe?.contentWindow?.postMessage(
            {
              action: 'openArrayBufferFile',
              data: {
                data: buffer,
                name: this.nftName,
                classId: this.classId,
                nftId: this.nftId,
                wallet: this.getSessionWallet,
              },
            },
            this.iframeOrigin,
            [buffer]
          );
          this.fileData = null;
        }
      } else if (event.data.event === 'pdfDownload') {
        logTrackerEvent(
          this,
          'ReaderPdf',
          'ReaderDownloadPdf',
          this.classId,
          1
        );
      }
    },
    async initRendition() {
      try {
        this.isLoading = true;
        const buffer = await this.getFileBuffer('reader-pdf');
        if (this.isIframeReady) {
          this.$refs.pdfIframe?.contentWindow?.postMessage(
            {
              action: 'openArrayBufferFile',
              data: {
                data: buffer,
                name: this.nftName,
                classId: this.classId,
                nftId: this.nftId,
                wallet: this.getSessionWallet,
              },
            },
            this.iframeOrigin,
            [buffer]
          );
        } else {
          this.fileData = buffer;
        }
        this.isLoading = false;
      } catch (err) {
        const errData = err.response || err;
        const errMessage = errData.data || errData.message || errData;
        console.error(errMessage); // eslint-disable-line no-console
        logTrackerEvent(this, 'ReaderPdf', 'ReaderPdfError', errMessage, 1);
        this.$router.replace(
          this.localeLocation({
            name: 'nft-class-classId',
            params: { classId: this.classId },
          })
        );
      }
    },
  },
};
</script>
