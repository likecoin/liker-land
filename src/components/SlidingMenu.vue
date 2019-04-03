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

    <div class="main-menu">
      <div class="main-menu__primary-menu">
        <NuxtLink
          class="btn btn--outlined btn--dark btn--block btn--icon-only"
          :to="{ name: `index${getUserId ? '-following' : ''}` }"
          :title="$t('SlidingMenu.home')"
          @click.native="onClickMenuItem"
        >
          <HomeIcon class="btn__icon" />
        </NuxtLink>

        <NuxtLink
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'civic' }"
          @click.native="onClickMenuItem"
        >{{ $t('SlidingMenu.civic') }}</NuxtLink>

        <NuxtLink
          v-if="getUserId"
          class="btn btn--outlined btn--dark btn--block btn--with-icon"
          :to="{ name: 'settings' }"
          @click.native="onClickMenuItem"
        >
          <CogIcon class="btn__icon w-16 h-16 ml-12" />{{
            $t('SlidingMenu.settings')
          }}</NuxtLink>
      </div>

      <div class="main-menu__secondary-menu">
        <a
          class="btn btn--plain btn--dark btn--auto-size"
          href="https://help.like.co"
          @click="onClickSupport"
        >{{ $t('SlidingMenu.support') }}</a>
        <NuxtLink
          v-if="getUserId"
          class="btn btn--plain btn--dark btn--auto-size"
          :to="{ name: 'logout' }"
        >{{ $t('SlidingMenu.logout') }}</NuxtLink>
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
import { IntercomMixinFactory } from '~/mixins/intercom';

import CogIcon from '~/assets/icons/cog.svg';
import HomeIcon from '~/assets/icons/home.svg';

export default {
  name: 'SlidingMenu',
  components: {
    CogIcon,
    HomeIcon,
  },
  mixins: [IntercomMixinFactory({ isBootAtMounted: false })],
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
    onClickSupport(e) {
      if (this.$intercom) {
        if (this.bootIntercom()) {
          this.$intercom.show();
          e.preventDefault();
        }
      }
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

.main-menu {
  @apply flex-grow;

  &__primary-menu {
    @apply pt-16;
    @apply px-32;

    > * {
      &:not(:first-child) {
        @apply mt-12;
      }
    }
  }

  &__secondary-menu {
    @apply flex;
    @apply flex-col;
    @apply items-start;

    @apply mt-20;
    @apply px-48;

    > * {
      @apply text-14;
      @apply no-underline;
      @apply font-400;

      @apply p-0;
    }
  }
}

// Prevent scrolling when sliding menu is opened
html[sliding-menu='opened'] {
  overflow-y: hidden;
}
</style>
