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
};
