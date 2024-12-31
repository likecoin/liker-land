export default {
  methods: {
    getApplicableCoupon({ cartCoupon, checkoutPrice }) {
      const queryCoupon = this.$route.query.coupon || '';
      return queryCoupon || cartCoupon || undefined;
    },
  },
};
