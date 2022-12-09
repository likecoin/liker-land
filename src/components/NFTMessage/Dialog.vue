<template>
  <Dialog
    :open="isOpen"
    @close="$emit('close')"
  >
    <CardV2 class="bg-light-gray max-w-[680px] mx-auto">
      <NFTMessageIdentity
        v-if="nftCollectorWalletAddress"
        class="self-start"
        type="collector"
        :wallet-address="nftCollectorWalletAddress"
        wrapper-classes="!bg-transparent"
      />
      <hr
        :class="[
          'block',
          'h-[2px]',
          'w-full',
          'my-[16px]',
          'border-shade-gray',
        ]"
      >

      <ul class="flex flex-col gap-[24px] w-full px-[24px]">
        <NFTMessage
          v-for="m in messageList"
          :key="`${m.txHash}-${m.event}`"
          :type="m.event"
          :from-type="m.fromType"
          :from-wallet="m.fromWallet"
          :to-type="m.toType"
          :to-wallet="m.toWallet"
          :message="m.message"
          :message-type="m.messageType"
          :is-list="true"
          tag="li"
        />
      </ul>
    </CardV2>
  </Dialog>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    messageList: {
      type: Array,
      default: undefined,
    },
    nftCollectorWalletAddress: {
      type: String,
      default: undefined,
    },
  },
};
</script>
