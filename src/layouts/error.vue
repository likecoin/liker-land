<template>
  <div class="lc-container-0">
    <h1>
      {{ error.statusCode }}
    </h1>
    <h2>
      {{ error.message }}
    </h2>
    <a
      v-if="isLoginError"
      :href="getOAuthLoginAPI()"
    >{{ $t('signInOrSignUp') }}</a>
    <nuxt-link
      :to="{ name: 'index' }"
    >
      {{ $t('Error.button.toIndex') }}
    </nuxt-link>
  </div>
</template>

<script>
import { getOAuthLoginAPI } from '~/util/api';

export default {
  layout: 'default',
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
    isLoginError() {
      const { statusCode, message } = this.error;
      return statusCode === 401 && message === 'LOGIN_NEEDED';
    },
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
