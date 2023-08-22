<template>
  <div ref="root" class="px-[2rem] py-[5rem] laptop:py-[9rem]">
    <div class="flex flex-col gap-[3rem] items-center max-w-[540px] w-full mx-auto text-center">
      <h3 class="text-[2rem] laptop:text-[2.75rem] text-black font-proxima font-[600]">{{ heading }}</h3>
      <slot name="image" />

      <p>{{ content }}</p>

      <slot name="append" />

    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPageHeadingContentWithCTA',
  props: {
    heading: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
};
</script>
