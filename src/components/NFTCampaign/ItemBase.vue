<template>
  <div>
    <header
      v-t="'campaign_nft_item_header_hint'"
      class="text-black text-[12px] leading-[5/3]"
    />
    <div class="mt-[8px] grid laptop:grid-cols-2 grid-cols-row gap-[16px]">
      <div>
        <NFTWidgetBaseCard
          class="transition-colors cursor-pointer border-[2px] border-transparent hover:bg-[#fcfcfc] hover:border-like-cyan"
          @click="handleClickNFTDetails"
        >
          <NFTWidgetContentPreview
            :title="title"
            :description="description"
            :url="url"
            :img-src="imgSrc"
            :img-bg-color="imgBgColor"
          />
          <div class="flex items-center justify-center text-medium-gray mt-[8px]">
            <NFTWidgetIconEye class="w-[17px]" />
            <span
              class="underline ml-[6px] text-[12px] leading-[5/3]"
            >{{ viewDetailsLabel }}</span>
          </div>
        </NFTWidgetBaseCard>
        <NFTWidgetLikeActionBar
          class="mt-[8px]"
          :creator-address="ownerAddress"
          :creator-avatar-src="ownerAvatarSrc"
          @like="handleClickLike"
        />
      </div>
      <div>
        <NFTCampaignPricingTable
          class="laptop:mt-[8px] w-full"
          :sold-count="soldCount"
          @collect="handleClickCollect"
        />
        <div class="mt-[16px] flex items-center justify-between">
          <ul class="grid grid-flow-col gap-[8px]">
            <li class="min-w-[80px]">
              <div class="text-[24px] leading-[1.5] font-600 text-like-green">{{ ownerCount }}</div>
              <div class="mt-[4px] flex items-center text-[12px] leading-[5/3] font-600 text-medium-gray">
                <NFTWidgetIconOwner class="w-[16px]" />
                <span class="ml-[8px]">{{ ownerCountLabel }}</span>
              </div>
            </li>
            <li class="min-w-[80px]">
              <div class="text-[24px] leading-[1.5] font-600 text-like-green">{{ soldCount }}</div>
              <div class="mt-[4px] flex items-center text-[12px] leading-[5/3] font-600 text-medium-gray">
                <NFTWidgetIconNFT class="w-[16px]" />
                <span class="ml-[8px]">{{ soldCountLabel }}</span>
              </div>
            </li>
          </ul>
          <ButtonV2 preset="secondary" @click="handleClickCollect">
            <template #prepend>
              <NFTWidgetIconInsertCoin />
            </template>
            {{ collectButtonLabel }}
          </ButtonV2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // UI
    viewDetailsLabel: {
      type: String,
      default: 'View NFT details',
    },
    ownerCountLabel: {
      type: String,
      default: 'Owners',
    },
    soldCountLabel: {
      type: String,
      default: 'Sold',
    },

    // Owner
    ownerAddress: {
      type: String,
      default: '',
    },
    ownerAvatarSrc: {
      type: String,
      default: '',
    },

    // Content
    classId: {
      type: String,
      default: '',
    },

    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    imgSrc: {
      type: String,
      default: '',
    },
    imgBgColor: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },

    price: {
      type: Number,
      default: 0,
    },
    ownerCount: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    collectButtonLabel() {
      return `${this.price} $LIKE`;
    },
  },
  methods: {
    handleClickNFTDetails() {
      this.$emit('view-details');
    },
    handleClickCollect() {
      this.$emit('collect');
    },
    handleClickLike() {
      this.$emit('like');
    },
  },
};
</script>
