<template>
  <component :is="tag" class="text-like-cyan-gray text-10">
    <template v-if="text">{{ text }}</template
    ><slot v-else />
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    text: {
      type: String,
      default: '',
    },
  },
};
</script>
