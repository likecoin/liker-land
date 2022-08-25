<template>
  <IconPerson v-if="type === 'dashboard'" />
  <IconLikeEvent v-else-if="type === 'civic'" />
  <IconSetting v-else-if="type === 'setting'" />
  <IconLogOut v-else-if="type === 'signOut'" />
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class MenuIcon extends Vue {
  @Prop(String)
  readonly type!: string | undefined;
}
</script>
