<template>
  <component
    :is="tag"
    :class="rootClasses"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Card extends Vue {
  // Tag of the card element. Default is `div`.
  @Prop({ default: 'div' })
  readonly tag!: string;

  // Has 32px padding around the card.
  @Prop({ default: true })
  readonly hasPadding!: boolean;

  @Prop({ default: false })
  readonly isDark!: boolean;

  @Prop({ default: false })
  readonly isOutline!: boolean;

  get rootClasses() {
    const classes = [
      'rounded-[24px]',
      { 'px-[24px] py-[32px]': this.hasPadding },
    ];
    if (this.isOutline) {
      classes.push('border');
      if (this.isDark) {
        classes.push('border-like-cyan-pale');
      } else {
        classes.push('border-gray-d8');
      }
    } else if (this.isDark) {
      classes.push(
        'bg-like-green bg-gradient-to-r from-transparent to-like-cyan-translucent',
        'text-like-cyan-pale'
      );
    } else {
      classes.push('bg-white');
    }
    return classes;
  }
}
</script>
