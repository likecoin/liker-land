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
import { LIKECOIN_LOGOUT_POPUP_URL } from '@/constant';

export default {
  layout: 'dialog',
  middleware: 'authenticated',
  computed: {
    ...mapGetters(['getHomeRoute']),
  },
  async mounted() {
    window.open(LIKECOIN_LOGOUT_POPUP_URL);
    await this.userLogout();
    this.$router.replace(this.localeLocation(this.getHomeRoute));
  },
  methods: {
    ...mapActions(['userLogout']),
  },
};
</script>
