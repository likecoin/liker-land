<template>
  <main class="w-full max-w-[960px] mx-auto mb-[48px] flex flex-col px-[16px]">
    <h3
      :class="[
        'hidden desktop:block',
        'text-[28px]',
        'font-500',
        'pb-[0px] desktop:pb-[40px]',
      ]"
    >
      {{ $t('main_menu_settings') }}
    </h3>
    <SettingsPageHeader
      v-if="isHeaderShowBack"
      :is-show-back="isHeaderShowBack"
    />
    <NuxtChild />
  </main>
</template>

<script>
import SettingsPageHeader from '~/components/SettingsPageHeader';

export default {
  name: 'SettingsPage',
  components: {
    SettingsPageHeader,
  },
  layout: 'default',
  head() {
    return {
      title: this.$t('SettingsPage.title'),
    };
  },
  computed: {
    isHeaderShowBack() {
      return /^settings-.+$/.test(this.getRouteBaseName(this.$route));
    },
  },
};
</script>
