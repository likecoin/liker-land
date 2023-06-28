<script>
export default {
  fetch({ redirect }) {
    redirect(localeLocation({ name: 'index' }));
  },
};
</script>
