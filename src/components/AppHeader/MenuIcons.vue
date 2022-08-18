<template>
  <IconPerson v-if="type === 'portfolio'" />
  <IconLikeEvent v-else-if="type === 'civic'" />
  <IconSetting v-else-if="type === 'setting'" />
  <IconLogOut v-else-if="type === 'signOut'" />
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class MenuIcons extends Vue {
  // Type of the coin
  @Prop(String)
  readonly type!: string | undefined;
}
</script>
