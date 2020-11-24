<template>
  <button :class="rootClass" v-on="$listeners">
    <div class="select-button__content flex-grow text-left">
      <slot />
    </div>
    <svg
      :class="tickClass"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17 13"
      width="17"
    >
      <polyline
        points="2 7 6 11 15 2"
        fill="none"
        stroke="#50e3c2"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="4"
      />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'SelectButton',
  props: {
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rootClass() {
      return [
        'select-button flex items-center px-24 py-12 border-2 rounded-12 font-500',
        this.isSelected
          ? 'select-button--selected text-like-green border-like-cyan hover:border-like-cyan-dark'
          : 'text-gray-4a border-gray-d8 hover:border-gray-9b',
      ];
    },
    tickClass() {
      return [
        'select-button__tick ml-24 flex-no-shrink',
        {
          invisible: !this.isSelected,
        },
      ];
    },
  },
};
</script>
