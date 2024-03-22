<template>
  <div class="flex flex-col items-start gap-[8px]">
    <div class="flex flex-row justify-start">
      <IconStepDot
        v-for="(item, index) in totalStep"
        :key="item"
        :class="[
          'mr-[16px]',
          step === index + 1 ? 'text-like-cyan' : 'text-shade-gray',
        ]"
      />
    </div>
    <span class="text-medium-gray text-[14px]">{{
      `Step ${step} / ${totalStep}`
    }}</span>
  </div>
</template>
<script>
export default {
  name: 'Stepper',
  props: {
    step: {
      type: Number,
      default: undefined,
    },
    totalStep: {
      type: Number,
      default: undefined,
    },
  },
};
</script>
