<template lang="pug">
  Transition(
    name="error-dialog-"
    appear
  )
    DialogLayout.error-dialog
      template(#body)
        Transition(
          name="error-dialog-content-"
          appear
        )
          main.page-content.error-dialog-content

            template(v-if="formattedTitle")
              h1.text-28.mt-16.px-12 {{ formattedTitle }}
              p.text-16.mt-32.leading-1_5 {{ formattedMessage }}

            p.text-24.mt-16.font-600(v-else) {{ formattedMessage }}

            .mt-32.px-12(class="phone:px-0")
              div(v-if="isLoginError")
                a.btn.btn--outlined(
                  :href="getOAuthLoginAPI()"
                  @click="onClickLogEvent('Register', 'RegisterSignIn', 'RegisterSignIn(error page)', 1)"
                )
                  | {{ $t('signIn') }}
                a.btn.btn--outlined(
                  :href="getOAuthLoginAPI()"
                  @click="onClickLogEvent('Register', 'RegisterSignUp', 'RegisterSignUp(error page)', 1)"
                )
                  | {{ $t('signUp') }}

              a.btn.btn--plain.btn--auto-size.text-14.mx-0(
                href=""
                @click="onClickBackButton"
              )
                | {{ $t('back') }}
              a.btn.btn--plain.btn--auto-size.text-14.mx-0(href="/")
                | {{ $t('backToHome') }}</a>
</template>

<script>
import DialogLayout from '~/components/DialogLayout';

import { getOAuthLoginAPI } from '~/util/api';
import { logTrackerEvent } from '~/util/EventLogger';
import { defaultLocale } from '~/locales';
import IntercomMixin from '~/mixins/intercom';

export default {
  layout: 'empty',
  transition: {
    name: '',
    css: false,
  },
  layoutTransition: {
    name: '',
    css: false,
  },
  components: {
    DialogLayout,
  },
  mixins: [IntercomMixin],
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
    i18nKeyBase() {
      return `ERROR.${this.error.message}`;
    },
    i18nKeyTitle() {
      return `${this.i18nKeyBase}.title`;
    },
    i18nKeyMessage() {
      return `${this.i18nKeyBase}.message`;
    },
    isStringLocalizedError() {
      return this.$te(this.i18nKeyBase, defaultLocale);
    },
    isObjectLocalizedError() {
      return this.$te(this.i18nKeyMessage, defaultLocale);
    },
    isLocalizedError() {
      return this.isStringLocalizedError || this.isObjectLocalizedError;
    },
    isLoginError() {
      return /^LOGIN_NEEDED.*/.test(this.error.message);
    },
    formattedTitle() {
      if (this.$te(this.i18nKeyTitle, defaultLocale)) {
        return this.$t(this.i18nKeyTitle);
      }
      return undefined;
    },
    formattedMessage() {
      if (this.isObjectLocalizedError) {
        return this.$t(this.i18nKeyMessage);
      }
      if (this.isStringLocalizedError) {
        return this.$t(this.i18nKeyBase);
      }
      if (this.isLoginError) {
        return this.$t('ERROR.LOGIN_NEEDED');
      }

      const { statusCode, message } = this.error;
      return `[${statusCode}] ${message}`;
    },
  },
  mounted() {
    if (this.isLoginError) {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(
          'USER_POST_AUTH_ROUTE',
          JSON.stringify(this.$route)
        );
      }
    }
  },
  methods: {
    logTrackerEvent,
    onClickBackButton(e) {
      // If the user enters a page requires authenication,
      // back button should trigger going back instead of refreshing the page
      if (this.isLoginError && this.error.message === 'LOGIN_NEEDED') {
        e.preventDefault();
        this.$router.back();
      }
    },
    onClickLogEvent(...args) {
      logTrackerEvent(this, ...args);
    },
  },
  head() {
    return {
      title: this.formattedMessage,
    };
  },
};
</script>

<style lang="scss">
.error-dialog {
  z-index: 9999;

  @apply absolute;
  @apply pin;

  &-- {
    &enter,
    &leave-to {
      opacity: 0;
      transform: translateY(4%);
    }

    &enter-active,
    &leave-active {
      transition-property: opacity, transform !important;
      transition-duration: 0.5;
    }
    &enter-active {
      transition-timing-function: cubic-bezier(0, 0, 0.3, 1);
    }
    &leave-active {
      transition-timing-function: cubic-bezier(0.7, 0, 1, 1);
    }
  }

  &-content {
    &-- {
      &enter,
      &leave-to {
        opacity: 0;
        transform: scale(0.95);
      }

      &enter-active,
      &leave-active {
        transition-property: opacity, transform !important;
        transition-duration: 0.5s;
      }
      &enter-active {
        transition-timing-function: cubic-bezier(0, 0, 0.3, 1);
      }
      &leave-active {
        transition-timing-function: cubic-bezier(0.7, 0, 1, 1);
      }
    }
  }
}
</style>
