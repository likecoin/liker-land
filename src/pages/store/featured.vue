<script>
export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(
      localeLocation({
        name: 'store',
        query: { ...query },
      })
    );
  },
};
</script>
