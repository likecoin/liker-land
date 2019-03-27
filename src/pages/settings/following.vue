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
  @apply rounded;

  @apply bg-white;

  @apply pb-24;

  .tab-bar {
    @apply mb-24;

    .tab-bar-item-button__content {
      @apply py-16;
    }
  }
}
</style>
