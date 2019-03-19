<template>
  <nav class="sliding-menu">
    <!-- TODO -->

    <div>
      <div class="pt-16 px-32">
        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'index' }"
        >Home</nuxt-link>

        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'civic' }"
        >Civic Liker</nuxt-link>

        <nuxt-link
          class="btn btn--outlined btn--dark btn--block"
          :to="{ name: 'settings' }"
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
export default {
  name: 'SlidingMenu',
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
    transition: transform 0.25s ease;

    html[sliding-menu='opened'] & {
      transform: translateX(-#{$sliding-menu-width});
    }
  }
}

// Prevent scrolling when sliding menu is opened
html[sliding-menu='opened'] {
  overflow-y: hidden;
}
</style>
