<template>
  <nav class="sliding-menu p-4">
    <!-- TODO -->

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
