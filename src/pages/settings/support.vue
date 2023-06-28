<script>
export default {
  fetch({ redirect, params, query, localeLocation }) {
    redirect(
      302,
      localeLocation({ name: 'creators-dashboard', params, query })
    );
  },
};
</script>
