<script>
export default {
  fetch({ redirect, localeLocation }) {
    redirect(localeLocation({ name: 'store-books-featured' }));
  },
};
</script>
