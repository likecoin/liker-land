<template>
  <div class="civic-page bg-gray-f7">
    <PageHeader>
      <template>
        <SiteNavBar class="text-like-green" />
      </template>
    </PageHeader>

    <main class="page-content">
      <div class="max-w-desktop w-full mx-auto">
        <img
          class="w-full"
          :src="CivicLikerHeroImage"
          alt="Civic Liker"
        >
      </div>
      <section class="max-w-desktop mx-auto -mt-24">
        <ul class="list-reset flex justify-center">
          <li
            v-for="{ type, price, paymentCycle, features } in pricing"
            :key="type"
            :class="[
              'civic-pricing-card',
              `civic-pricing-card--${type}`,
              {
                'hidden laptop:block desktop:block': type === 'generalLiker',
              },
              'm-8',
            ]"
          >
            <div class="civic-pricing-card__header">
              <div class="civic-pricing-card__type">
                {{ type }}
              </div>
              <div>
                <span class="civic-pricing-card__price">{{ price }}</span>
                <span class="civic-pricing-card__payment-cycle">{{ paymentCycle }}</span>
              </div>
              <div
                v-if="type === 'civicLiker'"
                class="mt-12 mx-12"
              >
                <button
                  class="btn btn--outlined btn--block m-0 w-full"
                  @click="onClickUpperRegister"
                >Register</button>
              </div>
            </div>
            <ul class="civic-pricing-card__body">
              <li
                v-for="[key, isEnabled] in features"
                :key="key"
                :class="[
                  'civic-pricing-card__feature',
                  {
                    'civic-pricing-card__feature--disabled': !isEnabled,
                  },
                ]"
              >
                <TickIcon class="civic-pricing-card__feature-bullet" />
                {{ key }}
              </li>
            </ul>
          </li>
        </ul>
        <div class="text-like-green text-20 leading-1_5 text-center p-24 desktop:px-32">
          Have you ever read a great story, detailed news coverage or beautiful picture on the web, wanted to micro reward it but couldn't?
        </div>
      </section>

      <section ref="visionSection">
        <div class="bg-like-gradient">
          <div class="max-w-desktop mx-auto">
            <ul class="list-reset flex flex-col desktop:flex-row items-center desktop:items-stretch p-16 desktop:px-80">
              <li class="civic-feature-card">
                <div class="civic-feature-card__header">
                  Trade a coffee for a better world
                </div>
                <div class="civic-feature-card__body">
                  <p>Have you realized creativity on the web brings no direct income, creators and civil reporters can only rely on ads, outsource projects and most importantly, enthusiasm?</p>
                  <p>Civic Liker is a movement to reward open contents. For the cost of a cup of coffee, you become a Civic Liker. Whatever you Like will then be turned into a tangible reward to creators.</p>
                </div>
              </li>

              <li class="civic-feature-card">
                <div class="civic-feature-card__header">
                  Your interest,<br>your taste
                </div>
                <div class="civic-feature-card__body">
                  <p>The US$5 paid monthly by a Civic Liker will be distributed to creators in full amount.* Which creators to support purely depends on the online contents you Like during the month, while the Foundation distributes the reward based on your taste. You may check the distribution of rewards any time down to a cent on our panel.</p>
                </div>
              </li>

              <li class="civic-feature-card">
                <div class="civic-feature-card__header">
                  Benefiting from<br>Giving
                </div>
                <div class="civic-feature-card__body">
                  <p>Other than supporting creators, Civic Likers enjoy various benefits such as taking part in community voting, accessing bonus contents, receiving newsletters from idols and joining offline events.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white flex justify-center">
          <div class="civic-pricing-card civic-pricing-card--civicLiker">
            <div class="civic-pricing-card__header">
              <div class="civic-pricing-card__type">
                {{ pricing[1].type }}
              </div>
              <div>
                <span class="civic-pricing-card__price">{{ pricing[1].price }}</span>
                <span class="civic-pricing-card__payment-cycle">{{ pricing[1].paymentCycle }}</span>
              </div>
              <div class="mt-12 mx-12">
                <button
                  ref="registerButton"
                  :class="[
                    'btn btn--outlined btn--block w-full mx-0',
                    {
                      'btn--disabled': !!getUserIsCivicLiker,
                    }
                  ]"
                  @click="onClickButton"
                >{{ registerButtonText }}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-desktop mx-auto text-gray-9b text-12 p-20 laptop:px-20 desktop:px-32 pb-64">
        <p>*Depending on the payment method a Civic Liker picks, surcharge may apply by payment channels such as credit card gateway. The full amount received by the Foundation will be converted into LikeCoin for distribution to creators, and be converted by creators into currencies of their own countries. The Foundation charge no service fee.</p>
        <p class="mt-16">Photos by Anthony Tran, Joe Gardner, KE ATLAS, Quentin Keller and Warren Wong</p>
      </section>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import PageHeader from '~/components/PageHeader';
import SiteNavBar from '~/components/SiteNavBar';

import CivicLikerHeroImage from '~/assets/images/civic/hero.png';
import TickIcon from '~/assets/icons/tick.svg';

const pricing = [
  {
    type: 'generalLiker',
    price: 'USD0.00',
    paymentCycle: 'perMonth',
    features: [
      ['ICRpool', true],
      ['ownRewardPool', false],
      ['communityVoting', false],
      ['bonusContent', false],
      ['idolNewsletter', false],
      ['offlineEvent', false],
      ['report', false],
      ['badges', false],
    ],
  },
  {
    type: 'civicLiker',
    price: 'USD5.00',
    paymentCycle: 'perMonth',
    features: [
      ['ICRpool', true],
      ['ownRewardPool', true],
      ['communityVoting', true],
      ['bonusContent', true],
      ['idolNewsletter', true],
      ['offlineEvent', true],
      ['report', true],
      ['badges', true],
    ],
  },
];

export default {
  components: {
    TickIcon,

    PageHeader,
    SiteNavBar,
  },
  data() {
    return {
      CivicLikerHeroImage,

      pricing,
    };
  },
  computed: {
    ...mapGetters(['getUserIsCivicLiker']),

    registerButtonText() {
      return this.getUserIsCivicLiker ? 'Registered' : 'Register';
    },
  },
  mounted() {
    const { from, referrer } = this.$route.query;
    if (window.sessionStorage) {
      if (from) window.sessionStorage.setItem('civicLikerFrom', from);
      if (referrer)
        window.sessionStorage.setItem('civicLikerReferrer', referrer);
    }
  },
  methods: {
    onClickUpperRegister() {
      const el = this.$refs.visionSection;
      if (!el) return;
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    },

    onClickButton() {
      this.$router.push({
        name: 'civic-register',
        query: this.$route.query,
      });
    },
  },
};
</script>

<style lang="scss">
.civic-pricing-card {
  max-width: 288px;

  @apply bg-white;

  @apply rounded;

  @apply p-24;

  @apply w-full;

  &__header {
    min-height: 124px;
  }

  &__header + &__body {
    @apply border-gray-d8;
    @apply border-t;

    @apply pt-24;
  }

  &__body {
    @apply list-reset;
  }

  &__type {
    @apply text-gray-9b;
    @apply text-14;

    @apply mb-8;

    .civic-pricing-card--civicLiker & {
      @apply text-like-green;
    }
  }

  &__price {
    @apply text-gray-4a;
    @apply text-30;
    @apply font-600;
  }

  &__payment-cycle {
    @apply text-gray-9b;
    @apply text-12;

    &::before {
      content: '/';
    }
  }

  &__feature {
    @apply text-gray-4a;

    @apply flex;
    @apply items-center;

    &:not(:first-child) {
      @apply mt-16;
    }

    &--disabled {
      @apply opacity-25;
    }

    &-bullet {
      @apply w-16;
      @apply h-16;

      @apply mr-8;

      @apply fill-current;

      .civic-pricing-card--civicLiker & {
        @apply text-like-cyan;
      }
    }
  }
}

.civic-feature-card {
  max-width: 272px;

  @apply overflow-hidden;

  @apply bg-white;

  @apply flex-1;

  @apply m-8;

  @apply rounded;

  &__header {
    @apply text-like-cyan;
    @apply text-24;
    @apply font-200;
    @apply leading-1_25;
    @apply text-center;

    @apply bg-like-green;

    @apply p-16;
  }

  &__body {
    @apply text-gray-4a;
    @apply text-14;
    @apply leading-1_5;

    @apply p-16;

    * {
      &:not(:first-child) {
        @apply mt-12;
      }
    }
  }
}
</style>
