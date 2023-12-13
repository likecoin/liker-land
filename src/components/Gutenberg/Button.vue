<template>
  <div
    :class="[
      'flex',
      'relative',
      'border-[1px]',
      'border-like-green',
      'rounded-[48px]',
      'py-[8px]',
      'px-[24px]',
      'cursor-pointer',
    ]"
    v-on="$listeners"
  >
    {{ text }}
    <div
      :class="[
        'absolute',
        'bg-shade-gray',
        'text-shade-gray',
        { '!bg-like-cyan-light !text-like-cyan-light': preset === 'primary' },
        'whitespace-nowrap',
        'top-[6px]',
        'left-[6px]',
        'rounded-[48px]',
        'py-[8px]',
        'px-[24px]',
        '-z-1',
      ]"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GutenbergButton',
  props: {
    text: {
      type: String,
      default: '',
    },
    preset: {
      type: String,
      default: 'secondary',
    },
  },
};
</script>
