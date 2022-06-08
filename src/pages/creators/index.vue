<script>
export default {
  fetch({ app, redirect }) {
    redirect(app.i18n.t('creators_page_redirect_url'));
  },
};
</script>
