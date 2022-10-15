<template>
  <div>
    <div
      v-for="(item, i) of items"
      :key="i"
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
      <Label
        class="py-[16px]"
        :align="isShowIcon ? 'left' : 'center'"
      >
        <template #prepend>
          <slot name="label-prepend" :value="item.value" />
        </template>
        <template #append>
          <slot name="label-append" :value="item.value" />
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

  @Prop({ default: false })
  readonly isShowIcon!: boolean;

  handleSelectItem(value: string) {
    this.$emit('select', value);
  }
}
</script>
