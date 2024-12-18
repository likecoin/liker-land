<template>
  <div class="fixed inset-0 z-50 bg-black bg-opacity-[30%]">
    <div
      class="fixed left-0 bottom-0 flex flex-col items-center gap-[8px] w-full bg-white rounded-t-[16px]"
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
        <h5 class="text-[18px] font-600 text-black" v-text="title" />
      </div>
      <div class="w-full h-[1px] bg-shade-gray" />

      <div class="px-[20px] pt-[18px] pb-[24px]">
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
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>
