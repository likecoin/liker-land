<template>
  <ul
    :class="[
      'flex',
      'justify-between',
      'items-center',

      'w-full',
      'p-[4px]',

      'bg-white',

      'border-[1px]',
      'border-shade-gray',
      'rounded-[14px]',
    ]"
  >
    <li
      v-for="item in items"
      :key="item.value"
      class="flex items-center cursor-pointer"
    >
      <MenuButton
        :text="item.text"
        :is-selected="item.value === value"
        @click="$emit('input', item.value)"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ListingPageOptionList',
  props: {
    value: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
