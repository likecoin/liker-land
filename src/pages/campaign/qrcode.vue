<script>
export default {
  fetch({ redirect, params, query }) {
    /* page/query to be changed according to campaign needs */
    redirect(302, {
      name: 'civic',
      params,
      query: { from: 'candycandy772', ...query },
    });
  },
};
</script>
