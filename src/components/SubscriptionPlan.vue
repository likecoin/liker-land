<template>
  <CardV2 class="flex flex-col gap-[12px] pb-[42px]">
    <Label preset="h4" align="center">
      {{ name }}
    </Label>

    <div class="flex items-start justify-center gap-[8px] text-dark-gray">
      <IconPrice />
     <span class="text-[24px] font-600"> {{ price }}</span>
    </div>

    <div v-if="canFreeCollect">
      <Label preset="h6" class="text-like-cyan-dark" align="center">
        Can collect free WNFT
      </Label>
    </div>
    <div class="flex w-full">
      <ButtonV2 class="w-full" preset="primary" text="Join" @click="onClickSubscribe" />
    </div>
    <div class="px-[16px] mt-[8px]">
      <Markdown :md-string="description" />
    </div>
  </CardV2>
</template>

<script>
export default {
  name: 'SubScriptionPlan',
  props: {
    name: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    canFreeCollect: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClickSubscribe() {
      this.$emit('click-subscription');
    },
  },
};
</script>
