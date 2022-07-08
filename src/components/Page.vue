<template>
  <main
    :class="[
      'flex',
      'flex-grow',
      'overflow-x-hidden',
      flexLayoutClass,
    ]"
  >
    <slot />
  </main>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class PageContent extends Vue {
  @Prop({
    default: () => ['flex-col', 'items-center'],
  })
  readonly flexLayoutClass!: string | string[];
}
</script>
