import {
  CHRISTMAS_CAMPAIGN_MIN_SPEND,
  CHRISTMAS_CAMPAIGN_COUPON,
} from '@/constant/index';

export default {
  computed: {
    mixinCoupon() {
      return this.$route.query.coupon || '';
    },
  },
  methods: {
    getApplicableCoupon({ cartCoupon, checkoutPrice }) {
      if (this.mixinCoupon || cartCoupon) {
        return this.mixinCoupon || cartCoupon;
      }
      return checkoutPrice > CHRISTMAS_CAMPAIGN_MIN_SPEND
        ? CHRISTMAS_CAMPAIGN_COUPON
        : '';
    },
  },
};
