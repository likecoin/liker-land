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
            await cache.put(req, res.clone());
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }
      }
      const buffer = await res.arrayBuffer();
      return buffer;
    },
  },
};
