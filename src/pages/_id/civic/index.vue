<script>
export default {
  fetch({ redirect, localeLocation }) {
    redirect(localeLocation({ name: 'civic' }));
  },
};
</script>
