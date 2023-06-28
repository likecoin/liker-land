<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(
      302,
      localeLocation({ name: 'creators-dashboard', params, query })
    );
  },
};
</script>
