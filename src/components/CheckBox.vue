<template>
  <span>
    <label
      :class="[
        'relative',
        'flex',
        'cursor-pointer',
      ]"
    >
      <input
        :class="[
          'absolute',
          'w-0',
          'h-0',
          'opacity-0',
          'inset',
        ]"
        type="checkbox"
        :checked="value"
        @change="handleChange"
      >
      <IconCheckBoxOn
        v-if="value"
        :class="iconClass"
      />
      <IconCheckBoxOff
        v-else
        :class="iconClass"
      />
      <slot />
    </label>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class CheckBox extends Vue {
  @Prop({ default: false }) readonly value!: boolean

  get iconClass() {
    return [
      'w-[20px]',
      'w-[20px]',
      {
        'mr-[8px]': Object.keys(this.$slots).length > 0,
      },
    ]
  }

  @Emit('input')
  // eslint-disable-next-line class-methods-use-this
  handleChange(event: Event) {
    return (event?.target as HTMLInputElement)?.checked
  }
}
</script>
