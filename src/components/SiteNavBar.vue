<template>
  <div class="site-nav-bar">
    <NuxtLink
      :class="{
        'site-logo site-nav-bar__logo': true,
        'site-logo--disabled': getHomeRoute.name === $route.name,
      }"
      :to="getHomeRoute"
    >
      <Logo />
    </NuxtLink>


    <div class="flex items-center">
      <div
        v-if="!getUserId"
        class="relative overflow-hidden leading-0"
      >
        <GlobeIcon class="w-20 h-20 fill-current mr-16" />
        <select
          class="absolute pin-y pin-r opacity-0"
          :value="getLocale"
          @change="onChangeLocale"
        >
          <option
            v-for="locale in getAvailableLocales"
            :key="locale"
            :value="locale"
          >{{ $t(`Locale.${locale}`) }}</option>
        </select>
      </div>

      <button
        class="site-nav-bar__menu-button sliding-menu-toggle"
        @click="toggleSlidingMenu(!getIsSlidingMenuOpen)"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'SiteNavBar',
  components: {
    Logo: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/logo.svg'),
    GlobeIcon: () =>
      import(/* webpackChunkName: "svg-app" */ '~/assets/icons/globe.svg'),
  },
  computed: {
    ...mapGetters([
      'getHomeRoute',
      'getUserId',
      'getIsSlidingMenuOpen',
      'getAvailableLocales',
      'getLocale',
    ]),
  },
  methods: {
    ...mapActions(['toggleSlidingMenu', 'updatePreferences']),
    onChangeLocale(event) {
      const { value: locale } = event.target;
      this.$i18n.locale = locale;
      this.updatePreferences({ locale });
    },
  },
};
</script>

<style lang="scss">
.site-nav-bar {
  @apply flex;
  @apply items-center;
  @apply justify-between;

  @apply px-16 py-12;

  &__menu-button {
    transition-property: transform, opacity;
    transition-duration: 0.2s;
    transition-timing-function: ease;

    &:hover {
      opacity: 0.6;
    }
    &:active {
      transform: scale(0.9);

      opacity: 0.3;
    }
  }

  &__logo {
    @apply text-inherit-color;
  }

  &__menu-button {
    @apply block;
    @apply relative;

    @apply text-inherit-color;

    @apply flex;
    @apply items-center;
    @apply justify-center;

    @apply w-32;
    @apply h-32;

    > span {
      width: calc(100% - 0.5em);

      background: currentColor;

      transition-duration: 0.25s;
      transition-timing-function: ease-in-out;

      @apply absolute;

      @apply h-2;

      &:nth-child(1),
      &:nth-child(3) {
        transition-property: transform;
        will-change: transform;
      }

      &:nth-child(1) {
        transform: translateY(0.5em);
      }

      &:nth-child(2) {
        transition-property: opacity;
      }

      &:nth-child(3) {
        transform: translateY(-0.5em);
      }

      // Turn the hamburger into cross
      html[sliding-menu='opened'] & {
        &:nth-child(1) {
          transform: rotateZ(45deg);
        }

        &:nth-child(2) {
          opacity: 0;
        }

        &:nth-child(3) {
          transform: rotateZ(-45deg);
        }
      }
    }
  }
}
</style>
