<script>
export default {
  fetch({ redirect, localeLocation }) {
    redirect(302, localeLocation({ name: 'store-featured' }));
  },
};
</script>
