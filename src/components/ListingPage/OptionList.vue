<template>
  <ul :class="wrapperClass">
    <li
      v-for="(item, i) in itemList"
      :key="i"
      class="flex items-center cursor-pointer"
    >
      <MenuButton
        :text="item.text"
        :is-selected="item.isSelected"
        @click="item.handleClick"
      />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'OptionList',
  props: {
    itemList: {
      type: Array,
      default: () => [],
    },
    wrapperClass: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
