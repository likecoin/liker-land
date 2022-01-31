<template>
  <nav class="sliding-menu">
    <div class="sliding-menu__content">
      <header
        :class="[
          'sliding-menu__header',
          {
            'justify-end': !getUserId,
          },
        ]"
      >
        <ClientOnly>
          <NuxtLink
            v-if="getUserId"
            :to="{ name: 'id', params: { id: getUserId } }"
            @click.native="toggleSlidingMenu(false)"
          >
            <Identity
              :avatar-size="46"
              :avatar-url="getUserInfo.avatar"
              :liker-id="getUserId"
              liker-id-class="ml-16 text-white"
              :display-name="getUserInfo.displayName"
              :is-avatar-outlined="getUserCivicLikerHalo !== 'none'"
              display-name-class="mt-4 ml-16 text-white text-20 font-600"
            />
          </NuxtLink>
          <a
            v-else
            class="mx-0 btn btn--dark btn--block"
            :href="getOAuthRegisterAPI"
            @click="onClickLogEvent('Register', 'RegisterSignInOrSignUp', 'RegisterSignInOrSignUp(sliding)', 1)"
          >{{ $t('signInOrSignUp') }}</a>
        </ClientOnly>
      </header>

      <div class="main-menu">
        <div class="main-menu__primary-menu">
          <NuxtLink
            class="btn btn--outlined btn--dark btn--block btn--icon-only"
            :to="getHomeRoute"
            :title="$t('SlidingMenu.home')"
            @click.native="onClickMenuItem"
          >
            <HomeIcon class="btn__icon" />
          </NuxtLink>

          <NuxtLink
            class="btn btn--outlined btn--dark btn--block"
            :to="{ name: getUserIsCivicLiker ? 'civic-dashboard' : 'civic' }"
            @click.native="onClickMenuItem"
          >{{ $t('SlidingMenu.civic') }}</NuxtLink>

          <NuxtLink
            class="btn btn--outlined btn--dark btn--block"
            :to="{ name: 'creators-dashboard' }"
          >{{ $t('SlidingMenu.creator') }}</NuxtLink>

          <NuxtLink
            v-if="getUserId"
            class="btn btn--outlined btn--dark btn--block btn--with-icon"
            :to="{ name: 'settings' }"
            @click.native="onClickMenuItem"
          >
            <CogIcon class="w-16 h-16 ml-12 btn__icon" />{{
              $t('SlidingMenu.settings')
            }}</NuxtLink>
        </div>

        <div class="main-menu__secondary-menu">
          <NuxtLink
            class="btn btn--plain btn--dark btn--auto-size"
            :to="{ name: 'getapp' }"
          >{{ $t('main_menu_app') }}</NuxtLink>
          <NuxtLink
            class="btn btn--plain btn--dark btn--auto-size"
            :to="{ name: 'about' }"
          >{{ $t('SlidingMenu.about') }}</NuxtLink>
          <a
            class="btn btn--plain btn--dark btn--auto-size"
            href="https://help.like.co"
            rel="noopener"
            @click="onClickSupport"
          >{{ $t('SlidingMenu.support') }} <LinkIcon class="w-12 ml-4" /></a>
          <NuxtLink
            v-if="getUserId"
            class="btn btn--plain btn--dark btn--auto-size"
            :to="{ name: 'logout' }"
          >{{ $t('SlidingMenu.logout') }}</NuxtLink>
        </div>
      </div>

      <CommunityCTA
        :class="[
          'text-like-cyan-light',
          'px-32',
          'py-24',
        ]"
      />
    </div>

    <portal-target
      class="floating-page-header-container"
      name="floating-page-header-container"
    />
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getOAuthRegisterAPI } from '~/util/api';
import { CrispMixinFactory } from '~/mixins/crisp';
import { logTrackerEvent } from '~/util/EventLogger';

import CogIcon from '~/assets/icons/cog.svg';
import HomeIcon from '~/assets/icons/home.svg';

import CommunityCTA from './CommunityCTA/CommunityCTA';
import Identity from './Identity/Identity';
import LinkIcon from './Icon/Link8';

export default {
  name: 'SlidingMenu',
  components: {
    CogIcon,
    CommunityCTA,
    HomeIcon,
    Identity,
    LinkIcon,
  },
  mixins: [CrispMixinFactory({ isBootAtMounted: false })],
  computed: {
    getOAuthRegisterAPI() {
      const { from, referrer } = this.$route.query;
      return getOAuthRegisterAPI({
        language: this.$i18n.locale,
        from,
        referrer,
      });
    },
    ...mapGetters([
      'getUserId',
      'getUserInfo',
      'getUserIsCivicLiker',
      'getUserCivicLikerHalo',
      'getHomeRoute',
    ]),
  },
  methods: {
    logTrackerEvent,

    ...mapActions(['toggleSlidingMenu']),

    onClickMenuItem() {
      this.toggleSlidingMenu(false);
    },
    onClickSupport(e) {
      if (this.$crisp) {
        this.showCrisp();
        this.$crisp.push(['do', 'chat:open']);
        e.preventDefault();
      }
    },
    onClickLogEvent(...args) {
      logTrackerEvent(this, ...args);
    },
  },
};
</script>

<style lang="scss">
$sliding-menu-width: 256px;

// Prevent scrolling when sliding menu is opened
html[sliding-menu='opened'] {
  &,
  & body {
    @apply overflow-hidden;
  }
}

.sliding-menu {
  display: flex;
  flex-direction: column;

  left: 100%;

  width: $sliding-menu-width;

  @apply fixed;
  @apply pin-t;

  @apply text-white;
  @apply bg-like-green;

  @apply flex;
  @apply flex-col;

  @apply h-screen;

  &__content {
    display: flex;
    flex-grow: 1;
    flex-direction: column;

    @apply overflow-y-scroll;
  }

  // Handle the elements have to translate when sliding menu is opened
  &,
  &-pushee {
    transition-duration: 0.25s;
    transition-timing-function: cubic-bezier(0.3, 0, 0.7, 1);

    html[sliding-menu='opened'] & {
      transform: translateX(-#{$sliding-menu-width});
    }
  }
  & {
    transition-property: transform, outline-width;

    outline-style: solid;
    outline-color: config('colors.like-green');
    outline-width: 0;

    html[sliding-menu='opened'] & {
      // Hacking hairline issue when transforming
      outline-width: 1px;

      .page-header {
        @apply pointer-events-none;
      }

      &-pushee {
        @apply pointer-events-none;

        &::after {
          content: '';

          @apply absolute;
          @apply pin;

          @apply pointer-events-auto;
        }
      }

      &-toggle {
        z-index: 9999;

        @apply pointer-events-auto;
      }
    }
  }
  &-pushee {
    transition-property: transform;
  }

  &__header {
    @apply flex;
    @apply flex-no-shrink;

    @apply pt-24;
    @apply pl-24;
    @apply pr-16;
    @apply pb-16;
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
</style>
