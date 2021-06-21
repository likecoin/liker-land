<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, { name: 'civic-dashboard', params, query });
  },
};
</script>
