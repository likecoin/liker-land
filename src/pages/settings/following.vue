<template>
  <main class="settings-following-page">
    <TabBar>
      <TabBarItem
        :is-active="$route.name === 'settings-following'"
        :to="{ name: 'settings-following' }"
      >{{ $t('SettingsFollowingPage.following') }}</TabBarItem>
      <TabBarItem
        :is-active="$route.name === 'settings-unfollowed'"
        :to="{ name: 'settings-unfollowed' }"
      >{{ $t('SettingsFollowingPage.unfollowed') }}</TabBarItem>
    </TabBar>

    <!-- :key is needed for page transition -->
    <NuxtChild :key="$route.name" />

  </main>
</template>

<script>
import TabBar from '~/components/TabBar';
import TabBarItem from '~/components/TabBarItem';

export default {
  middleware: 'authenticated',
  components: {
    TabBar,
    TabBarItem,
  },
  head() {
    return {
      title: this.$t('SettingsFollowingPage.title'),
    };
  },
};
</script>

<style lang="scss">
.settings-following-page {
  @apply overflow-hidden;
  @apply rounded-[8px];

  @apply bg-white;

  @apply mb-48;
  @apply pb-24;

  @media screen and (max-width: calc(config('theme.screens.phone.max') + 31px)) {
    @apply mx-16;
  }

  .tab-bar {
    @apply mb-24;

    .tab-bar-item-button__content {
      @apply leading-2;
    }
  }
}
</style>
