<template>
  <NuxtLink :to="messagesPageLink">
    <div
      :class="[
        'group',
        'relative',
        'flex',
        'flex-col',
        'justify-between',

        'p-[12px] laptop:p-[24px]',
        'pb-[12px] laptop:pb-[20px]',

        'min-w-[195px] laptop:min-w-[240px]',
        'h-[180px] laptop:h-[204px]',
        'cursor-pointer',

        'bg-[url(~/assets/images/nft/books/collector-message-item-background.svg)]',
        'laptop:bg-[url(~/assets/images/nft/books/collector-message-item-background-lg.svg)]',
        'bg-cover',
        'bg-center',
      ]"
      :style="bgStyle"
    >
      <p class="block text-[16px] line-clamp-4" v-text="buyerMessage" />
      <NFTPageCollectorMessageListIdentity
        :is-show-type-label="false"
        :wallet-address="message.id"
        :avatar-size="32"
        :wrapper-classes="[
          '!bg-transparent',
          'phone:!flex-row',
          '!pl-[0px]',
          '!gap-[12px]',
        ]"
      />

      <Identity
        v-if="hasAuthorReplied"
        :class="[
          'absolute bottom-0 right-[6px]',
          '!hidden',
          'transition-all duration-100',
          hasAuthorReplied
            ? 'group-hover:!block group-hover:right-[8px]'
            : 'hidden',
        ]"
        :avatar-url="creatorAvatar"
        :avatar-size="20"
      />

      <svg
        v-if="hasAuthorReplied"
        :class="[
          'absolute bottom-0 right-[6px]',
          { 'group-hover:right-[22px]': hasAuthorReplied },
        ]"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="10" r="9.5" fill="#F7F7F7" stroke="#E1E1E1" />
        <g opacity="0.5" clip-path="url(#clip0_2298_5781)">
          <path
            d="M5.2658 8.70773L8.70338 5.73928C9.00428 5.47941 9.47851 5.69037 9.47851 6.09404V7.65758C12.6158 7.69349 15.1035 8.32226 15.1035 11.2954C15.1035 12.4954 14.3304 13.6843 13.4759 14.3058C13.2093 14.4998 12.8292 14.2563 12.9275 13.9419C13.8132 11.1097 12.5075 10.3578 9.47851 10.3142V12.0312C9.47851 12.4355 9.0039 12.6456 8.70338 12.386L5.2658 9.41726C5.04957 9.23051 5.04927 8.89474 5.2658 8.70773Z"
            fill="#9B9B9B"
          />
        </g>
        <defs>
          <clipPath id="clip0_2298_5781">
            <rect
              width="10"
              height="10"
              fill="white"
              transform="translate(5.10352 5)"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  name: 'NFTPageCollectorMessageListItem',
  props: {
    message: {
      type: Object,
      required: true,
    },
    creatorAvatar: {
      type: String,
      default: undefined,
    },
    classId: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    buyerMessage() {
      return this.message?.buyerMessage;
    },
    hasAuthorReplied() {
      return this.message?.authorReply;
    },
    messagesPageLink() {
      return this.localeLocation({
        name: 'nft-class-classId-nftId',
        params: {
          classId: this.classId,
          nftId: this.message?.collectedFirstNFTId,
        },
      });
    },
  },
};
</script>
