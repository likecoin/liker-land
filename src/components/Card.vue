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

  get rootClasses() {
    return [
      'bg-white',
      'rounded-[24px]',
      {
        'px-[24px] py-[32px]': this.hasPadding,
      },
    ];
  }
}
</script>
