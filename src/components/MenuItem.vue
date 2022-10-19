<template>
  <div
    :class="[
      'p-[4px]',
      'transition',
      'duration-100',
      'cursor-pointer',
      {'text-like-green': value === selectedValue},
      'hover:text-medium-gray',
      'active:text-like-green',
    ]"
    @click="handleSelectItem(value)"
  >
    <Label
      class="py-[16px]"
      :align="labelAlign"
    >
      <template #prepend>
        <slot name="label-prepend" />
      </template>
      <template #append>
        <slot name="label-append" />
      </template>
      <span>{{ label }}</span>
    </Label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
  @Prop(String)
  readonly value: string | undefined;

  @Prop(String)
  readonly label: string | undefined;

  @Prop(String)
  readonly selectedValue: string | undefined;

  @Prop({ default: 'center' })
  readonly labelAlign!: string;

  handleSelectItem(value: string) {
    this.$emit('select', value);
  }
}
</script>
