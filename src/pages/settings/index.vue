<template>
  <ul class="settings-menu">
    <li>
      <a
        class="settings-menu__item"
        :href="likerIdSettingsURL"
        :title="$t('SettingsPage.likerId')"
        target="_blank"
        rel="noopener"
      >
        <span
          class="settings-menu__item-title"
        >{{ $t('SettingsPage.likerId') }}</span>
        <span
          class="settings-menu__item-subtitle"
        >{{ getUserId }}</span>
      </a>
    </li>
    <li>
      <NuxtLink
        class="settings-menu__item"
        :to="{ name: 'settings-civic' }"
      >
        <span
          class="settings-menu__item-title"
        >{{ $t('SettingsPage.civicLiker.title') }}</span>
        <span
          v-if="getUserIsCivicLiker"
          class="settings-menu__item-subtitle"
        >{{ $t('SettingsPage.civicLiker.subscribing') }}</span>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink
        class="settings-menu__item"
        :to="{ name: 'settings-following' }"
      >
        <span
          class="settings-menu__item-title"
        >{{ $t('SettingsPage.subscription') }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';

import { LIKE_CO_URL_BASE } from '~/constant';

export default {
  computed: {
    ...mapGetters(['getUserId', 'getUserIsCivicLiker']),

    likerIdSettingsURL() {
      return `${LIKE_CO_URL_BASE}/in/settings`;
    },
  },
};
</script>

<style lang="scss">
.settings-menu {
  @apply list-reset;

  li {
    transition-duration: 0.25s;
    transition-timing-function: ease;

    @media screen and (min-width: calc(config('screens.tablet.min') + 32px)) {
      transition-property: opacity;

      @apply bg-white;

      > * {
        @apply py-20;
      }

      &:hover {
        @apply opacity-50;
      }
      &:active {
        @apply opacity-25;
      }

      &:first-child {
        @apply rounded-t;
      }
      &:not(:first-child) {
        @apply border-t;
        @apply border-gray-e6;
      }
      &:last-child {
        @apply rounded-b;
      }
    }

    @media screen and (max-width: calc(config('screens.phone.max') + 31px)) {
      transition-property: background-color;

      @apply border-2;
      @apply border-like-cyan;
      @apply rounded-full;

      @apply mx-16;

      &:hover {
        @apply bg-like-cyan-translucent;
      }
      &:active {
        @apply bg-like-cyan-translucent-dark;
      }

      &:not(:first-child) {
        @apply mt-12;
      }
    }
  }

  &__item {
    @apply flex;
    @apply items-center;

    @apply pl-24;
    @apply pr-16;
    @apply py-12;

    &-title {
      @apply text-16;
      @apply text-like-green;
      @apply font-600;

      @apply flex-grow;
    }

    &-subtitle {
      @apply text-12;
      @apply text-gray-9b;
      @apply font-600;
    }

    &::after {
      content: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' viewBox='0 0 8.7 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m8.7 8v0c0-0.4-0.1-0.7-0.3-0.9l-6.2-6.7c-0.4-0.5-1.3-0.5-1.8-0.1-0.5 0.5-0.6 1.3-0.1 1.8l5.4 5.9-5.4 5.8c-0.5 0.5-0.4 1.3 0.1 1.8s1.3 0.4 1.8-0.1l6.2-6.7c0.2-0.1 0.3-0.4 0.3-0.8v0z' fill='%2328646E' fill-rule='evenodd'/%3E%3C/svg%3E%0A");

      @apply w-8;
      @apply h-16;

      @apply ml-12;
    }
  }
}
</style>
