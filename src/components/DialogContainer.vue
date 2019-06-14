<template lang="pug">
  .dialog-container
    WelcomeDialog

</template>

<script>
import WelcomeDialog from '~/components/WelcomeDialog';

export default {
  name: 'PopupContainer',
  components: {
    WelcomeDialog,
  },
};
</script>
