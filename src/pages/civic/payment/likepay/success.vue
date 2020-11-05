<template>
  <div class="payment-success-page">
    <template v-if="isLoading">
      <LcLoadingIndicator class="text-like-cyan mx-auto" />
    </template>
    <div v-else>
      <transition
        name="payment-success-page-hero-"
        appear
      >
        <div class="payment-success-page-hero">
          <RadialBlastGraph class="payment-success-page-hero__bg" />

          <div class="payment-success-page-hero__avatar">
            <lc-avatar
              :src="getUserInfo.avatar"
              size="144"
              halo="civic-liker"
            />
          </div>
        </div>
      </transition>

      <div class="payment-success-page-receipt">
        <div class="payment-success-page-receipt__header bg-like-gradient">
          <TickIcon
            class="w-48 h-48 text-like-cyan fill-current"
          />
          <div class="text-like-green">
            {{ $t('PaymentSuccessPage.heading') }}
          </div>
        </div>
        <div class="payment-success-page-receipt__body">
          <p>{{ $t('PaymentSuccessPage.body') }}</p>

          <div class="mt-24 phone:mx-32 laptop:mx-64 desktop:mx-64">
            <a
              v-if="isPopup"
              href="#"
              class="btn btn--outlined btn--block max-w-3 laptop:max-w-2/3 desktop:max-w-2/3 mx-auto my-0 "
              @click.prevent="onClickClose"
            > {{ getCloseButtonText }}</a>
            <NuxtLink
              v-else
              class="btn btn--outlined btn--block max-w-3 laptop:max-w-2/3 desktop:max-w-2/3 mx-auto my-0 "
              :to="getHomeRoute"
            > {{ $t('PaymentSuccessPage.continue') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { getLikePayPaymentAPI } from '@/util/api';
import { logTrackerEvent } from '~/util/EventLogger';

import RadialBlastGraph from '~/assets/images/civic/radial-blast.svg';
import TickIcon from '~/assets/icons/tick.svg';

const parse = require('url-parse');

export default {
  components: {
    RadialBlastGraph,
    TickIcon,
  },
  data() {
    return {
      isLoading: true,
      isPopup: '',
    };
  },
  middleware: 'authenticated',
  computed: {
    ...mapGetters(['getUserInfo', 'getHomeRoute']),
    getCloseButtonText() {
      if (this.isPopup && this.isPopup !== '1') {
        try {
          const { hostname } = parse(this.isPopup);
          if (hostname) {
            return this.$t('PaymentSuccessPage.backToPreviousSite', {
              hostname,
            });
          }
        } catch (err) {
          console.error(err); // eslint-disable-line no-console
        }
      }
      return this.$t('PaymentSuccessPage.backToPrevious');
    },
  },
  head() {
    return {
      title: this.$t('PaymentSuccessPage.title'),
    };
  },
  async mounted() {
    let referrer;
    let utmSource;
    let isPopup;
    this.isLoading = true;
    logTrackerEvent(
      this,
      'Civic',
      'CivicPaymentSuccess',
      'CivicPaymentSuccess(likepay)',
      1
    );
    if (window.sessionStorage) {
      utmSource = window.sessionStorage.getItem('civicLikerUtmSource');
      isPopup = window.sessionStorage.getItem('civicLikerIsPopup');
      if (isPopup) this.isPopup = isPopup;
    }
    const { state, remarks, tx_hash: txHash, ...queries } = this.$route.query;
    try {
      if (state) ({ referrer } = JSON.parse(state));
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
    try {
      await this.$api.$post(getLikePayPaymentAPI(), {
        txHash,
        remarks,
        referrer,
        utmSource,
        ...queries,
      });
      this.setUserCivicLiker();
      this.isLoading = false;
      logTrackerEvent(
        this,
        'Civic',
        'CivicRegisterComplete',
        'CivicRegisterComplete(likepay)',
        1
      );
      if (!this.isPopup) {
        setTimeout(() => {
          this.$router.push({
            name: 'index',
          });
        }, 3000);
      }
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      this.$router.push({
        name: 'civic-payment-likepay-fail',
      });
    }
  },
  methods: {
    ...mapActions(['setUserCivicLiker']),
    onClickClose() {
      if (window.sessionStorage) {
        window.sessionStorage.removeItem('civicLikerIsPopUp');
      }
      window.close();
      /* HACK: Don't stuck user if close didn't work */
      setTimeout(() => {
        this.$router.push({
          name: 'index',
        });
      }, 3000);
    },
  },
};
</script>

<style lang="scss">
.payment-success-page {
  @apply bg-gray-f7;

  @apply items-center;

  > div {
    @apply w-full;
    @apply max-w-phone;
  }

  &-hero {
    padding-top: 60%;

    @apply relative;
    @apply overflow-hidden;

    @apply max-w-phone;
    @apply w-full;

    &__bg {
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);

      @apply absolute;
    }

    &__avatar {
      @apply absolute;
      @apply pin;

      @apply flex;
      @apply justify-center;
      @apply items-center;
    }

    &__header {
      @apply p-8;
    }
  }

  &-receipt {
    @apply relative;
    @apply z-10;
    @apply overflow-hidden;
    @apply rounded;

    @apply bg-white;

    @apply mx-24;

    &__header {
      @apply text-16;
      @apply text-center;

      @apply pt-16 px-24 pb-8;
    }

    &__body {
      @apply text-gray-4a;
      @apply text-12;

      @apply p-32;
      @apply pt-16;

      > p {
        @apply leading-2;
      }
    }
  }
}
</style>
