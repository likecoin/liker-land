<template lang="pug">
  .dialog-container
    FirstTimeSignInDialog

</template>

<script>
import FirstTimeSignInDialog from '~/components/FirstTimeSignInDialog';

export default {
  name: 'PopupContainer',
  components: {
    FirstTimeSignInDialog,
  },
};
</script>
