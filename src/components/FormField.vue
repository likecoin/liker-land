<template>
  <div :class="containerClasses">
    <div v-if="label" :class="labelWrapperClasses">
      {{ label }}
    </div>
    <div v-if="$slots.default" :class="contentWrapperClasses">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class FormField extends Vue {
  // Label text of FormField
  @Prop(String)
  readonly label!: string | undefined;

  // The direction of label & contents.
  @Prop({ default: 'column' })
  readonly direction!: string | undefined;

  // Type of content.
  @Prop(String)
  readonly contentType: string | undefined;

  @Prop([String, Array])
  readonly labelClasses: string | [] | undefined;

  @Prop([String, Array])
  readonly contentClasses: string | [] | undefined;

  static direction = {
    row: 'row',
    column: 'column',
  };

  static contentTypes = {
    normal: 'normal',
    strong: 'strong',
    custom: 'custom',
  };

  get containerClasses(): any {
    return [
      'flex',
      'w-full',
      this.direction === FormField.direction.row
        ? 'flex-row items-baseline'
        : 'flex-col items-start pb-[16px]',
    ];
  }

  get labelWrapperClasses(): any {
    return [
      'flex-shrink-0',
      this.direction === FormField.direction.row ? 'pr-[8px]' : 'mb-[4px]',
      'text-[12px]',
      'font-semibold',
      'text-medium-gray',
      this.labelClasses,
    ];
  }

  get contentWrapperClasses(): any {
    return [
      this.direction === FormField.direction.row
        ? 'flex-shrink overflow-hidden'
        : 'w-full',
      'break-all',
      'text-dark-gray',
      this.contentrootClasses,
      this.contentClasses,
    ];
  }

  get contentrootClasses(): any {
    switch (this.contentType) {
      case FormField.contentTypes.normal:
        return [
          'font-normal',
          this.direction === FormField.direction.row
            ? 'text-[14px] leading-[20px]'
            : 'text-[16px] leading-[22px]',
        ];
      case FormField.contentTypes.strong:
        return ['font-semibold'];

      default:
        return [];
    }
  }
}
</script>
