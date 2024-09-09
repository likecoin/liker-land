import { setSessionStorageItem, getFromSessionStorage } from '@/util/misc';

const INTERNAL_REFERRERS = [
  'https://liker.land/',
  'https://liker.land/en',
  'https://liker.land/zh-Hant',
  'https://authcore.like.co',
  'https://checkout.stripe.com',
];

export default {
  data() {
    return {
      utmCampaign: this.$route.query.utm_campaign,
      utmSource: this.$route.query.utm_source,
      utmMedium: this.$route.query.utm_medium,
      documentReferrer: '',
    };
  },
  mounted() {
    this.documentReferrer = document.referrer;
    this.restoreUTMFromSessionStorage();
    this.storeUTMToSessionStorage();
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
    restoreUTMFromSessionStorage() {
      const utm = JSON.parse(getFromSessionStorage('UTM_INFO'));
      if (utm) {
        if (!this.utmCampaign) this.utmCampaign = utm.utmCampaign;
        if (!this.utmSource) this.utmSource = utm.utmSource;
        if (!this.utmMedium) this.utmMedium = utm.utmMedium;
        if (
          !this.documentReferrer ||
          INTERNAL_REFERRERS.find(referrer =>
            this.documentReferrer.includes(referrer)
          )
        ) {
          this.documentReferrer = utm.documentReferrer || this.documentReferrer;
        }
      }
    },
    storeUTMToSessionStorage() {
      const utm = {
        utmCampaign: this.utmCampaign,
        utmSource: this.utmSource,
        utmMedium: this.utmMedium,
        documentReferrer: this.documentReferrer,
      };
      setSessionStorageItem('UTM_INFO', JSON.stringify(utm));
    },
  },
};
