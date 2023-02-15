<script>
export default {
  fetch({ redirect, localeLocation }) {
    redirect(302, localeLocation({ name: 'writing-nft' }));
  },
};
</script>
