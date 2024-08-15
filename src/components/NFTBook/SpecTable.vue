<template>
  <component :is="tag" class="flex flex-wrap gap-[1.5rem] w-full">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'ul',
    },
  },
};
</script>
