<template>
  <component :is="tag" :class="rootClasses" v-bind="attrs" v-on="$listeners">
    <slot />
    <IconNorthEast v-if="href" class="ml-[4px] self-center shrink-0" />
  </component>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Link extends Vue {
  // Equivalent to `to` of `<NuxtLink/>`
  @Prop({ default: null })
  readonly to: object | null | undefined;

  @Prop(String)
  readonly href: string | undefined;

  @Prop({ default: false })
  readonly isInline!: boolean;

  @Prop({ default: false })
  readonly ugc!: boolean;

  @Prop({ default: false })
  readonly nofollow!: boolean;

  @Prop({ default: false })
  readonly noreferrer!: boolean;

  get tag() {
    if (this.to) return 'NuxtLink';
    return 'a';
  }

  get attrs() {
    if (this.to) return { to: this.to };
    if (this.href) {
      const rel = ['noopener'];
      if (this.ugc) rel.push('ugc');
      if (this.nofollow) rel.push('nofollow');
      if (this.noreferrer) rel.push('noreferrer');
      return {
        href: this.href,
        target: '_blank',
        rel: rel.join(' '),
      };
    }
    return {};
  }

  get rel() {
    if (this.href) return 'noopener';
    return null;
  }

  get rootClasses() {
    return [
      this.isInline ? 'inline-flex' : 'flex',
      'flex-row',
      'text-[16px]',
      'font-normal',
      'text-like-green',
      'leading-[22px]',
      'underline',
      'cursor-pointer',
    ];
  }
}
</script>
