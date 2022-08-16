<template>
  <div
    v-if="isOpenOptions && options.length"
    class="
        min-w-[150px]
        w-auto
        absolute
        right-0
        top-full
        bg-white
        border-shade-gray border-[1px]
        rounded-[24px]
        text-dark-gray text-left
        mt-[8px]
        p-[12px]
        z-10
      "
  >
    <div v-if="$slots.header" @click="handleClickHeader">
      <slot name="header" />
    </div>
    <div
      v-for="(option, i) of options"
      :key="option.value"
      :class="[
        'pt-[4px]',
        'pl-[4px]',
        'pr-[4px]',
        'transition',
        'duration-100',
        'cursor-pointer',
        {'text-like-green': option.name === defaultValue},
        'hover:text-medium-gray',
        'active:text-like-green'
      ]"
      @click="handleSelectValue(option.value)"
    >
      <Label class="py-[16px]">
        <template #prepend>
          <AppHeaderMenuIcons :type="option.value" />
        </template>
        {{ option.name }}
      </Label>
      <div v-if="i !== options.length - 1" class="w-full h-[1px] bg-shade-gray" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, ModelSync } from 'vue-property-decorator';

@Component
export default class CustomOption extends Vue {
  @ModelSync('open', 'toggle', { type: Boolean, default: false })
  isOpenOptions!: boolean;

  @Prop({ default: () => [] })
  readonly options: Array<string> | undefined;

  @Prop(String)
  readonly defaultValue: string | undefined;

  handleClickHeader() {
    this.$emit('clickHeader');
  }

  handleSelectValue(value: string) {
    this.isOpenOptions = false;
    this.$emit('onChange', value);
  }
}
</script>
