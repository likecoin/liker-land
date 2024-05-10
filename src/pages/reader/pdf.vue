<template>
  <div class="w-full h-full">
    <div
      v-if="isLoading"
      class="fixed inset-0 flex flex-col justify-center items-center"
    >
      <ProgressIndicator />
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
import { logTrackerEvent } from '~/util/EventLogger';
import { APP_LIKE_CO_URL_BASE } from '~/constant';

export default {
  name: 'PDFReaderPage',
  mixins: [nftMixin],
  props: {
    fileSrc: {
      type: String,
      default: '',
    },
    corsUrl: {
      type: String,
      default: '',
    },
    cacheKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isLoading: false,
      isIframeReady: false,
      base64FileData: null,
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
    window.addEventListener('message', this.handleIframeMessage);
    this.initRendition();
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleIframeMessage);
  },
  methods: {
    handleIframeMessage(event) {
      if (event.origin !== this.iframeOrigin) return;
      if (event.data === 'ready') {
        this.isIframeReady = true;
        if (this.base64FileData) {
          this.$refs.pdfIframe?.contentWindow.postMessage(
            JSON.stringify({
              action: 'openBase64File',
              data: {
                data: this.base64FileData,
                name: this.nftName,
              },
            }),
            this.iframeOrigin
          );
        }
      }
    },
    async getFileBuffer() {
      let buffer;
      if (window.caches) {
        try {
          const cache = await caches.open('reader-epub');
          let response = await cache.match(this.corsUrl);
          if (!response) response = await cache.add(this.corsUrl);
          buffer = await response?.arrayBuffer();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
      if (!buffer) {
        buffer = await this.$axios.$get(this.corsUrl, {
          responseType: 'arraybuffer',
        });
      }
      return buffer;
    },
    async initRendition() {
      try {
        this.isLoading = true;
        const buffer = await this.getFileBuffer();
        this.base64FileData = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        if (this.isIframeReady) {
          this.$refs.pdfIframe?.contentWindow.postMessage(
            JSON.stringify({
              action: 'openBase64File',
              data: {
                data: this.base64FileData,
                name: this.nftName,
              },
            }),
            this.iframeOrigin
          );
        }
        this.isLoading = false;
      } catch (err) {
        const errData = err.response || err;
        const errMessage = errData.data || errData.message || errData;
        console.error(errMessage); // eslint-disable-line no-console
        logTrackerEvent(this, 'ReaderPdf', 'ReaderPdfError', errMessage, 1);
        this.$nuxt.error({
          statusCode: errData.status || 400,
          message: errMessage,
        });
      }
    },
  },
};
</script>
