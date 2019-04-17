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
          @click="onClickLogEvent('Register', 'RegisterSignInOrSignUp', 'RegisterSignInOrSignUp(sliding)', 1)"
        >{{ $t('signInOrSignUp') }}</a>
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
            rel="noopener"
            @click="onClickSupport"
          >{{ $t('SlidingMenu.support') }}</a>
          <NuxtLink
            v-if="getUserId"
            class="btn btn--plain btn--dark btn--auto-size"
            :to="{ name: 'logout' }"
          >{{ $t('SlidingMenu.logout') }}</NuxtLink>
        </div>
      </div>
    </div>

    <portal-target
      class="floating-page-header-container"
      name="floating-page-header-container"
    />
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getOAuthLoginAPI } from '~/util/api';
import { IntercomMixinFactory } from '~/mixins/intercom';
import { logTrackerEvent } from '~/util/EventLogger';

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
      'getHomeRoute',
    ]),
  },
  methods: {
    getOAuthLoginAPI,
    logTrackerEvent,

    ...mapActions(['toggleSlidingMenu']),

    onClickMenuItem() {
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
  @apply overflow-y-hidden;
}

.sliding-menu {
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
