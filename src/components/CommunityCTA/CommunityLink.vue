<template>
  <Button
    class="text-current !rounded-full"
    preset="primary-outline"
    target="_blank"
    rel="noopener noreferrer"
    v-bind="$attrs"
  >
    <slot />
  </Button>
</template>

<script>
import Button from '../LegacyButton/Button';

export default {
  components: {
    Button,
  },
};
</script>
