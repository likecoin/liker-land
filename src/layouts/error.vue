<template>
  <main class="error-page">

    <h1 class="text-24 mt-16">{{ formattedMessage }}</h1>

    <div class="mt-32 px-80 phone:px-0">
      <a
        v-if="isLoginError"
        class="btn btn--outlined btn--block"
        :href="getOAuthLoginAPI()"
      >{{ $t('signInOrSignUp') }}</a>
      <NuxtLink
        class="btn btn--outlined btn--block"
        :to="{ name: 'index' }"
      >
        {{ $t('backToHome') }}
      </NuxtLink>
    </div>

  </main>
</template>

<script>
import { getOAuthLoginAPI } from '~/util/api';

import { defaultLocale } from '~/locales';

export default {
  layout: 'dialog',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      getOAuthLoginAPI,
    };
  },
  computed: {
    isLocalizedError() {
      return this.$te(`ERROR.${this.error.message}`, defaultLocale);
    },
    isLoginError() {
      const { statusCode, message } = this.error;
      return statusCode === 401 && message === 'LOGIN_NEEDED';
    },
    formattedMessage() {
      if (this.isLocalizedError) {
        return this.$t(`ERROR.${this.error.message}`);
      }

      const { statusCode, message } = this.error;
      return `[${statusCode}] ${message}`;
    },
  },
  head() {
    return {
      title: this.formattedMessage,
    };
  },
  mounted() {
    const { isLoginError, error } = this;
    if (isLoginError && error.payload && error.payload.targetUrl) {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(
          'USER_POST_AUTH_URL',
          error.payload.targetUrl
        );
      }
    }
  },
};
</script>
