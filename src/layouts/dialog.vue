<template>
  <div class="page-layout page-layout--dialog">
    <div class="page-wrapper">
      <NuxtLink
        class="site-logo"
        :to="getHomeRoute"
      ><LikerLandLogo /></NuxtLink>
      <LikerLogo class="liker-logo" />
      <header class="page-header" />
      <nuxt class="page-content" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import LikerLandLogo from '~/assets/icons/logo.svg';
import LikerLogo from '~/assets/images/liker-logo.svg';

export default {
  components: {
    LikerLandLogo,
    LikerLogo,
  },
  computed: {
    ...mapGetters(['getHomeRoute']),
  },
};
</script>


<style lang="scss">
.page-layout--dialog {
  box-sizing: border-box;
  @apply px-16;
  @apply py-48;

  @apply bg-gray-f7;

  @apply min-h-screen;

  .site-logo {
    @apply mx-auto;
    @apply mb-52;
  }

  .liker-logo {
    @apply z-1;

    @apply mx-auto;
    @apply -mb-40;

    @apply w-80;
  }

  .page-wrapper {
    @apply mx-auto;

    @apply w-full;
    @apply min-h-0;
    @apply max-w-phone;
  }

  .page-header {
    @apply z-0;

    @apply rounded-t;
    @apply bg-like-gradient;

    @apply h-80;
  }

  .page-content {
    @apply flex-no-grow;

    @apply text-like-green;
    @apply text-center;

    @apply bg-white;

    @apply rounded-b;

    @apply mb-32;
    @apply p-24;
  }
}
</style>
