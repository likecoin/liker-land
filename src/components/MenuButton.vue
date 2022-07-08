<template>
  <div class="flex justify-center">
    <ButtonV2
      v-bind="$attrs"
      :preset="buttonPreset"
      :to="to"
      v-on="$listeners"
    >
      <template
        v-for="(_, slot) of $scopedSlots"
        #[slot]
      >
        <slot :name="slot" />
      </template>
    </ButtonV2>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from 'vue-router';

@Component
export default class MenuButton extends Vue {
  @Prop({ default: null })
  readonly to: Location | null | undefined;

  @Prop({ default: false })
  readonly isSelected: boolean | undefined;

  get buttonPreset() {
    return this.isSelected ? 'primary' : 'plain';
  }
}
</script>
