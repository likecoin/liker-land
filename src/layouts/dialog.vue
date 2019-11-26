<template>
  <DialogLayout>
    <template #body>
      <nuxt class="page-content" />
      <SmartAppBanner />
    </template>
  </DialogLayout>
</template>

<script>
import DialogLayout from '~/components/DialogLayout';
import SmartAppBanner from '~/components/SmartAppBanner';

export default {
  components: {
    DialogLayout,
    SmartAppBanner,
  },
};
</script>
