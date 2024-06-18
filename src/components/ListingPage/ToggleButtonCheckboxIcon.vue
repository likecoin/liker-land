<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      :class="[
        checked
          ? 'fill-like-green stroke-like-green'
          : 'fill-white stroke-shade-gray',
      ]"
      x="0.5"
      y="0.5"
      width="17"
      height="17"
      rx="3.5"
    />
    <g class="text-white group-hover:text-shade-gray">
      <path
        d="M5 9.33333L7.66667 12L13 6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'ListingPageToggleButtonCheckboxIcon',
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
