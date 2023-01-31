<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, {
      name: 'writing-nft',
      params,
      query,
    });
  },
};
</script>
