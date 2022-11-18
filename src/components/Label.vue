<template>
  <component
    :is="componentTag"
    v-if="isRaw"
    :class="rawClasses"
  >
    <slot />
  </component>
  <component
    :is="componentTag"
    v-else
    :class="rootClasses"
  >
    <div
      v-if="$slots.prepend"
      :class="prependWrapperClasses"
    ><slot name="prepend" /></div>
    <div
      v-if="$slots.default"
      :class="contentWrapperClasses"
    >
      <div v-if="isTruncated" class="truncate">
        <slot />
      </div>
      <slot v-else />
    </div>
    <div
      v-else
      :class="contentWrapperClasses"
    >
      <div v-if="isTruncated" class="truncate">{{ text }}</div>
      <template v-else>{{ text }}</template>
    </div>
    <div
      v-if="$slots.append"
      :class="appendWrapperClasses"
    >
      <slot name="append" />
    </div>
  </component>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

export enum LabelType {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  H7 = 'h7',
  P5 = 'p5',
  P6 = 'p6',
  P7 = 'p7',
}

export enum LabelAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

export enum LabelValign {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
}

@Component
export default class Label extends Vue {
  // Inner text of the label
  @Prop(String)
  readonly text!: string;

  // HTML tag of the label
  @Prop(String)
  readonly tag!: string;

  // Preset of the label that affects the label style
  @Prop({ default: LabelType.P5 })
  readonly preset!: LabelType;

  // Horizontal align of children
  @Prop({ default: LabelAlign.Left })
  readonly align!: LabelAlign;

  // Vertical align of children
  @Prop({ default: LabelValign.Middle })
  readonly valign!: LabelValign;

  // Class of the content wrapper
  @Prop([String, Array])
  readonly contentClass!: string | [] | undefined;

  // Class of the prepend wrapper
  @Prop([String, Array])
  readonly prependClass!: string | [] | undefined;

  // Class of the append wrapper
  @Prop([String, Array])
  readonly appendClass!: string | [] | undefined;

  // Class of the append wrapper
  @Prop({ default: false })
  readonly isRaw!: boolean;

  // Class of the append wrapper
  @Prop({ default: false })
  readonly isTruncated!: boolean;

  get isHeader(): boolean {
    return this.preset.startsWith('h');
  }

  get size(): number {
    const [, size = '0'] = [...this.preset.match(/[a-z]+(\d+)/)!];
    return parseInt(size, 10);
  }

  get componentTag(): string {
    if (this.tag) return this.tag;

    if (this.isHeader) {
      if (this.size > 6) return 'h6';
      return this.preset;
    }
    return 'div';
  }

  get rawClasses(): any {
    return [
      this.alignClass,
      this.valignClass,
      this.fontSizeClass,
      this.fontWeightClass,
      'leading-[1.35]',
    ];
  }

  get rootClasses(): any {
    return ['flex', ...this.rawClasses];
  }

  get fontSizeClass(): string {
    switch (this.preset) {
      case LabelType.H1:
        return 'text-[48px]';

      case LabelType.H2:
        return 'text-[32px]';

      case LabelType.H3:
        return 'text-[24px]';

      case LabelType.H4:
        return 'text-[20px]';

      case LabelType.H5:
      case LabelType.P5:
        return 'text-[16px]';

      case LabelType.H6:
      case LabelType.P6:
        return 'text-[14px]';

      case LabelType.H7:
        return 'text-[12px]';

      case LabelType.P7:
        return 'text-[10px]';

      default:
        return '';
    }
  }

  get fontWeightClass(): string {
    return this.isHeader ? 'font-600' : '';
  }

  get alignClass(): string {
    switch (this.align) {
      case LabelAlign.Center:
        return 'justify-center text-center';

      case LabelAlign.Right:
        return 'justify-end text-right';

      case LabelAlign.Left:
      default:
        return 'justify-start text-left';
    }
  }

  get valignClass(): string {
    switch (this.valign) {
      case LabelValign.Top:
        return 'items-start';

      case LabelValign.Bottom:
        return 'items-end';

      case LabelValign.Middle:
      default:
        return 'items-center';
    }
  }

  get contentWrapperClasses(): any {
    return [
      'flex',
      'flex-grow',
      this.valignClass,
      this.alignClass,
      this.contentClass,
      {
        truncate: this.isTruncated,
      },
    ];
  }

  get prependWrapperClasses(): any {
    return ['flex-shrink', 'mr-[12px]', this.prependClass];
  }

  get appendWrapperClasses(): any {
    return ['flex-shrink', 'ml-[12px]', this.appendClass];
  }
}
</script>
