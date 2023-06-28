<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, localeLocation({ name: 'civic-dashboard', params, query }));
  },
};
</script>
