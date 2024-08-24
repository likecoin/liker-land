<template>
  <main class="w-full max-w-[960px] mx-auto mb-[48px] flex flex-col px-[16px]">
    <SettingsPageHeader
      class="pb-[24px]"
      :title="title"
      :is-show-back="isHeaderShowBack"
    />

    <NuxtChild />
  </main>
</template>

<script>
export default {
  name: 'SettingsPage',
  layout: 'default',
  head() {
    return {
      title: this.title,
    };
  },
  computed: {
    title() {
      return this.$t('main_menu_settings');
    },
    isHeaderShowBack() {
      return /^settings-.+$/.test(this.getRouteBaseName(this.$route));
    },
  },
};
</script>
