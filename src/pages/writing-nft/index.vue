<script>
export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(302, localeLocation({ name: 'store', query }));
  },
};
</script>
