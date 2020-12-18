<template lang="pug">
  .creators-page.text-gray-4a.leading-1_5
    SectionHero
    SectionEasySetup.mt-40#easy-setup(
      :liker-id="getUserId"
      :display-name="getUserInfo ? getUserInfo.displayName : ''"
      :avatar-url="getUserInfo ? getUserInfo.avatar : ''"
    )
    SectionTwoBirds#two-birds
    SectionCalculator#calculator
    SectionBetterWorld#better-world
    SectionPlatforms#platforms
    SectionSummary#summary
</template>

<script>
import { mapGetters } from 'vuex';

import SectionHero from './sections/Hero/Hero';
import SectionEasySetup from './sections/EasySetup/EasySetup';
import SectionTwoBirds from './sections/TwoBirds/TwoBirds';
import SectionCalculator from './sections/Calculator/Calculator';
import SectionBetterWorld from './sections/BetterWorld/BetterWorld';
import SectionPlatforms from './sections/Platforms/Platforms';
import SectionSummary from './sections/Summary/Summary';

export default {
  name: 'CreatorsPage',
  components: {
    SectionHero,
    SectionEasySetup,
    SectionTwoBirds,
    SectionCalculator,
    SectionBetterWorld,
    SectionPlatforms,
    SectionSummary,
  },

  computed: {
    ...mapGetters(['getUserId', 'getUserInfo']),
  },
};
</script>
