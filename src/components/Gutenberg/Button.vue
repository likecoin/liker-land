<template>
  <div
    :class="[
      'flex',
      'relative',
      'border-[1px]',
      'border-like-green',
      'border-opacity-75',
      'rounded-[48px]',
      'py-[8px]',
      'px-[24px]',
      'group',
      'cursor-pointer',
      hoverBorderClasses,
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

        hoverClasses,
        'transition',
        'duration-200',
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
  computed: {
    hoverBorderClasses() {
      return this.preset === 'primary'
        ? 'group-hover:border-opacity-50 active:border-opacity-70'
        : 'group-hover:border-opacity-50 active:border-opacity-70';
    },
    hoverClasses() {
      return this.preset === 'primary'
        ? 'group-hover:!bg-like-cyan group-hover:!text-like-cyan'
        : 'group-hover:!bg-medium-gray group-hover:!text-medium-gray ';
    },
  },
};
</script>
