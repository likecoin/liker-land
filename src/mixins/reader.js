export default {
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
  methods: {
    async getFileBuffer(cacheKey) {
      let buffer;
      if (window.caches) {
        try {
          const cache = await caches.open(cacheKey);
          let response = await cache.match(this.corsUrl);
          if (!response) {
            await cache.add(this.corsUrl);
            response = await cache.match(this.corsUrl);
          }
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
  },
};
