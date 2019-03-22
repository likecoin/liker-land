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
      >Sign up / Sign in</a>
    </header>

    <div>
      <div class="pt-16 px-32">
        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'index' }"
          @click.native="onClickMenuItem"
        >Home</nuxt-link>

        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'civic' }"
          @click.native="onClickMenuItem"
        >Civic Liker</nuxt-link>

        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'settings' }"
          @click.native="onClickMenuItem"
        >Settings</nuxt-link>
      </div>

      <div class="flex flex-col mt-24 px-48">
        <a
          class="text-white text-14"
          href="https://help.like.co"
        >Support</a>
      </div>
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
    ...mapGetters(['getUserId', 'getUserInfo', 'getUserCivicLikerHalo']),
  },
  methods: {
    getOAuthLoginAPI,

    ...mapActions(['toggleSlidingMenu']),

    onClickMenuItem() {
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
