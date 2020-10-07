export default {
  computed: {
    utmCampaign() {
      return this.$route.query.utm_campaign;
    },
    utmSource() {
      return this.$route.query.utm_source;
    },
    utmMedium() {
      return this.$route.query.utm_medium;
    },
  },
  methods: {
    getUtmProps({
      utmCampaign: defaultUtmCampaign,
      utmSource: defaultUtmSource,
      utmMedium: defaultUtmMedium,
    } = {}) {
      return {
        utmCampaign: this.utmCampaign || defaultUtmCampaign,
        utmSource: this.utmSource || defaultUtmSource,
        utmMedium: this.utmMedium || defaultUtmMedium,
      };
    },
  },
};
