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

  get rootClasses() {
    return [
      this.isDark
        ? 'bg-like-green bg-gradient-to-r from-transparent to-like-cyan-translucent'
        : 'bg-white',
      'rounded-[24px]',
      {
        'text-like-cyan-pale': this.isDark,
        'px-[24px] py-[32px]': this.hasPadding,
      },
    ];
  }
}
</script>
