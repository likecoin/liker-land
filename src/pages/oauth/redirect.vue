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
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  name: 'Redirect',
  layout: 'dialog',
  computed: {
    ...mapGetters(['getHomeRoute']),
  },
  head() {
    return {
      title: this.$t('RedirectPage.title'),
    };
  },
  async mounted() {
    const { state, auth_code: authCode } = this.$route.query;
    if (authCode && state) {
      try {
        const user = await this.postLoginToken({ authCode, state });
        if (user.isNew) {
          logTrackerEvent(
            'Register',
            'RegisterSignUpSuccess',
            'RegisterSignUpSuccess',
            1
          );
        } else {
          logTrackerEvent(
            'Register',
            'RegisterSignInSuccess',
            'RegisterSignInSuccess',
            1
          );
        }
        let postAuthRoute;
        if (window.sessionStorage) {
          const storedRoute = window.sessionStorage.getItem(
            'USER_POST_AUTH_ROUTE'
          );
          const storedURL = window.sessionStorage.getItem(
            'USER_POST_AUTH_PATH'
          );
          if (storedRoute) postAuthRoute = JSON.parse(storedRoute);
          if (storedURL) {
            const targetPath = decodeURIComponent(storedURL);
            if (targetPath[0] === '/') postAuthRoute = targetPath;
          }
          window.sessionStorage.removeItem('USER_POST_AUTH_ROUTE');
          window.sessionStorage.removeItem('USER_POST_AUTH_PATH');
        }
        if (postAuthRoute) {
          this.$router.replace(postAuthRoute);
        } else {
          this.$router.replace(this.getHomeRoute);
        }
      } catch (err) {
        const errData = err.response || err;
        const errMessage = errData.data || errData.message || errData;
        console.error(errMessage); // eslint-disable-line no-console
        this.$nuxt.error({
          statusCode: errData.status || 400,
          message: errMessage,
        });
      }
    }
  },
  methods: {
    ...mapActions(['postLoginToken']),
  },
};
</script>
