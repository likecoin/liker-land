<template>
  <SettingsPageContentWithAuth>
    <ul class="language-list-view list-view list-view--rounded">
      <li
        v-for="locale in getAvailableLocales"
        :key="locale"
        class="list-view-item"
      >
        <button
          class="list-view-item__content-view"
          @click="onClickLocale(locale)"
        >
          <span>{{ $t(`Locale.${locale}`) }}</span>
        </button>

        <div
          v-if="getLocale === locale"
          class="list-view-item__accessory-view"
        >
          <TickIcon />
        </div>
      </li>
    </ul>
  </SettingsPageContentWithAuth>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import TickIcon from '~/assets/icons/tick.svg?inline';

export default {
  components: {
    TickIcon,
  },
  computed: {
    ...mapGetters(['getAvailableLocales', 'getLocale']),
  },
  methods: {
    ...mapActions(['updatePreferences']),

    onClickLocale(locale) {
      this.updatePreferences({ locale });
    },
  },
};
</script>

<style lang="scss">
.language-list-view {
  .list-view-item {
    &__content-view {
      @apply text-gray-4a;
    }

    &__accessory-view {
      @apply flex;
      @apply justify-end;
      @apply items-center;

      @apply cursor-pointer;

      svg {
        @apply text-like-cyan;

        @apply w-24;
        @apply h-24;

        @apply fill-current;
      }
    }
  }
}
</style>
