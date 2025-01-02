<template>
  <div class="w-full h-full">
    <div
      v-if="isLoading"
      class="fixed inset-0 flex flex-col justify-center items-center gap-[16px] bg-like-green"
    >
      <ProgressIndicator
        :type="progressIndicatorType"
        :value="progressPercent"
      />
      <span class="text-center text-white">{{ progressLabelText }}</span>
    </div>
    <iframe
      ref="pdfIframe"
      :src="pdfIframeSrc"
      width="100%"
      height="100%"
      style="border:none"
    />
  </div>
</template>

<script>
import nftMixin from '~/mixins/nft';
import readerMixin from '~/mixins/reader';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'PDFReaderPage',
  mixins: [nftMixin, readerMixin],
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
      return `https://likecoin.github.io/pdf.js/web/viewer.html?download=${download}&file=`;
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
