<script>
export default {
  fetch({ redirect, params, query, localeLocation }) {
    redirect(302, localeLocation({ name: 'civic-dashboard', params, query }));
  },
};
</script>
