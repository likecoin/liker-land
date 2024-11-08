import { setSessionStorageItem, getFromSessionStorage } from '@/util/misc';

const INTERNAL_REFERRERS = [
  'https://liker.land',
  'https://authcore.like.co',
  'https://checkout.stripe.com',
];

export default {
  data() {
    return {
      utmCampaign: this.$route.query.utm_campaign,
      utmSource: this.$route.query.utm_source,
      utmMedium: this.$route.query.utm_medium || this.mixinLinkMedium,
      documentReferrer: '',
      fbClickId: this.formattedFbcQs,
    };
  },
  computed: {
    mixinLinkMedium() {
      return (
        this.$route.query.ll_medium ||
        // NOTE: To be injected by the mixin user
        this.linkMedium
      );
    },
    gadClickId() {
      return this.$route.query.gclid;
    },
    gadSource() {
      return this.$route.query.gad_source;
    },
    formattedFbcQs() {
      const { fbclid } = this.$route.query;
      return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
    },
  },
  mounted() {
    this.documentReferrer = document.referrer;
    this.restoreUTMFromSessionStorage();
    this.storeUTMToSessionStorage();
    this.getFbClickIdFromCookie();
    // TODO: split linkMedium into a new separate field
    this.utmMedium = this.utmMedium || this.mixinLinkMedium;
  },
  methods: {
    setUTMProps({ utmCampaign, utmSource, utmMedium }) {
      if (utmCampaign !== undefined) this.utmCampaign = utmCampaign;
      if (utmSource !== undefined) this.utmSource = utmSource;
      if (utmMedium !== undefined) this.utmMedium = utmMedium;
      this.storeUTMToSessionStorage();
    },
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
          (utm.documentReferrer &&
            INTERNAL_REFERRERS.find(referrer =>
              this.documentReferrer.includes(referrer)
            ) &&
            INTERNAL_REFERRERS.find(referrer =>
              utm.documentReferrer.includes(referrer)
            ))
        ) {
          this.documentReferrer = utm.documentReferrer;
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
    getFbClickIdFromCookie() {
      try {
        const fbc = this.$cookie.get('_fbc');
        if (fbc) {
          this.fbClickId = fbc;
        } else if (this.formattedFbcQs) {
          this.fbClickId = this.formattedFbcQs;
          this.$cookie.set('_fbc', this.fbClickId, { expires: '90D' });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
};
