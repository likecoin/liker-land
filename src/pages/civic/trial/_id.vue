<template lang="pug">
  DialogLayout.civic-liker-trial-page
    template(#page-wrapper)
      Transition(
        name="page-wrapper-"
        mode="out-in"
      )
        .page-wrapper(:key="isJoined.toString()")
          header.page-header
            LcAvatar(
              v-if="isJoined"
              :src="resizedAuthorAvatarSrc"
              halo="civic-liker"
              size="148"
            )
            LcChopCivicLiker(
              v-else
              size="148"
              rotate-z="16"
              is-trial
            )

            .text-30.font-600.text-like-brown
              template(v-if="isJoined") {{ $t('CivicLikerTrialPage.thankYou') }}
              template(v-else) {{ $t('CivicLikerTrialPage.joining') }}

            .text-48.font-200.text-like-brown {{ $t('CivicLikerTrialPage.title') }}

          main.page-content
            // - Joined
            template(v-if="isJoined")
              .chop-art
                LcChopCivicLiker(
                  rotate-z="16"
                  is-trial
                )
                LcChopSimple(
                  size="210"
                  text="APPROVED"
                  rotate-z="-6"
                  is-trial
                )

              .my-32
                | {{ $t('CivicLikerTrialPage.subscriptionPeriod', { start, end }) }}

              div
                button.btn(@click="$router.replace({ name: 'settings-civic' })")
                  | {{ $t('ok') }}
                br
                button.btn.mt-0(@click="$router.replace({ name: 'civic' })")
                  | {{ $t('learnMore') }}

            // - Joining
            template(v-else)
              LcLoadingIndicator.mx-auto

              div.py-16
                button.btn(@click="$router.push({ name: 'civic' })") {{ $t('back') }}
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import DialogLayout from '~/components/DialogLayout';

import {
  getCivicLikerTrialEventByIdAPI,
  getCivicLikerJoinTrialEventByIdAPI,
  getImageResizeAPI,
} from '~/util/api';

export default {
  layout: 'empty',
  components: {
    DialogLayout,
  },
  data() {
    return {
      start: undefined,
      end: undefined,
    };
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    isJoined() {
      return (
        this.start ||
        this.getUserInfo.isSubscribedCivicLiker ||
        this.getUserInfo.isCivicLikerTrial ||
        false
      );
    },
    eventId() {
      return this.$route.params.id;
    },
    authorAvatarSrc() {
      return this.getUserInfo.avatar;
    },
    resizedAuthorAvatarSrc() {
      if (!this.authorAvatarSrc) return undefined;
      return getImageResizeAPI(this.authorAvatarSrc, { width: 148 });
    },
  },
  async asyncData({ error, route, store, $axios }) {
    const {
      isSubscribedCivicLiker,
      isCivicLikerTrial,
    } = store.getters.getUserInfo;

    if (isSubscribedCivicLiker) {
      return error({
        statusCode: 409,
        message: 'CIVIC_LIKER_ALREADY_PAID',
      });
    }
    if (isCivicLikerTrial) {
      return error({
        statusCode: 409,
        message: 'CIVIC_LIKER_TRIAL_EVENT_JOINED',
      });
    }

    try {
      await $axios.$get(getCivicLikerTrialEventByIdAPI(route.params.id));
      return {};
    } catch (err) {
      switch (err.response.status) {
        case 410:
          return error({
            statusCode: 410,
            message: 'CIVIC_LIKER_TRIAL_EVENT_EXPIRED',
          });

        case 404:
        default:
          return error({
            statusCode: 404,
            message: 'CIVIC_LIKER_TRIAL_EVENT_NOT_EXIST',
          });
      }
    }
  },
  middleware: 'authenticated',
  async mounted() {
    if (this.error) return;

    try {
      const { start, end } = await this.joinCivicLikerTrialEvent(this.eventId);
      this.start = dateFormat(new Date(start), 'YYYY.MM.DD');
      this.end = dateFormat(new Date(end), 'YYYY.MM.DD');
    } catch (err) {
      const statusCode = err.response.status;
      switch (statusCode) {
        case 404:
          this.$nuxt.error({
            statusCode,
            message: 'CIVIC_LIKER_TRIAL_EVENT_NOT_EXIST',
          });
          break;
        case 409:
          this.$nuxt.error({
            statusCode,
            message: 'CIVIC_LIKER_TRIAL_EVENT_JOINED',
          });
          break;
        case 410:
          this.$nuxt.error({
            statusCode,
            message: 'CIVIC_LIKER_TRIAL_EVENT_EXPIRED',
          });
          break;
        default:
          this.$nuxt.error({
            statusCode: 400,
            message: 'CIVIC_LIKER_TRIAL_EVENT_UNKNOWN',
          });
      }
    }
  },
  methods: {
    ...mapActions(['fetchLoginStatus']),

    async joinCivicLikerTrialEvent() {
      const data = await this.$axios.$post(
        getCivicLikerJoinTrialEventByIdAPI(this.eventId)
      );
      await this.fetchLoginStatus();
      return data;
    },
  },
};
</script>

<style lang="scss">
.civic-liker-trial-page {
  perspective: 2000px;

  .page-wrapper-- {
    &enter {
      transform: translateZ(-250px) rotateY(-90deg);
    }
    &leave-to {
      transform: translateZ(-250px) rotateY(90deg);

      @apply pointer-events-none;
    }
    &enter,
    &leave-to {
      @apply opacity-0;
    }

    &enter-active,
    &leave-active {
      transition-duration: 0.5s;
      transition-property: opacity, transform !important;
    }
    &enter-active {
      transition-timing-function: ease-out;
    }
    &leave-active {
      transition-timing-function: ease-in;
    }
  }

  .page-header {
    margin-top: 120px;

    @apply px-16;
    @apply pb-32;

    .lc-avatar,
    .lc-chop-civic-liker {
      margin-top: -120px;

      @apply mb-16;
    }
  }

  .chop-art {
    @apply text-center;

    .lc-chop-simple {
      @media screen and (min-width: 401px) {
        @apply -ml-48;
      }

      @media screen and (max-width: 400px) {
        @apply -mt-32;
      }
    }
  }
}
</style>
