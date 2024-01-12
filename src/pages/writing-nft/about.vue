<script>
export default {
  fetch({ redirect, localeLocation, query }) {
    redirect(302, localeLocation({ name: 'about-writing-nft', query }));
  },
};
</script>
