<template>
  <CardV2 :class="['flex', 'flex-col', 'items-center', 'w-full']">
    <Identity :avatar-url="userAvatar" :avatar-size="88" :is-avatar-outlined="isUserCivicLiker" />
    <Label preset="h3" :class="['text-like-green', 'mt-[18px]']" align="center">
      {{ userDisplayName }}
    </Label>
    <ToolTips :tool-tip-text="wallet" class="mt-[12px]">
      <div
        :class="[
          'flex',
          'items-center',
          'justify-center',

          'px-[12px]',
          'text-medium-gray',
          'text-[10px]',
          'rounded-full',
          'border-[1px]',
          'border-medium-gray',

          'cursor-pointer',
          'hover:text-dark-gray',
          'transition',
          'duration-200',
        ]"
        @click="copyToClipboard(wallet)"
      >
        {{ wallet | ellipsis }}
      </div>
    </ToolTips>
    <slot name="gem" />
    <template v-if="userDescription">
      <Label preset="p6" class="break-normal font-200 mb-[24px]">
        {{ userDescription }}
      </Label>
    </template>
    <slot name="stats" />
  </CardV2>
</template>
<script>
import userInfoMixin from '~/mixins/user-info';
import clipboardMixin from '~/mixins/clipboard';
import { ellipsis } from '~/util/ui';

export default {
  filters: {
    ellipsis,
  },
  mixins: [userInfoMixin, clipboardMixin],
  props: {
    wallet: {
      type: String,
      default: null,
    },
  },
};
</script>
