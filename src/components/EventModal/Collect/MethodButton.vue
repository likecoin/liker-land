<template>
  <button
    class="block w-full border-[4px] border-solid border-shade-gray hover:border-like-cyan-light active:bg-like-cyan-pale rounded-[16px] p-[24px] transition-colors cursor-pointer group"
    @click="handleClick"
  >
    <Label class="text-like-green" preset="h4">
      <template #default>{{ title }}</template>
      <template #prepend>
        <EventModalCollectMethodIcon
          class="w-[32px] h-[32px]"
          :type="type"
        />
      </template>
      <template v-if="price" #append>
        <span class="text-medium-gray font-400 text-[12px] text-right">{{ price }}</span>
      </template>
    </Label>
    <Label class="text-medium-gray mt-[8px]" preset="p6">{{ description }}</Label>
  </button>
</template>

<script>
export default {
  name: 'EventModalCollectMethodButton',
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
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
  },
  methods: {
    handleClick() {
      this.$emit('click', this.type);
    },
  },
};
</script>
