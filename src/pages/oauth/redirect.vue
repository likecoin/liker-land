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
      let postAuthURL;
      if (window.sessionStorage) {
        const storedRoute = window.sessionStorage.getItem(
          'USER_POST_AUTH_ROUTE'
        );
        const storedURL = window.sessionStorage.getItem('USER_POST_AUTH_URL');
        if (storedRoute) postAuthRoute = JSON.parse(storedRoute);
        if (storedURL) postAuthURL = decodeURIComponent(storedURL);
      }
      // window.sessionStorage.removeItem('USER_POST_AUTH_ROUTE');
      // window.sessionStorage.removeItem('USER_POST_AUTH_URL');
      if (postAuthRoute) {
        this.$router.push(postAuthRoute);
      } else if (postAuthURL) {
        window.location.href = postAuthURL;
      } else {
        this.$router.push({ name: 'index' });
      }
    }
  },
  methods: {
    ...mapActions(['getOAuthToken']),
  },
};
</script>
