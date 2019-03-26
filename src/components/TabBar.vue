<template>
  <div class="tab-bar">
    <div class="tab-bar__item-list-wrapper">
      <ul class="tab-bar__item-list">
        <slot />
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
};
</script>

<style lang="scss">
.tab-bar {
  @apply text-like-green;

  @apply flex;

  &::before,
  &::after {
    content: '';

    @apply bg-current;

    @apply flex-grow;
  }

  &__item-list-wrapper {
    max-width: 408px;

    // Hacking hairline issue when transforming
    margin: 0 -1px;

    @apply relative;

    @apply w-full;
  }

  &__item-list {
    @apply list-reset;

    @apply flex;
  }
}
</style>
