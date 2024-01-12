<script>
export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(301, localeLocation({ name: 'about-writing-nft', query }));
  },
};
</script>
