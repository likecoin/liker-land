<template>
  <Page class="max-w-[960px] mx-auto pb-[120px]">
    <h1 class="text-like-green text-[24px] font-[600] mb-[24px]">{{ $t('terms_of_service_title') }}</h1>
    <NuxtContent :document="content" />
  </Page>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const content = await $content('terms-of-service').fetch();
    return { content };
  },
};
</script>
