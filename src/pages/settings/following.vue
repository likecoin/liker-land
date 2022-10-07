<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, { name: 'index', params, query });
  },
};
</script>
