<template>
  <div :class="rootClasses">
    <div>
      <slot>
        Title
      </slot>
    </div>
    <div :class="accessoryClass">
      <slot name="accessory">
        <LazyIconArrowLeft class="w-[20px] rotate-180" />
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsListItem',
  props: {
    isClickable: {
      type: Boolean,
      default: true,
    },
    accessoryClass: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    rootClasses() {
      return [
        'flex',
        'justify-between',
        'align-center',
        'gap-[16px]',
        'px-[24px]',
        'py-[12px]',
        'bg-white',
        'text-like-green',
        'text-[16px]',
        {
          // eslint-disable-next-line standard/computed-property-even-spacing
          [[
            'hover:bg-[#fcfcfc]',
            'active:bg-[#fafafa]',
            'cursor-pointer',
            'transition-colors',
          ].join(' ')]: this.isClickable,
        },
      ];
    },
  },
};
</script>
