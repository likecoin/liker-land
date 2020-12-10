<script>
export default {
  middleware: 'authenticated',
  fetch({ redirect, params, query: { quantity, ...query } }) {
    redirect({
      name: 'id-civic',
      params,
      query: {
        ...query,
        quantity,
        initial_state: 'confirm',
      },
    });
  },
};
</script>
