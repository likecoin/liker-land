export default {
  data() {
    return {
      totalSize: 0,
      progressSize: 0,
    };
  },
  props: {
    classId: {
      type: String,
      default: '',
    },
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
  computed: {
    progressPercent() {
      return this.totalSize
        ? Math.round((this.progressSize * 100.0) / this.totalSize)
        : 0;
    },
    progressSizeInMB() {
      return (this.progressSize / (1024 * 1024)).toFixed(2);
    },
    totalSizeInMB() {
      return (this.totalSize / (1024 * 1024)).toFixed(2);
    },
    progressIndicatorType() {
      return this.totalSize ? 'determinate' : 'indeterminate';
    },
    progressLabelText() {
      return this.totalSize
        ? `${this.progressSizeInMB} / ${this.totalSizeInMB} MB (${
            this.progressPercent
          }%)`
        : this.$t('reader_loading_label');
    },
  },
  methods: {
    async getFileBuffer(cacheKey) {
      this.totalSize = 0;
      this.progressSize = 0;
      let res;
      const req = new Request(this.corsUrl);
      if (window.caches) {
        try {
          const cache = await caches.open(cacheKey);
          res = await cache.match(req);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
      if (!res) {
        res = await fetch(req);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        if (window.caches) {
          try {
            const cache = await caches.open(cacheKey);
            cache.put(req, res.clone());
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }
      }
      const reader = res.body.getReader();

      const contentLength = +res.headers.get('X-Original-Content-Length');
      if (contentLength) {
        this.totalSize = contentLength;
      }

      let receivedLength = 0;
      const chunks = [];
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        receivedLength += value.length;
        this.progressSize = receivedLength;
      }

      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      chunks.forEach(chunk => {
        chunksAll.set(chunk, position);
        position += chunk.length;
      });

      return chunksAll.buffer;
    },
  },
};
