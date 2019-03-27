<template>
  <div class="page-layout page-layout--dialog">
    <div class="page-wrapper">
      <nuxt class="page-content" />
    </div>
  </div>
</template>

<style lang="scss">
.page-layout--dialog {
  @apply bg-like-green;

  .page-wrapper {
    @apply flex;
    @apply justify-center;
    @apply items-center;

    @apply px-16;
  }

  .page-content {
    @apply flex-no-grow;

    @apply text-like-green;
    @apply text-center;

    @apply bg-white;

    @apply rounded;

    @apply mb-32;
    @apply p-24;

    @apply w-full;
    @apply max-w-phone;
  }
}
</style>
