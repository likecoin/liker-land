<template>
  <header class="settings-page-header">
    <SettingsIcon class="settings-page-header__icon" />
    <span>{{ $t('SettingsPage.title') }}</span>
  </header>
</template>

<script>
import SettingsIcon from '~/assets/icons/cog.svg';

export default {
  name: 'SettingsPageHeader',
  components: {
    SettingsIcon,
  },
};
</script>

<style lang="scss">
.settings-page-header {
  @apply text-like-green;
  @apply text-16;
  @apply font-600;

  @apply flex;
  @apply items-center;

  @apply mb-24;
  @apply px-8;

  &__icon {
    @apply text-like-cyan;
    @apply fill-current;

    @apply mr-16;

    @apply w-40;
  }
}
</style>
