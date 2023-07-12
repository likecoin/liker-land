<template>
  <component
    :is="tag"
    :class="rootClasses"
    :to="to || null"
    :target="$attrs.href && !$attrs.target ? '_blank' : $attrs.target"
    v-bind="rootProps"
    v-on="$listeners"
  >
    <Label
      :class="labelClass"
      :text="text"
      :content-class="contentClass"
      :prepend-class="prependClass"
      :append-class="appendClass"
      :preset="textPreset"
      :tag="labelTag"
      align="center"
    >
      <template
        v-if="shouldShowPrepend"
        #prepend
      >
        <slot name="prepend" />
      </template>
      <slot />
      <template
        v-if="shouldShowAppend"
        #append
      >
        <slot name="append" />
      </template>
    </Label>
  </component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

// eslint-disable-next-line import/extensions
import Label from './Label.vue';

export enum Preset {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  plain = 'plain',
  outline = 'outline',
  gradient = 'gradient',
  cyan = 'cyan',
}

export enum Size {
  large = 'large',
  small = 'small',
  mini = 'mini',
}

@Component({
  components: { Label },
})
export default class ButtonV2 extends Vue {
  // Preset of the button
  @Prop({ default: 'primary' })
  readonly preset!: string;

  // Text of the button
  @Prop(String)
  readonly text!: string;

  // Disable interaction if set to true
  @Prop({ default: false })
  readonly isDisabled!: boolean;

  // Circle style if set to true
  @Prop({ default: false })
  readonly circle!: boolean;

  // Size of the Button
  @Prop({ default: 'large' })
  readonly size!: string | undefined;

  // Class of the content wrapper
  @Prop([String, Array])
  readonly contentClass!: string | [] | undefined;

  // Class of the prepend wrapper
  @Prop([String, Array])
  readonly prependClass!: string | [] | undefined;

  // Class of the append wrapper
  @Prop([String, Array])
  readonly appendClass!: string | [] | undefined;

  // Equivalent to `to` of `<NuxtLink/>`
  @Prop({ default: null })
  readonly to: object | null | undefined;

  // Preset of the label that affects the label style
  @Prop(String)
  readonly textPreset!: string | undefined;

  // HTML tag of the label
  @Prop(String)
  readonly labelTag!: string | undefined;

  get tag() {
    if (!this.isDisabled) {
      if (this.to) return 'NuxtLink';
      if (this.$attrs.href) return 'a';
    }
    return 'button';
  }

  get rootProps() {
    return {
      disabled: !!this.isDisabled,
    };
  }

  get isCircle(): any {
    return !!this.circle;
  }

  get isMini(): any {
    return this.size === 'mini';
  }

  get rootClassesForPreset(): any {
    // NOTE: Add `!` to override the [type=submit] style caused by different versions of Tailwind
    if (this.isDisabled && this.preset !== Preset.outline) {
      return ['!bg-shade-gray', 'text-medium-gray'];
    }
    switch (this.preset) {
      case Preset.primary:
        return ['!bg-like-green', 'text-like-cyan-light'];

      case Preset.secondary:
        return ['!bg-like-cyan-light', 'text-like-green'];

      case Preset.tertiary:
        return [
          '!bg-shade-gray',
          this.circle ? 'text-like-green' : 'text-dark-gray',
        ];

      case Preset.plain:
        return [];

      case Preset.outline:
        return [
          this.isDisabled
            ? '!bg-transparent border-shade-gray border-2 text-gray-c'
            : 'border-medium-gray/75 border-2',
          this.circle ? 'text-like-green' : 'text-current',
          {
            'active:border-opacity-70 hover:border-opacity-50': !this
              .isDisabled,
          },
        ];
      case Preset.gradient:
        return [
          '!bg-gradient-to-r from-[#D2F0F0] to-[#F0E6B4]',
          'text-like-green',
        ];

      case Preset.cyan:
        return ['!bg-like-cyan-pale', 'text-dark-gray'];

      default:
        return '';
    }
  }

  get classForSize(): any {
    switch (this.size) {
      case Size.large:
        return this.circle ? 'h-[64px] w-[64px]' : 'h-[44px] rounded-[10px]';

      case Size.mini:
        return this.circle ? 'h-[32px] w-[32px]' : 'h-[30px] rounded-[16px]';

      case Size.small:
      default:
        return this.circle ? 'h-[48px] w-[48px]' : 'h-[40px] rounded-[10px]';
    }
  }

  get rootClasses(): any {
    return [
      ...this.rootClassesForPreset,
      this.classForSize,
      'flex',
      'box-border',
      'overflow-hidden',
      'items-center',
      'transition',
      'duration-200',
      this.isDisabled ? 'cursor-default' : 'cursor-pointer',
      {
        'justify-center rounded-[50%]': this.isCircle,
      },
    ];
  }

  get labelClass(): any {
    return [
      this.isCircle ? 'justify-center' : 'justify-between',
      'h-full',
      'text-center',
      'whitespace-nowrap',
      'hover:bg-dark-gray',
      'hover:bg-opacity-[0.2] hover:opacity-[0.8]',
      'active:bg-opacity-[0.3]',
      'transition',
      'duration-200',
      {
        'px-[12px]': this.isMini,
        'py-[6px]': this.isMini,
        'font-600': this.isMini,
      },
      {
        'px-[16px]': !this.isCircle && !this.isMini,
        'py-[10px]': !this.isCircle && !this.isMini,
        'w-full': !this.isCircle && !this.isMini,
        'pointer-events-none': this.isDisabled,
        [this.classForSize]: this.isCircle || this.isMini,
      },
    ];
  }

  get shouldShowPrepend() {
    return !!this.$slots.prepend && !this.circle;
  }

  get shouldShowAppend() {
    return !!this.$slots.append && !this.circle;
  }
}
</script>
