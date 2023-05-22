<template>
  <ul
    :class="[
      'flex',
      'justify-center',
      'items-center',
      'bg-shade-gray',

      'rounded-[58px]',
      'p-[4px]',
      'overflow-hidden',
    ]"
  >
    <li
      v-for="item in typeMenuItemList"
      :key="item.value"
      class="flex items-center justify-center w-full"
    >
      <div
        :class="[
          'flex',
          'flex-col',
          'justify-center',
          'items-center',

          'w-full',
          'py-[8px]',
          'rounded-[58px]',
          'cursor-pointer',
          'transition-all',
          'duration-200',

          'text-dark-gray bg-shade-gray hover:text-medium-gray',
          { '!bg-like-green text-shade-gray shadow-sm hover:text-like-cyan-gray': item.isSelected },

        ]"
        @click="$emit('on-type-click',item.value)"
      >
        <Label preset="h5" :text="item.text" align="center" />
        <!-- <p
          :class="[
            'text-center',
            'text-10',
            'text-medium-gray',
            { ' text-light-gray': item.isSelected },
          ]"
        >
          {{ amount }}
        </p> -->
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    typeMenuItemList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
