<template>
  <main class="logout-page">
    <div class="my-48">
      <h1 class="text-24">{{ $t('LogoutPage.loggingOut') }}</h1>
      <LcLoadingIndicator class="text-like-cyan mx-auto" />
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  layout: 'dialog',
  middleware: 'authenticated',
  computed: {
    ...mapGetters(['getHomeRoute']),
  },
  async mounted() {
    await this.userLogout();
    this.$router.replace(this.getHomeRoute);
  },
  methods: {
    ...mapActions(['userLogout']),
  },
};
</script>
