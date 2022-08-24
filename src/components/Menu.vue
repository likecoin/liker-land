<template>
  <div
    :class="[
      'min-w-[150px]',
      'w-auto',
      'bg-white',
      'border-shade-gray',
      'border-[1px]',
      'rounded-[24px]',
      'text-dark-gray',
      'text-left',
      'p-[12px]',
      'grid grid-cols-1',
      'divide-y',
      'divide-shade-gray'
    ]"
  >
    <slot name="prepend" />
    <div
      v-for="item of items"
      :key="item.value"
      :class="[
        'p-[4px]',
        'transition',
        'duration-100',
        'cursor-pointer',
        {'text-like-green': item.value === selectedValue},
        'hover:text-medium-gray',
        'active:text-like-green',
      ]"
      @click="handleSelectItem(item.value)"
    >
      <Label class="py-[16px]">
        <template #prepend>
          <MenuIcon :type="item.value" />
        </template>
        <span>{{ item.name }}</span>
      </Label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
  @Prop({ default: () => [] })
  readonly items: Array<string> | undefined;

  @Prop(String)
  readonly selectedValue: string | undefined;

  handleSelectItem(value: string) {
    this.$emit('select', value);
  }
}
</script>
