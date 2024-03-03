<template>
  <div class="flex flex-col w-full">
    <div ref="input" class="relative flex items-center">
      <input
        v-bind="inputProps"
        :value="value"
        type="number"
        @input="handleInput"
        @focus="$emit('on-focus')"
      />
      <span class="absolute right-[10px] px-[10px] text-medium-gray">{{
        fixedText
      }}</span>
    </div>
    <span :class="errorMsgClasses">{{ errorMessage }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator';

@Component
export default class TextField extends Vue {
  @Model('input', { type: [String, Number] })
  readonly value!: string | number;

  @Prop(String)
  readonly fixedText!: string | undefined;

  @Prop(String)
  readonly errorMessage!: string | undefined;

  @Prop(String)
  readonly placeholder!: string | undefined;

  static presetClasses: Array<string> = [
    'w-full',
    'py-[12px]',
    'px-[16px]',
    'rounded-[12px]',
    'border-2',
    'border-shade-gray',
    'outline-none',
    'focus:border-like-green',
    'hover:border-like-green',
    'w-full',
    'pr-[50px]',
    'pl-[18px]',
    'outline-none',
    'focus-visible:outline-none',
  ];

  get inputProps() {
    const props: any = {
      class: this.rootClasses,
      placeholder: this.placeholder,
    };
    return props;
  }

  get rootClasses(): any {
    return [
      TextField.presetClasses,
      'bg-white',
      this.errorClasses,
      { '!border-like-green': this.value },
      ['h-48px', 'font-600'],
    ];
  }

  get errorClasses(): any {
    return {
      'border-[red] focus:border-red hover:border-red': this.errorMessage,
    };
  }

  get errorMsgClasses(): any {
    return { 'pl-[8px] text-[red] text-[10px]': this.errorMessage };
  }

  focus() {
    const { input: inputEl } = this.$refs;
    if (inputEl) {
      (inputEl as any).focus();
    }
  }

  handleInput(event: Event) {
    if (!event.target) return;
    const { value } = event.target as HTMLInputElement;
    this.$emit('input', this.$attrs.type === 'number' ? Number(value) : value);
  }
}
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
