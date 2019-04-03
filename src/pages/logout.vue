<template>
  <main class="logout-page">
    <div class="my-48">
      <h1 class="text-24">{{ $t('LogoutPage.loggingOut') }}</h1>
      <LcLoadingIndicator class="text-like-cyan mx-auto" />
    </div>
  </main>
</template>

<script>
import { getLogoutAPI } from '~/util/api';

export default {
  layout: 'dialog',
  middleware: 'authenticated',
  async mounted() {
    await this.$axios.$post(getLogoutAPI());
    window.location.href = '/';
  },
};
</script>
