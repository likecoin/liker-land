<template>
  <div class="flex items-center justify-center">
    <ProgressIndicator />
  </div>
</template>
<script>
export default {
  fetch({ redirect, localeLocation }) {
    redirect(localeLocation({ name: 'feed', query: { view: 'town' } }));
  },
};
</script>
