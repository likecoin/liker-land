<template>
  <DialogLayout>
    <template #body>
      <nuxt class="page-content" />
    </template>
  </DialogLayout>
</template>

<script>
import DialogLayout from '~/components/DialogLayout';

export default {
  components: {
    DialogLayout,
  },
};
</script>
