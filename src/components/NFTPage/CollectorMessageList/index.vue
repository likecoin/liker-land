<template>
  <ScrollingList :animation-duration="durationTime">
    <template #item>
      <NFTPageCollectorMessageListItem
        v-for="(message, i) in displayMessages"
        :key="`${message.id}-${i}`"
        class="mx-[8px]"
        :message="message"
        :creator-avatar="creatorAvatar"
        :class-id="classId"
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
    creatorAvatar: {
      type: String,
      default: undefined,
    },
    classId: {
      type: String,
      default: undefined,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    minMessages: {
      type: Number,
      default: 6,
    },
    maxMessages: {
      type: Number,
      default: 20,
    },
    scrollSpeed: {
      type: Number,
      default: 7.5,
    },
  },
  computed: {
    displayMessages() {
      if (this.messages.length < 3) return [];
      let loopedMessages = [...this.messages];

      while (loopedMessages.length < this.minMessages) {
        loopedMessages = loopedMessages.concat(this.messages);
      }
      if (loopedMessages.length > this.maxMessages) {
        loopedMessages = loopedMessages.slice(0, this.maxMessages);
      }
      return loopedMessages;
    },
    durationTime() {
      return `${this.displayMessages.length * this.scrollSpeed}`;
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
