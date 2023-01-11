<template>
  <component :is="tag" class="flex flex-col items-center">

    <hr
      v-if="isList"
      :class="[
        'w-[2px]',
        'h-[24px]',
        'mb-[24px]',
        'bg-medium-gray',
        'border-none',
        { 'phone:hidden': !hasSeparator },
      ]"
    >

    <template v-if="message">
      <div
        class="text-[12px] text-medium-gray text-center"
      >{{ messageHint }}</div>
      <CardV2
        :class="[
          'my-[8px] p-[32px] border-[2px] w-full text-dark-gray',
          type !== 'transfer' ? 'border-like-cyan' : 'border-shade-gray'
        ]"
      >{{ message || $t('nft_message_empty') }}</CardV2>
    </template>

    <div
      :class="[
        'flex items-center gap-[16px] justify-center',
        {
          'sm:bg-white rounded-[24px] sm:rounded-full':
            fromWallet && toWallet && !message
        },
      ]"
    >
      <NFTMessageIdentity
        v-if="fromWallet"
        :type="fromType"
        :is-show-type-label="isShowIdentityTypeLabel"
        :wallet-address="fromWallet"
        :avatar-size="avatarSize"
      />
      <IconArrowLeft
        v-if="fromWallet && toWallet"
        class="w-[16px] h-[16px] text-like-green rotate-180"
      />
      <NFTMessageIdentity
        v-if="toWallet"
        :type="toType"
        :is-show-type-label="isShowIdentityTypeLabel"
        :wallet-address="toWallet"
        :avatar-size="avatarSize"
      />
    </div>

  </component>
</template>

<script>
import { isMobile } from '@walletconnect/browser-utils';

export default {
  name: 'NFTMessage',
  props: {
    type: {
      type: String,
      required: true,
    },
    fromType: {
      type: String,
      default: 'collector',
    },
    fromWallet: {
      type: String,
      default: '',
    },
    toType: {
      type: String,
      default: 'collector',
    },
    toWallet: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    messageType: {
      type: String,
      default: 'collector',
    },
    tag: {
      type: String,
      default: 'div',
    },
    isList: {
      type: Boolean,
      default: false,
    },
    hasSeparator: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    messageHint() {
      switch (this.type) {
        case 'purchase':
        case 'mint_nft':
          return this.$t('nft_message_type_collect');

        case 'transfer':
          return this.$t('nft_message_type_transfer');

        default:
          return this.$t('nft_message_type_generic');
      }
    },
    isShowIdentityTypeLabel() {
      return this.type === 'mint_nft';
    },
    avatarSize() {
      return isMobile() ? 32 : 42;
    },
  },
};
</script>
