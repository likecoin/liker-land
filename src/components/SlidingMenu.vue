<template>
  <nav class="sliding-menu">
    <header
      :class="[
        'flex pt-24 pl-24 pr-16 pb-16',
        {
          'justify-end': !getUserId,
        },
      ]"
    >
      <div
        v-if="getUserId"
        class="flex items-center"
      >
        <lc-avatar
          :src="getUserInfo.avatar"
          :halo="getUserCivicLikerHalo"
          size="46"
        />
        <span
          class="text-16 ml-12"
        >{{ getUserInfo.displayName }}</span>
      </div>
      <a
        v-else
        class="btn btn--dark btn--block mx-0"
        :href="getOAuthLoginAPI()"
      >{{ $t('signInOrSignUp') }}</a>
    </header>

    <div class="flex-grow">
      <div class="pt-16 px-32">
        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'index' }"
          @click.native="onClickMenuItem"
        >{{ $t('SlidingMenu.home') }}</nuxt-link>

        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'civic' }"
          @click.native="onClickMenuItem"
        >{{ $t('SlidingMenu.civic') }}</nuxt-link>

        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'settings' }"
          @click.native="onClickMenuItem"
        >{{ $t('SlidingMenu.settings') }}</nuxt-link>
      </div>

      <div class="flex flex-col mt-24 px-48">
        <a
          class="text-white text-14"
          href="https://help.like.co"
        >{{ $t('SlidingMenu.support') }}</a>
      </div>
    </div>

    <div class="flex flex-col mt-48 p-48">
      <button
        v-for="locale in locales"
        :key="locale"
        class="text-white text-left text-12 font-200"
        @click="onClickLocale(locale)"
      >{{ $t(`Locale.${locale}`) }}</button>
    </div>

    <portal-target name="floating-page-header-container" />
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getOAuthLoginAPI } from '~/util/api';

export default {
  name: 'SlidingMenu',
  computed: {
    ...mapGetters([
      'getUserId',
      'getUserInfo',
      'getUserCivicLikerHalo',
      'getLocale',
      'getAvailableLocales',
    ]),

    locales() {
      return this.getAvailableLocales.filter(
        locale => locale !== this.getLocale
      );
    },
  },
  methods: {
    getOAuthLoginAPI,

    ...mapActions(['toggleSlidingMenu', 'setLocale']),

    onClickMenuItem() {
      this.toggleSlidingMenu(false);
    },
    onClickLocale(locale) {
      this.$i18n.locale = locale;
      this.setLocale(locale);
      this.toggleSlidingMenu(false);
    },
  },
};
</script>

<style lang="scss">
$sliding-menu-width: 256px;

.sliding-menu {
  left: 100%;
  z-index: 100;

  width: $sliding-menu-width;

  @apply fixed;
  @apply pin-t;

  @apply text-white;
  @apply bg-like-green;

  @apply flex;
  @apply flex-col;

  @apply h-screen;

  // Handle the elements have to translate when sliding menu is opened
  &,
  &-pushee {
    transition-duration: 0.25s;
    transition-timing-function: ease;

    html[sliding-menu='opened'] & {
      transform: translateX(-#{$sliding-menu-width});
    }
  }
  & {
    transition-property: transform, outline-width;

    outline-style: solid;
    outline-color: config('colors.like-green');
    outline-width: 0;

    // Hacking hairline issue when transforming
    html[sliding-menu='opened'] & {
      outline-width: 1px;
    }
  }
  &-pushee {
    transition-property: transform;
  }
}

// Prevent scrolling when sliding menu is opened
html[sliding-menu='opened'] {
  overflow-y: hidden;
}
</style>
