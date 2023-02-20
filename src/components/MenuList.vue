<template>
  <div :class="rootClasses">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    isFlat: {
      type: Boolean,
      default: false,
    },
    hasPadding: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    rootClasses() {
      const classes = [
        'min-w-[150px]',
        'w-max',
        'text-dark-gray',
        'text-left',
        { 'p-[12px]': this.hasPadding },
        'grid grid-cols-1',
        'divide-y',
        'divide-shade-gray',
      ];

      if (!this.isFlat) {
        classes.push(
          'bg-white',
          'border-shade-gray',
          'border-[1px]',
          'rounded-[24px]'
        );
      }

      return classes;
    },
  },
};
</script>
