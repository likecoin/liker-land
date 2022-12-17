<template>
  <div class="bg-light-gray px-[32px] pt-[24px] pb-[48px]">
    <NFTMessageIdentity
      v-if="nftCollectorWalletAddress"
      class="self-start"
      type="collector"
      :wallet-address="nftCollectorWalletAddress"
      wrapper-classes="!bg-transparent"
    />
    <hr
      :class="['block', 'h-[2px]', 'w-full', 'my-[16px]', 'border-shade-gray']"
    >
    <ul class="flex flex-col gap-[24px] w-full px-[12px]">
      <NFTMessage
        v-for="(m, index) in messageList"
        :key="`${m.txHash}-${m.event}`"
        :type="m.event"
        :from-type="m.fromType"
        :from-wallet="m.fromWallet"
        :to-type="m.toType"
        :to-wallet="m.toWallet"
        :message="m.message"
        :message-type="m.messageType"
        :is-list="true"
        :index="index"
        tag="li"
      />
    </ul>
  </div>
</template>

<script>
import nftMixin from '~/mixins/nft';

export default {
  mixins: [nftMixin],
  props: {
    messageList: {
      type: Array,
      default: undefined,
    },
    classId: {
      type: String,
      default: undefined,
    },
    nftId: {
      type: String,
      default: undefined,
    },
  },
};
</script>
