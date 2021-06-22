<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, { name: 'creators-dashboard', params, query });
  },
};
</script>
