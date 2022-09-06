<template>
  <section class="border-t-[1px] border-shade-gray">
    <div
      class="
        bg-white
        border-[2px] border-like-green
        rounded-full
        w-[40px]
        h-[40px]
        mx-auto
        flex
        justify-center
        items-center
        -mt-[20px]
        mb-[20px]
        font-[600]
      "
    >{{ step }}</div>
    <slot />
  </section>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1,
    },
  },
};
</script>
