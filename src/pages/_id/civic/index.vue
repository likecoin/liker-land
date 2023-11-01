<script>
export default {
  fetch({ redirect, params, localeLocation }) {
    redirect(301, localeLocation({ name: 'id', params }));
  },
};
</script>
