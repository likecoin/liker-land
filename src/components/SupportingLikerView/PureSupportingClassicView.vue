<template>
  <div :class="rootClass">
    <span :class="subtitleClass">{{ $t('supporting_classic_view_civic_liker_subtitle') }}</span>
    <CivicLikerClassicBannerSmall :class="bannerClass" />
    <span :class="nameClass">{{ $t('civic_liker_classic') }}</span>
    <Button
      class="relative mt-24"
      :preset="buttonPreset"
      :title="buttonTitle"
      :to="buttonTo"
      :full="true"
      size="small"
    >
      <template
        v-if="isActive"
        #prepend
      >
        <TickIcon class="absolute left-0 ml-8 w-16 h-16 text-success fill-current" />
      </template>
    </Button>
  </div>
</template>

<script>
import TickIcon from '../../assets/icons/tick.svg?inline';

import Button from '../LegacyButton/Button';
import CivicLikerClassicBannerSmall from '../CivicLikerClassicAssets/CivicLikerClassicBannerSmall';

export default {
  name: 'PureSupportingLikerView',
  components: {
    Button,
    CivicLikerClassicBannerSmall,
    TickIcon,
  },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    isSmall: {
      type: Boolean,
      default: false,
    },
    buttonTo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    rootClass() {
      return [
        'supporting-classic-view rounded-8 p-16 text-center flex flex-col items-center',
        this.isActive ? 'bg-white' : 'border-gray-e6 border-2',
      ];
    },
    subtitleClass() {
      return [
        'text-12 font-600',
        {
          'text-gray-9b': !this.isActive,
        },
      ];
    },
    nameClass() {
      return [
        'font-500',
        this.isSmall ? 'mt-24 text-16' : 'mt-32 text-20',
        {
          'text-gray-9b': !this.isActive,
        },
      ];
    },
    bannerClass() {
      return [
        'mt-24 mx-12',
        {
          'w-2/3': this.isSmall,
          'opacity-50': !this.isActive,
        },
      ];
    },
    buttonTitle() {
      if (this.isActive) {
        return this.$t('supporting_classic_view_button_active');
      }
      return this.$t('supporting_classic_view_button_inactive');
    },
    buttonPreset() {
      if (this.isActive) return 'special';
      return 'primary';
    },
  },
};
</script>
