<template>
  <div class="payment-success-page">
    <div>
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
            <NuxtLink
              class="btn btn--outlined btn--block max-w-3 laptop:max-w-2/3 desktop:max-w-2/3 mx-auto my-0 "
              :to="{ name: 'following '}"
            > {{ $t('PaymentSuccessPage.continue') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { getPayPalPaymentAPI } from '@/util/api';
import { logTrackerEvent } from '~/util/EventLogger';

import RadialBlastGraph from '~/assets/images/civic/radial-blast.svg';
import TickIcon from '~/assets/icons/tick.svg';

export default {
  components: {
    RadialBlastGraph,
    TickIcon,
  },
  data() {
    return {};
  },
  middleware: 'authenticated',
  computed: {
    ...mapGetters(['getUserInfo']),
  },
  head() {
    return {
      title: this.$t('PaymentSuccessPage.title'),
    };
  },
  async mounted() {
    let from;
    let referrer;
    logTrackerEvent(
      this,
      'Civic',
      'CivicPaymentSuccess',
      'CivicPaymentSuccess(paypal)',
      1
    );
    if (window.sessionStorage) {
      from = window.sessionStorage.getItem('civicLikerFrom');
      referrer = window.sessionStorage.getItem('civicLikerReferrer');
    }
    try {
      await this.$axios.$post(getPayPalPaymentAPI(), {
        from,
        referrer,
        ...this.$route.query,
      });
      this.setUserCivicLiker();
      logTrackerEvent(
        this,
        'Civic',
        'CivicRegisterComplete',
        'CivicRegisterComplete(paypal)',
        1
      );
      setTimeout(() => {
        this.$router.push({
          name: 'index',
        });
      }, 3000);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      throw err;
    }
  },
  methods: {
    ...mapActions(['setUserCivicLiker']),
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
