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
import { logTrackerEvent, logConverstion } from '~/util/EventLogger';

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
    const { error, state, code: authCode } = this.$route.query;
    if (authCode && state) {
      try {
        const user = await this.postLoginToken({ authCode, state });
        if (user.isNew) {
          logTrackerEvent(
            this,
            'Register',
            'RegisterSignUpSuccess',
            'RegisterSignUpSuccess',
            1
          );
          logConverstion(this, 'Register');
        } else {
          logTrackerEvent(
            this,
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
        logTrackerEvent(this, 'Register', 'RegisterError', errMessage, 1);
        this.$nuxt.error({
          statusCode: errData.status || 400,
          message: errMessage,
        });
      }
    } else {
      logTrackerEvent(this, 'Register', 'RegisterFail', error, 1);
      if (window.sessionStorage) {
        window.sessionStorage.removeItem('USER_POST_AUTH_ROUTE');
        window.sessionStorage.removeItem('USER_POST_AUTH_PATH');
      }
      this.$nuxt.error({
        statusCode: 400,
        message: error,
      });
    }
  },
  methods: {
    ...mapActions(['postLoginToken']),
  },
};
</script>
