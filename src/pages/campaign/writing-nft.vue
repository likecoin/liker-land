<script>
export default {
  fetch({ redirect, params, query, localeLocation }) {
    redirect(
      301,
      localeLocation({
        name: 'about-writing-nft',
        params,
        query,
      })
    );
  },
};
</script>
