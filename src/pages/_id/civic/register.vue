<script>
export default {
  middleware: 'authenticated',
  fetch({ redirect, params, query: { quantity, ...query }, localeLocation }) {
    redirect(
      localeLocation({
        name: 'id-civic',
        params,
        query: {
          ...query,
          quantity,
          initial_state: 'confirm',
        },
      })
    );
  },
};
</script>
