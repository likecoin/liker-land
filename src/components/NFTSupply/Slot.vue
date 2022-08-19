<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      v-if="isPast"
      opacity="0.4"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.4765 12.8907C10.4957 13.5892 9.29583 14 8 14C6.70417 14 5.50428 13.5892 4.52347 12.8907L8 9.41421L11.4765 12.8907ZM12.8907 11.4765L9.41421 8L12.8907 4.52347C13.5892 5.50428 14 6.70417 14 8C14 9.29583 13.5892 10.4957 12.8907 11.4765ZM11.4765 3.10925L8 6.58579L4.52347 3.10925C5.50428 2.41079 6.70417 2 8 2C9.29583 2 10.4957 2.41079 11.4765 3.10925ZM3.10925 4.52347C2.41079 5.50428 2 6.70417 2 8C2 9.29583 2.41079 10.4957 3.10925 11.4765L6.58579 8L3.10925 4.52347ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8Z"
      fill="#9B9B9B"
    />
    <template v-else-if="isActive">
      <circle cx="8" cy="8" r="6.5" stroke="#AAF1E7" stroke-width="3" />
      <circle cx="8" cy="8" r="2" fill="#50E3C2" />
    </template>
    <circle
      v-else
      opacity="0.4"
      cx="8"
      cy="8"
      r="7"
      stroke="#9B9B9B"
      stroke-width="2"
    />
  </svg>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'future',
    },
  },
  computed: {
    isActive() {
      return this.type === 'active';
    },
    isPast() {
      return this.type === 'past';
    },
  },
};
</script>
