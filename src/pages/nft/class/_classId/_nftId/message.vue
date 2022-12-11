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
  </div>
</template>

<script>
import nftMixin from '~/mixins/nft';

export default {
  mixins: [nftMixin],
  computed: {
    messageList() {
      return [...this.populatedEvents]
        .filter(e => e.event !== 'new_class')
        .map(e => {
          if (e.event === 'purchase') {
            return {
              ...e,
              fromWallet: this.iscnOwner,
              toWallet: '',
            };
          }
          return e;
        })
        .map(m => ({
          ...m,
          messageType:
            m.fromWallet === this.iscnOwner ? 'creator' : 'collector',
          fromType: this.getWalletIdentityType(m.fromWallet),
          toType: this.getWalletIdentityType(m.toWallet),
          message: this.normalizeNFTMessage(m),
        }));
    },
  },
  async asyncData({ route, store, error }) {
    const { classId, nftId } = route.params;
    try {
      await Promise.all([
        store.dispatch('fetchNFTClassMetadata', classId),
        store.dispatch('fetchNFTMetadata', { classId, nftId }),
      ]);
    } catch (err) {
      if (err.response?.data?.code === 3) {
        error({
          statusCode: 404,
          message: 'NFT_NOT_FOUND',
        });
      } else {
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(err));
        error({
          statusCode: 500,
          message: 'NFT_FETCH_ERROR',
        });
      }
      return undefined;
    }
    return { classId, nftId };
  },
  async mounted() {
    try {
      this.updateNFTOwners();
      this.updateNFTHistory();
      this.fetchUserCollectedCount();
      const blockingPromises = [this.fetchISCNMetadata()];
      await Promise.all(blockingPromises);
    } catch (error) {
      if (!error.response?.status === 404) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  },
  methods: {
    normalizeNFTMessage(m) {
      if (m.memo === 'like.co NFT API') return '';
      if (m.event === 'mint_nft') return this.nftClassCreatorMessage;
      return m.memo;
    },
  },
};
</script>
