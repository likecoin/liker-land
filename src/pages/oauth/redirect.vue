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
import { ONE_HOUR_IN_MS } from '~/constant';

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
        if (window.localStorage) {
          const storedRoute = window.localStorage.getItem(
            'USER_POST_AUTH_ROUTE'
          );
          if (storedRoute) {
            const postAuthRouteInfo = JSON.parse(storedRoute);
            if (
              postAuthRouteInfo.route &&
              postAuthRouteInfo.ts + ONE_HOUR_IN_MS > Date.now()
            ) {
              postAuthRoute = postAuthRouteInfo.route;
            } else if (postAuthRouteInfo.name) {
              postAuthRoute = postAuthRouteInfo;
            }
          }
          window.localStorage.removeItem('USER_POST_AUTH_ROUTE');
        }
        if (postAuthRoute) {
          this.$router.replace(postAuthRoute);
        } else {
          this.$router.replace(this.localeLocation(this.getHomeRoute));
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
