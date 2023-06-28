<template>
  <ProgressIndicator />
</template>
<script>
export default {
  fetch({ redirect, params, query, localeLocation }) {
    redirect(302, localeLocation({ name: 'getapp', params, query }));
  },
};
</script>
