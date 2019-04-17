<template>
  <Transition
    name="error-dialog-"
    appear
  >
    <div class="error-dialog page-wrapper">
      <Transition
        name="error-dialog-content-"
        appear
      >
        <main class="error-dialog-content">

          <h1 class="text-24 mt-16">{{ formattedMessage }}</h1>

          <div class="mt-32 px-12 phone:px-0">
            <div v-if="isLoginError">
              <a
                class="btn btn--outlined"
                :href="getOAuthLoginAPI()"
                @click="onClickLogEvent('Register', 'RegisterSignIn', 'RegisterSignIn(error)', 1)"
              >{{ $t('signIn') }}</a><a
                class="btn btn--outlined"
                :href="getOAuthLoginAPI()"
                @click="onClickLogEvent('Register', 'RegistersignUp', 'RegisterSignUp(error)', 1)"
              >{{ $t('signUp') }}</a>
            </div>
            <a
              class="btn btn--plain btn--auto-size text-14 mx-0"
              href=""
              @click="onClickBackButton"
            >{{ $t('back') }}</a><a
              class="btn btn--plain btn--auto-size text-14 mx-0"
              href="/"
            >{{ $t('backToHome') }}</a>
          </div>

        </main>
      </Transition>
    </div>
  </Transition>
</template>

<script>
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
    isLocalizedError() {
      return this.$te(`ERROR.${this.error.message}`, defaultLocale);
    },
    isLoginError() {
      return /^LOGIN_NEEDED.*/.test(this.error.message);
    },
    formattedMessage() {
      if (this.isLocalizedError) {
        return this.$t(`ERROR.${this.error.message}`);
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
  @apply absolute;
  @apply pin;

  @apply flex;
  @apply justify-center;
  @apply items-center;

  @apply p-16;

  &-- {
    &enter,
    &leave-to {
      opacity: 0;
    }

    &enter-active,
    &leave-active {
      transition-property: opacity !important;
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
    @apply flex-no-grow;

    @apply text-like-green;
    @apply text-center;

    @apply bg-white;

    @apply rounded;

    @apply p-24;

    @apply w-full;
    @apply max-w-phone;

    &-- {
      &enter,
      &leave-to {
        opacity: 0;
        transform: translateY(100px) scale(0.95);
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
