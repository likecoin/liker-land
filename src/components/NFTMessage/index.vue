<template>
  <component :is="tag">
    <div class="text-[12px] text-medium-gray text-center">{{ messageHint }}</div>
    <CardV2
      :class="[
        'mt-[8px] p-[32px]',
        { 'text-medium-gray text-center': !message },
        { 'border-like-cyan border-[2px]': isCollect },
      ]"
    >{{ message || $t('nft_message_empty') }}</CardV2>

    <div
      :class="[
        'flex items-center gap-[16px] mt-[8px] px-[8px]',
        (fromWallet && toWallet) || (fromWallet && message) ? 'justify-end' : 'justify-center',
      ]"
    >
      <NFTMessageIdentity
        v-if="fromWallet"
        :type="isCollect ? 'creator' : 'collector'"
        :wallet-address="fromWallet"
      />
      <IconArrowLeft
        v-if="fromWallet && toWallet"
        class="w-[16px] h-[16px] text-like-green rotate-180"
      />
      <NFTMessageIdentity
        v-if="toWallet"
        type="collector"
        :wallet-address="toWallet"
      />
    </div>

  </component>
</template>

<script>
import { getChainRawTx } from '~/util/api';

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
    fromWallet: {
      type: String,
      default: '',
    },
    toWallet: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  data() {
    return {
      message: '',
    };
  },
  computed: {
    isCollect() {
      return this.type === 'purchase';
    },
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
  mounted() {
    this.fetchTxMemo();
  },
  methods: {
    async fetchTxMemo() {
      // FIXME: Should provide message from props
      try {
        const res = await this.$api.$get(getChainRawTx(this.txHash));
        this.message = res.tx.body.memo || '';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  },
};
</script>
