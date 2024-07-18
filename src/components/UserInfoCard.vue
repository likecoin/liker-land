<template>
  <CardV2 class="flex flex-col items-center w-full gap-[1rem]">
    <IdentityAvatar
      :class="{
        'cursor-pointer hover:scale-105 transition-transform':
          $listeners['click-avatar'],
      }"
      :url="avatarSrc"
      :size="88"
      :is-outlined="isCivicLiker"
      :display-name="displayName"
      @click="handleClickAvatar"
    />

    <Label
      class="w-full text-like-green"
      preset="h3"
      content-class="min-w-0"
      align="center"
    >
      <span class="line-clamp-2">{{ displayName | ellipsis }}</span>
    </Label>

    <ToolTips :tool-tip-text="wallet">
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
        @click="handleClickWallet"
      >
        {{ wallet | ellipsis }}
      </div>
    </ToolTips>

    <slot />
  </CardV2>
</template>

<script>
import clipboardMixin from '~/mixins/clipboard';

import { ellipsis } from '~/util/ui';

export default {
  name: 'UserInfoCard',
  filters: {
    ellipsis,
  },
  mixins: [clipboardMixin],
  props: {
    wallet: {
      type: String,
      required: true,
    },
    avatarSrc: {
      type: String,
      default: undefined,
    },
    displayName: {
      type: String,
      default: '',
    },
    isCivicLiker: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClickAvatar() {
      this.$emit('click-avatar');
    },
    handleClickWallet() {
      this.copyToClipboard(this.wallet);
      this.$emit('copy-wallet');
    },
  },
};
</script>
