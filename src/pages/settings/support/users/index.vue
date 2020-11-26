<script>
export default {
  fetch({ redirect, query }) {
    redirect(302, {
      name: 'settings-support',
      query,
    });
  },
};
</script>
