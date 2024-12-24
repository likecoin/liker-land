<template>
  <ScrollingList :animation-duration="durationTime">
    <template #item>
      <NFTPageCollectorMessageListItem
        v-for="(message, i) in displayMessages"
        :key="`${message.id}-${i}`"
        class="mx-[16px]"
        :message="message"
      />
    </template>
  </ScrollingList>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'NFTPageCollectorMessageList',
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
    classId: {
      type: String,
      default: undefined,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    displayMessages() {
      if (this.messages.length < 3) return [];
      let loopedMessages = [...this.messages];

      while (loopedMessages.length < 6) {
        loopedMessages = loopedMessages.concat(this.messages);
      }
      if (loopedMessages.length > 20) {
        loopedMessages = loopedMessages.slice(0, 20);
      }
      return loopedMessages;
    },
    durationTime() {
      return `${this.messages.length * 3.33}s`;
    },
  },
  mounted() {
    const buyerList = this.messages?.map(buyer => buyer.id);
    const uniqueBuyerList = [...new Set(buyerList)];

    this.lazyGetUserInfoByAddresses(uniqueBuyerList);
  },
  methods: {
    ...mapActions(['lazyGetUserInfoByAddresses']),
  },
};
</script>
