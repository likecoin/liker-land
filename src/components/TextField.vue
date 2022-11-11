<template>
  <div class="flex flex-col">
    <component
      :is="tag"
      ref="input"
      v-bind="inputProps"
      @input="$emit('input', $event.target.value)"
      @blur="$emit('delete-empty-field')"
    ><template v-if="isTextarea && value">{{ value }}</template></component>
    <span :class="errorMsgClasses">{{ errorMessage }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class TextField extends Vue {
  @Prop(String)
  readonly value!: string | undefined;

  @Prop(String)
  readonly placeholder!: string | undefined;

  @Prop({ default: 44 })
  readonly size!: number;

  @Prop(String)
  readonly errorMessage!: string | undefined;

  @Prop({ default: false })
  readonly isDisabled!: boolean;

  @Prop({ default: false })
  readonly isTextarea!: boolean;

  static presetClasses: Array<string> = [
    'py-[12px]',
    'px-[16px]',
    'w-full',
    'min-w-[200px]',
    'bg-shade-gray',
    'rounded-[12px]',
    'border-2',
    'border-shade-gray',
    'outline-none',
    'text-[16px]',
    'text-dark-gray',
    'focus:border-like-cyan',
    'hover:border-like-cyan-light',
  ];

  get tag(): any {
    if (this.isTextarea) return 'textarea';
    return 'input';
  }

  get inputProps() {
    const props: any = {
      class: this.rootClasses,
      placeholder: this.placeholder,
      ...this.$attrs,
    };
    if (this.isTextarea) {
      props.rows = 4;
    } else {
      props.value = this.value;
    }
    return props;
  }

  get rootClasses(): any {
    return [
      TextField.presetClasses,
      'bg-white',
      this.isTextarea ? 'font-600 resize-none' : this.sizeClasses,
      this.errorClasses,
      {
        'pointer-events-none': this.isDisabled,
      },
    ];
  }

  get sizeClasses(): any {
    switch (this.size) {
      case 44:
        return ['h-44px', 'font-600'];

      case 40:
        return ['h-40px', 'font-normal'];

      default:
        return [];
    }
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
}
</script>
