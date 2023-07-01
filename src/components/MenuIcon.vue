<template>
  <LazyIconPerson v-if="type === 'dashboard'" />
  <LazyIconLikeEvent v-else-if="type === 'civic'" />
  <LazyIconSetting v-else-if="type === 'setting'" />
  <LazyIconLogOut v-else-if="type === 'signOut'" />
  <LazyIconMint v-else-if="type === 'mintNft'" class="w-[20px]" />
  <LazyIconBell v-else-if="type === 'notifications'" />
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class MenuIcon extends Vue {
  @Prop(String)
  readonly type!: string | undefined;
}
</script>
