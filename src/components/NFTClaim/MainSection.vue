<template>
  <main
    class="w-full max-w-[656px] flex flex-col justify-start items-center gap-[32px] whitespace-pre-line"
  >
    <div class="flex justify-start items-center min-h-[60px] w-full">
      <Stepper v-if="step" :step="step" :total-step="totalStep" />
      <slot name="stepper-append" />
    </div>

    <section
      class="flex flex-col items-start justify-start gap-[8px] w-full text-like-green"
    >
      <slot name="header-prepend" />
      <Label class="text-[40px] font-600" :text="headerText" />
      <slot name="header-append" />
    </section>

    <section
      class="flex flex-col justify-start items-start gap-[32px] text-dark-gray text-left font-200 text-[18px] w-full"
    >
      <p>{{ contentText }}</p>
      <slot name="content-append" />
    </section>

    <section class="flex justify-start items-start gap-[24px] w-full mt-[24px]">
      <slot name="footer" />
    </section>
  </main>
</template>

<script>
export default {
  name: 'NFTClaimMainSection',
  props: {
    step: {
      type: Number,
      default: undefined,
    },
    totalStep: {
      type: Number,
      default: undefined,
    },
    headerText: {
      type: String,
      default: undefined,
    },
    contentText: {
      type: String,
      default: undefined,
    },
  },
};
</script>
