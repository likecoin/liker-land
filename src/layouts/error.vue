<template lang="pug">
  Transition(
    name="error-dialog-"
    appear
  )
    DialogLayout.error-dialog
      template(
        v-if="isExperimenting && isLoginErrorFromCivicLikerRegistration"
        #header-content
      )
        LikeButtonAnimation(
          class="-mt-32"
          :avatar="referrer ? referrer.avatar : undefined"
        )
      template(#body)
        Transition(
          name="error-dialog-content-"
          appear
        )
          main.page-content.error-dialog-content
            i18n.text-24.mt-16.font-600(
              v-if="isExperimenting && isLoginErrorFromCivicLikerRegistration"
              :path="`ERROR.LOGIN_NEEDED_TO_SUPPORT_CREATOR${referrer ? '_WITH_NAME' : ''}`"
              tag="p"
            )
              span.whitespace-no-wrap(
                v-if="referrer"
                place="creator"
              ) {{ referrer.displayName }}

            template(v-else-if="formattedTitle")
              h1.text-28.mt-16.px-12 {{ formattedTitle }}
              p.text-16.mt-32.leading-1_5 {{ formattedMessage }}

            p.text-24.mt-16.font-600(v-else) {{ formattedMessage }}

            .mt-32.px-12(class="phone:px-0")
              div(v-if="isLoginError")
                a.btn.btn--outlined(
                  :href="getOAuthLoginAPI"
                  @click="onClickLogEvent('Register', 'RegisterSignIn', 'RegisterSignIn(error page)', 1)"
                )
                  | {{ $t('signIn') }}
                a.btn.btn--outlined(
                  :href="getOAuthRegisterAPI"
                  @click="onClickLogEvent('Register', 'RegisterSignUp', 'RegisterSignUp(error page)', 1)"
                )
                  | {{ $t('signUp') }}

              div(v-if=`
                error.message === 'CIVIC_LIKER_TRIAL_EVENT_JOINED' ||
                error.message === 'CIVIC_LIKER_ALREADY_PAID'
              `)
                NuxtLink.btn.btn--outlined(:to="{ name: 'civic' }") {{ $t('learnMore') }}
                NuxtLink.btn.btn--outlined(
                  v-if="error.message === 'CIVIC_LIKER_TRIAL_EVENT_JOINED'"
                  :to="{ name: 'civic-register' }"
                )
                  | {{ $t('upgrade') }}

              // - Common action button
              - const btnClass = 'btn btn--plain btn--auto-size text-14 mx-0'

              button(
                v-else-if="!error.isBackButtonHidden"
                class=btnClass
                @click="onClickBackButton"
              )
                | {{ $t('back') }}

              NuxtLink(
                class=btnClass
                :to="{ name: 'index' }"
                @click.native="onClickHomeButton"
              )
                | {{ $t('backToHome') }}
</template>

<script>
import DialogLayout from '~/components/DialogLayout';
import LikeButtonAnimation from '~/components/LikeButtonAnimation';

import {
  getOAuthLoginAPI,
  getOAuthRegisterAPI,
  getUserMinAPI,
} from '~/util/api';
import { getAvatarHaloTypeFromUser, checkUserNameValid } from '~/util/user';
import { logTrackerEvent } from '~/util/EventLogger';
import { defaultLocale } from '~/locales';
import experimentMixin from '~/mixins/experiment';
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
    LikeButtonAnimation,
  },
  mixins: [
    IntercomMixin,
    experimentMixin('isExperimenting', 'civic-register-page', 'variant'),
  ],
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      referrer: undefined,
    };
  },
  computed: {
    getOAuthLoginAPI,

    getOAuthRegisterAPI() {
      const { from, referrer } = this.$route.query;
      return getOAuthRegisterAPI(from, referrer);
    },
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
    isLoginError() {
      return /^LOGIN_NEEDED.*/.test(this.error.message);
    },
    isLoginErrorFromCivicLikerRegistration() {
      return this.isLoginError && /^civic-register.*/.test(this.$route.name);
    },
    isCivicLikerRelatedError() {
      return /^CIVIC_LIKER.*/.test(this.error.message);
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
  async mounted() {
    if (this.isLoginError) {
      if (window.sessionStorage) {
        const { name, params, query, hash } = this.$route;
        window.sessionStorage.setItem(
          'USER_POST_AUTH_ROUTE',
          JSON.stringify({
            name,
            params,
            query,
            hash,
          })
        );
      }
    }
    if (this.isExperimenting && this.isLoginErrorFromCivicLikerRegistration) {
      // Fetch referrer info
      const { from } = this.$route.query;
      if (from && checkUserNameValid(from)) {
        try {
          const user = await this.$axios.$get(getUserMinAPI(from));
          this.referrer = {
            ...user,
            avatarHalo: getAvatarHaloTypeFromUser(user),
          };
        } catch (err) {
          const msg = (err.response && err.response.data) || err;
          // eslint-disable-next-line no-console
          console.error(msg);
        }
      }
    }
  },
  methods: {
    onClickBackButton() {
      // If the user enters a page requires authenication,
      // back button should trigger going back instead of refreshing the page
      if (this.isCivicLikerRelatedError) {
        this.$router.push({ name: 'civic' });
      } else if (this.isLoginError) {
        this.$router.back();
      } else {
        window.location.reload();
      }
    },
    onClickHomeButton() {
      if (this.$route.name === 'index') {
        window.location.reload();
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
      transform: translateY(4%);

      opacity: 0;
    }

    &enter-active,
    &leave-active {
      transition-duration: 0.5;
      transition-property: opacity, transform !important;
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
        transform: scale(0.95);

        opacity: 0;
      }

      &enter-active,
      &leave-active {
        transition-duration: 0.5s;
        transition-property: opacity, transform !important;
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
