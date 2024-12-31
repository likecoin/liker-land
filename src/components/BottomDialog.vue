<template>
  <div
    class="fixed inset-0 z-[1000001] bg-opacity-25 backdrop-filter bg-dark-gray backdrop-blur-sm"
    @click="close"
  >
    <div
      class="fixed left-0 bottom-0 flex flex-col items-center gap-[8px] w-full bg-white rounded-t-[16px]"
      @click.stop
    >
      <div class="relative w-full">
        <ButtonV2
          circle="true"
          size="small"
          preset="tertiary"
          class="absolute bottom-[12px] left-[12px]"
          @click.prevent="close"
        >
          <IconClose class="w-[20px]" />
        </ButtonV2>
      </div>

      <div
        class="flex items-center justify-center w-full pt-[12px] pb-[8px] px-[20px]"
      >
        <p class="block text-[18px] font-600 text-black" v-text="title" />
      </div>
      <div class="w-full h-[1px] bg-shade-gray" />

      <div class="px-[20px] pt-[18px] pb-[48px]">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BottomDialog',
  props: {
    title: {
      type: String,
      default: undefined,
    },
  },
  mounted() {
    // Prevent scrolling on the body when the dialog is open
    document.body.classList.add('overflow-hidden');
  },
  beforeUnmount() {
    document.body.classList.remove('overflow-hidden');
  },
  methods: {
    close() {
      this.$emit('close');
      document.body.classList.remove('overflow-hidden');
    },
  },
};
</script>
