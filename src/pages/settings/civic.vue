<template>
  <main :class="rootClass">
    <CivicPricingCard
      class="mx-auto"
      :type="cardType"
    >
      <template #header>
        <div class="mt-12 mx-12">
          <NuxtLink
            :class="buttonClass"
            :to="{ name: 'civic' }"
          >{{ buttonText }}</NuxtLink>
        </div>
      </template>
    </CivicPricingCard>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';

import CivicPricingCard from '~/components/CivicPricingCard';

export default {
  components: {
    CivicPricingCard,
  },
  computed: {
    ...mapGetters(['getUserIsCivicLiker']),

    rootClass() {
      return {
        'settings-civic-page': true,
        'settings-civic-page--subscribed': !!this.getUserIsCivicLiker,
      };
    },
    cardType() {
      return this.getUserIsCivicLiker ? 'civic' : 'general';
    },
    buttonClass() {
      return {
        'btn btn--outlined btn--block m-0 w-full': true,
        'btn--disabled text-like-green border-like-green': !!this
          .getUserIsCivicLiker,
      };
    },
    buttonText() {
      return this.$t(
        `SettingsCivicPage.${
          this.getUserIsCivicLiker ? 'subscribed' : 'knowMoreAbout'
        }`
      );
    },
  },
  head() {
    return {
      title: this.$t('SettingsCivicPage.title'),
    };
  },
};
</script>

<style lang="scss">
.settings-civic-page {
  @apply p-16;
  @apply pt-0;

  &--subscribed {
    .civic-pricing-card {
      &__header {
        @apply bg-like-gradient;
      }

      &__body {
        &::before {
          @apply border-none;
        }
      }
    }
  }
}
</style>
