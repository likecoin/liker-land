<template>
  <div
    class="civic-liker-trial-page"
  >
    <div v-if="error">
      {{ error }}
    </div>
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-text-align-center">
              <lc-chop-civic-liker
                class="civic-liker-trial-logo"
                size="180"
                rotate-z="-12"
                is-trial
              />
            </div>
          </div>
        </div>

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3 lc-padding-top-48 lc-padding-bottom-32 lc-text-align-center">
            <h1 class="lc-font-size-32 lc-font-weight-600 lc-mobile">
              <template v-if="isJoined">
                {{ $t('CivicLikerTrial.thankYou') }}
                <br>
                <span class="lc-font-size-46 lc-font-weight-300 lc-mobile">
                  {{ $t('CivicLikerTrial.title') }}
                </span>
              </template>
              <template v-else>
                {{ $t('General.loading') }}
              </template>
            </h1>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">

              <template v-if="isJoined">
                <div class="chop-art">
                  <lc-chop-civic-liker
                    rotate-z="16"
                    is-trial
                  />
                  <lc-chop-approved
                    size="210"
                    rotate-z="-6"
                    is-trial
                  />
                </div>

                <div
                  :class="[
                    'lc-color-like-green lc-font-size-16 lc-font-weight-600 lc-text-align-center',
                  ]"
                >
                  {{ $t('CivicLikerTrial.subscriptionPeriod', { start, end }) }}
                </div>

                <div class="lc-button-group lc-margin-top-32">
                  <button
                    class="md-likecoin"
                    @click="checkMyStatus"
                  >{{ $t('General.button.ok') }}
                  </button><br><button
                    class="md-likecoin"
                    @click="learnMore"
                  >{{ $t('General.learnMore') }}</button>
                </div>
              </template>

              <template v-else>
                <div class="lc-button-group lc-margin-top-16">
                  <button
                    class="md-likecoin"
                    @click="$router.push({ name: 'civic' })"
                  >
                    {{ $t('General.back') }}
                  </button>
                </div>
              </template>

            </div>
          </div>
        </div>

      </section>

    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import {
  getCivicCSOnlineAPI,
  getCivicLikerTrialEventByIdAPI,
  getCivicLikerJoinTrialEventByIdAPI,
} from '@/util/api';

export default {
  data() {
    return {
      error: '',
      isCSOnline: false,
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
        this.getUserInfo.isCivicLikerTrial
      );
    },
    eventId() {
      return this.$route.params.id;
    },
  },
  async asyncData(context) {
    const { route, store, $axios } = context;
    const {
      isSubscribedCivicLiker,
      isCivicLikerTrial,
    } = store.getters.getUserInfo;

    let error = '';
    if (isSubscribedCivicLiker) {
      error = 'paid';
    } else if (isCivicLikerTrial) {
      error = 'joined';
    } else {
      try {
        await $axios.$get(getCivicLikerTrialEventByIdAPI(route.params.id));
        return {};
      } catch (err) {
        switch (err.response.status) {
          case 410:
            error = 'expired';
            break;
          case 404:
          default:
            error = 'nonexistent';
        }
      }
    }

    const { isCSOnline } = await $axios.$get(getCivicCSOnlineAPI());
    return { error, isCSOnline };
  },
  middleware: 'authenticated',
  async mounted() {
    if (this.error) return;

    try {
      const { start, end } = await this.joinCivicLikerTrialEvent(this.eventId);
      this.start = dateFormat(new Date(start), 'YYYY.MM.DD');
      this.end = dateFormat(new Date(end), 'YYYY.MM.DD');
    } catch (err) {
      switch (err.response.status) {
        case 404:
          this.error = 'nonexistent';
          break;
        case 409:
          this.error = 'joined';
          break;
        case 410:
          this.error = 'expired';
          break;
        default:
          this.error = 'unknown';
      }
    }
  },
  methods: {
    ...mapActions(['fetchLoginStatus']),
    joinCivicLikerTrialEvent() {
      const data = this.$axios.$post(
        getCivicLikerJoinTrialEventByIdAPI(this.eventId)
      );
      this.fetchLoginStatus();
      return data;
    },
    learnMore() {
      this.$router.push({ name: 'civic' });
    },
    contactUs() {
      if (this.isCSOnline && this.$intercom) {
        this.$intercom.show();
      } else {
        window.open('https://help.like.co/', '_blank');
      }
    },
  },
};
</script>
