<script>
export default {
  fetch({ redirect, params, query, localeLocation }) {
    /* page/query to be changed according to campaign needs */
    redirect(
      302,
      localeLocation({
        name: 'civic',
        params,
        query,
      })
    );
  },
};
</script>
