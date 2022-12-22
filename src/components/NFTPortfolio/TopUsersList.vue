<template>
  <CollapsibleCard
    class="w-full"
    :title="label"
    :has-content-padding="true"
    :is-narrow="true"
  >
    <template #content>
      <div class="flex items-center justify-between my-[24px]">
        <span v-for="user in userList" :key="user.id">
          <ToolTips :tool-tip-text="user.displayName">
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
          </ToolTips>
        </span>
      </div>
    </template>
  </CollapsibleCard>
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
