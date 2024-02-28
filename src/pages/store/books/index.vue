<script>
export default {
  fetch({ redirect, localeLocation }) {
    redirect(301, localeLocation({ name: 'store' }));
  },
};
</script>
