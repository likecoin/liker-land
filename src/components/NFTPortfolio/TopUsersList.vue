<template>
  <CardV2 :class="['inline', 'flex-col', 'items-center', 'w-full']">
    <Label
      class="w-min font-600"
      :text="label"
      preset="h5"
      valign="middle"
      content-class="whitespace-nowrap text-like-green "
      prepend-class="text-like-green"
    />
    <span v-for="user in userList" :key="user.id" class="flex items-center justify-between">
      <LinkV2
        class="flex items-center gap-[8px]"
        :to="{
          name: 'id',
          params: { id: user.id }
        }"
      >
        <IdentityAvatar
          :url="user.avatar"
          :display-name="user.displayName"
          :size="36"
          :is-outlined="user.isCivicLiker"
          :is-lazy-loaded="true"
        />
      </LinkV2>
    </span>
  </CardV2>
</template>

<script>
import { ellipsis } from '~/util/ui';

export default {
  name: 'NFTPortfolioTopUsersList',
  filters: {
    ellipsis,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    userList: {
      type: Array,
      required: true,
    },
  },
};
</script>
