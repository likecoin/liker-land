<template>
  <IconPerson v-if="type === 'dashboard'" />
  <IconPrice v-else-if="type === 'store'" class="w-[20px]" />
  <IconArticle v-else-if="type === 'article'" class="w-[20px]" />
  <IconLikeEvent v-else-if="type === 'civic'" />
  <IconSetting v-else-if="type === 'setting'" />
  <IconLogOut v-else-if="type === 'signOut'" />
  <IconMint v-else-if="type === 'mintNft'" class="w-[20px]" />
  <IconCreativeWork v-else-if="type === 'portfolio'" />
  <IconBell v-else-if="type === 'notifications'" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class MenuIcon extends Vue {
  @Prop(String)
  readonly type!: string | undefined;
}
</script>
