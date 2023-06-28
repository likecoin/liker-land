<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(
      302,
      localeLocation({
        name: 'index',
        params,
        query,
      })
    );
  },
};
</script>
