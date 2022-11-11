<template>
  <component :is="tag" class="flex flex-col items-center">

    <hr class="w-[2px] h-[24px] mb-[24px] bg-medium-gray border-none">

    <template v-if="message">
      <div class="text-[12px] text-medium-gray text-center">{{ messageHint }}</div>
      <CardV2
        :class="[
          'my-[8px] p-[32px] border-[2px] w-full text-dark-gray',
          isCollect ? 'border-like-cyan' : 'border-shade-gray'
        ]"
      >{{ message || $t('nft_message_empty') }}</CardV2>
    </template>

    <div
      :class="[
        'flex flex-col tablet:flex-row laptop:flex-row items-center gap-[16px] justify-center',
        {
          'sm:bg-white rounded-[24px] sm:rounded-full':
            fromWallet && toWallet && !message
        },
      ]"
    >
      <NFTMessageIdentity
        v-if="fromWallet"
        :type="fromType"
        :wallet-address="fromWallet"
      />
      <IconArrowLeft
        v-if="fromWallet && toWallet"
        class="w-[16px] h-[16px] text-like-green rotate-[-90deg] sm:rotate-180"
      />
      <NFTMessageIdentity
        v-if="toWallet"
        :type="toType"
        :wallet-address="toWallet"
      />
    </div>

  </component>
</template>

<script>
export default {
  name: 'NFTMessage',
  props: {
    type: {
      type: String,
      required: true,
    },
    txHash: {
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
    tag: {
      type: String,
      default: 'div',
    },
  },
  computed: {
    messageHint() {
      switch (this.type) {
        case 'purchase':
          return this.$t('nft_message_type_collect');

        case 'transfer':
          return this.$t('nft_message_type_transfer');

        default:
          return this.$t('nft_message_type_generic');
      }
    },
  },
};
</script>
