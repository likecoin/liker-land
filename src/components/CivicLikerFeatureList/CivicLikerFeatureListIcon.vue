<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g v-if="type === 'error'" style="color: #e35050">
      <path
        d="M23,12A11,11,0,1,1,12,1,11,11,0,0,1,23,12ZM12,6v8"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <path d="M13.5,18.47A1.5,1.5,0,1,1,12,17a1.5,1.5,0,0,1,1.5,1.5" fill="currentColor" />
    </g>
    <path
      v-else-if="type === 'active'"
      d="M18,7.5l-8,9-4-3"
      fill="none"
      stroke="#36de00"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="3"
    />
    <path
      v-else-if="type === 'inactive'"
      d="M6,12H18"
      fill="none"
      stroke="#979797"
      stroke-linecap="round"
      stroke-miterlimit="10"
      stroke-width="3"
    />
  </svg>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'inactive',
    },
  },
};
</script>
