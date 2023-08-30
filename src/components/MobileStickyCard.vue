<template>
  <div :class="rootClasses">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'MobileStickyCard',
  props: {
    isSticky: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    rootClasses() {
      if (!this.isSticky) {
        return null;
      }
      return [
        'sticky laptop:relative',
        'bottom-0',
        'w-full',
        'phone:mt-[4px] tablet:mt-[4px]',
        'phone:px-[1rem] tablet:px-[1rem]',
        'phone:py-[1.5rem] tablet:py-[1.5rem]',
        'shadow-[0_-4px_10px_0_rgba(0,0,0,0.1)] laptop:shadow-none',
        'bg-white laptop:bg-transparent',
      ];
    },
  },
};
</script>
