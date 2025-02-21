<script>
export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(301, localeLocation({ name: 'about-nft-book', query }));
  },
};
</script>
