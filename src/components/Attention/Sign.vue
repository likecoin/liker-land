<template>
  <div
    :class="[
      'w-full',
      'max-w-[700px]',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'px-[44px]',
      'py-[24px]',
      'text-medium-gray',
    ]"
  >
    <div class="flex items-center">
      <IconAttention class="mr-[12px]" />
      <slot name="icon" />
    </div>
    <Label class="whitespace-pre-line text-medium-gray mt-[12px]" :text="attentionText" />
  </div>
</template>

<script>
export default {
  props: {
    attentionText: {
      type: String,
      default: undefined,
    },
  },
};
</script>
