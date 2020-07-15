<script>
export default {
  fetch({ redirect, query }) {
    if (query.error) {
      redirect(302, {
        name: 'civic-payment-likepay-fail',
        query,
      });
    } else {
      redirect(302, {
        name: 'civic-payment-likepay-success',
        query,
      });
    }
  },
};
</script>
