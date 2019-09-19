<script>
export default {
  fetch({ redirect, query }) {
    redirect(302, {
      name: 'civic-register-stripe',
      query,
    });
  },
};
</script>
