<template>
  <ButtonV2
    class="w-full border-like-cyan"
    :preset="getButtonPreset"
    v-bind="$attrs"
    :is-disabled="isDisabled"
    @click="handleClick"
  >
    <template #prepend>
      <EventModalCollectMethodIcon
        class="w-[24px] h-[24px] text-like-green"
        :type="type"
      />
    </template>
    <span class="w-full text-left font-600">{{ title }}</span>
    <template v-if="price" #append>
      <div class="flex items-center justify-end gap-[4px]">
        <span class="text-like-green font-600 text-[12px] text-right">
          <!-- This value is from formattedNFTPriceInLIKE -->
          {{ price }}
        </span>
        <IconArrowLeft class="w-[16px] h-[16px] rotate-180" />
      </div>
    </template>
  </ButtonV2>
</template>

<script>
export default {
  name: 'EventModalCollectMethodButton',
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getButtonPreset() {
      return this.type === 'stripe' ? 'secondary' : 'outline';
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.type);
    },
  },
};
</script>
