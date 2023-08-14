<script>
export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(localeLocation({ name: 'index', query }));
  },
};
</script>
