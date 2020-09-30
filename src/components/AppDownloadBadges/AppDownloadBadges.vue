<template>
  <div class="app-download-badges">
    <a
      class="phone:hidden"
      :href="url"
      target="_blank"
    ><Apple /></a>
    <a
      class="phone:hidden"
      :href="url"
      target="_blank"
    ><Google /></a>
    <a
      class="button rounded-8 text-like-green text-14 text-center font-400 m-8 p-12 phone:inline tablet:hidden laptop:hidden"
      :href="url"
      target="_blank"
    >{{ $t(`AppDownloadBadges.${type === 'start' ? 'Start' : 'Download'}`) }}</a>
    <a
      v-if="type === 'start'"
      class="text-12 text-like-green hover:underline phone:inline tablet:hidden laptop:hidden"
      :href="url"
      target="_blank"
    >{{ $t('AppDownloadBadges.Download') }}</a>
  </div>
</template>

<script>
import { getAppURL } from '~/util/api';

import Apple from './apple.svg';
import Google from './google.svg';

export default {
  name: 'AppDownloadBadges',
  components: {
    Apple,
    Google,
  },
  props: {
    type: {
      type: String,
      default: 'default',
    },
    from: {
      type: String,
      default: '',
    },
  },
  computed: {
    url() {
      return getAppURL({ referrer: this.from });
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

  .button {
    min-width: 156px;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.3);

    transition-property: background-color, box-shadow, transform;
    transition-duration: 0.2s;
    transition-timing-function: ease-in;

    @apply bg-like-cyan-light;

    &:hover {
      background-color: config('colors.like-cyan');
    }

    &:active {
      box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.3);
      transform: translateX(1px) translateY(2px);

      background-color: config('colors.like-cyan-dark');
    }
  }
}
</style>
