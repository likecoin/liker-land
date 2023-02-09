<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, { name: 'settings', params, query });
  },
};
</script>
