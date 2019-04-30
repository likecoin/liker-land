<template lang="pug">
  main(:class="rootClass")
    LikerComparisonCard.mx-auto(:type="cardType")
      template(#header)
        .mt-12.mx-12
          NuxtLink(:class="buttonClass", :to="buttonTo") {{ buttonText }}
</template>

<script>
import { mapGetters } from 'vuex';

import LikerComparisonCard from '~/components/LikerComparisonCard';

export default {
  components: {
    LikerComparisonCard,
  },
  middleware: 'authenticated',
  computed: {
    ...mapGetters(['getUserIsCivicLikerTrial', 'getUserIsCivicLiker']),

    isSubscribed() {
      return this.getUserIsCivicLiker || this.getUserIsCivicLikerTrial;
    },
    rootClass() {
      return {
        'settings-civic-page': true,
        'settings-civic-page--subscribed': !!this.getUserIsCivicLiker,
      };
    },
    cardType() {
      return this.isSubscribed ? 'civic' : 'general';
    },
    buttonClass() {
      return {
        'btn btn--outlined btn--block m-0 w-full': true,
        'btn--disabled text-like-green border-like-green': !!this
          .getUserIsCivicLiker,
      };
    },
    buttonText() {
      if (this.getUserIsCivicLiker) {
        return this.$t('SettingsCivicPage.subscribed');
      }
      if (this.getUserIsCivicLikerTrial) {
        return this.$t('upgrade');
      }
      return this.$t('SettingsCivicPage.knowMoreAbout');
    },
    buttonTo() {
      if (this.getUserIsCivicLikerTrial) {
        return { name: 'civic-register' };
      }
      return { name: 'civic' };
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
    .liker-comparison-card {
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
