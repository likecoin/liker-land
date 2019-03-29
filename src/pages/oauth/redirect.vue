<template>
  <main class="redirect-page">
    <div class="my-48">
      <h1 class="text-24">{{ $t('RedirectPage.title') }}</h1>
      <LcLoadingIndicator class="text-like-cyan mx-auto" />
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Redirect',
  layout: 'dialog',
  computed: {
    ...mapGetters(['getSubscribedAuthors']),
  },
  head() {
    return {
      title: this.$t('RedirectPage.title'),
    };
  },
  async mounted() {
    const { state, auth_code: authCode } = this.$route.query;
    if (authCode && state) {
      await this.getOAuthToken({ authCode, state });
      let postAuthRoute;
      if (window.sessionStorage) {
        const storedRoute = window.sessionStorage.getItem(
          'USER_POST_AUTH_ROUTE'
        );
        const storedURL = window.sessionStorage.getItem('USER_POST_AUTH_PATH');
        if (storedRoute) postAuthRoute = JSON.parse(storedRoute);
        if (storedURL) {
          const targetPath = decodeURIComponent(storedURL);
          if (targetPath[0] === '/') postAuthRoute = targetPath;
        }
        window.sessionStorage.removeItem('USER_POST_AUTH_ROUTE');
        window.sessionStorage.removeItem('USER_POST_AUTH_PATH');
      }
      if (postAuthRoute) {
        this.$router.push(postAuthRoute);
      } else {
        this.$router.push({ name: 'index-following' });
      }
    }
  },
  methods: {
    ...mapActions(['getOAuthToken']),
  },
};
</script>
