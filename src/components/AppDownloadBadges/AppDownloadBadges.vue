<template>
  <div class="app-download-badges">
    <a
      v-if="!isSingleType"
      class="phone:hidden"
      :href="url"
      target="_blank"
    ><img src="./apple.svg"></a>
    <a
      v-if="!isSingleType"
      class="phone:hidden"
      :href="url"
      target="_blank"
    ><img src="./google.svg"></a>
    <a
      :class="singleButtonClass"
      :href="url"
      target="_blank"
    >{{ $t(`AppDownloadBadges.${isStartType ? 'Start' : 'Download'}`) }}</a>
    <a
      v-if="isStartType"
      class="text-12 text-like-green hover:underline phone:inline tablet:hidden laptop:hidden"
      :href="url"
      target="_blank"
    >{{ $t('AppDownloadBadges.Download') }}</a>
  </div>
</template>

<script>
import { getAppURL } from '~/util/api';

export default {
  name: 'AppDownloadBadges',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    from: {
      type: String,
      default: '',
    },
    utmCampaign: {
      type: String,
      default: '',
    },
    utmMedium: {
      type: String,
      default: '',
    },
    utmSource: {
      type: String,
      default: '',
    },
  },
  computed: {
    url() {
      return getAppURL({
        referrer: this.from,
        utmCampaign: this.utmCampaign,
        utmSource: this.utmSource,
        utmMedium: this.utmMedium,
      });
    },
    isStartType() {
      return this.type === 'start';
    },
    isSingleType() {
      return this.type === 'single';
    },
    singleButtonClass() {
      return {
        'app-download-button rounded-8 text-like-green text-14 text-center font-400 m-8 p-12': true,
        [this.isSingleType ? 'inline' : 'phone:inline']: true,
        'tablet:hidden': !this.isSingleType,
        'laptop:hidden': !this.isSingleType,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.app-download-badges {
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 527px) {
    flex-direction: column;
  }

  a {
    margin: 5px;
  }

  .app-download-button {
    min-width: 156px;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.3);

    transition-property: background-color, box-shadow, transform;
    transition-duration: 0.2s;
    transition-timing-function: ease-in;

    @apply bg-like-cyan-light;

    &:hover {
      background-color: config('theme.colors.like-cyan');
    }

    &:active {
      box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.3);
      transform: translateX(1px) translateY(2px);

      background-color: config('theme.colors.like-cyan-dark');
    }
  }
}
</style>
