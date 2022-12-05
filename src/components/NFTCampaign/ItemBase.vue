<template>
  <div>
    <header
      v-t="'campaign_nft_item_header_hint'"
      class="text-black text-[12px] leading-[5/3]"
    />
    <div class="mt-[8px] grid laptop:grid-cols-2 grid-cols-row gap-[16px]">
      <div>
        <NFTWidgetBaseCard class="flex flex-col items-center w-full">
          <NFTWidgetContentPreview
            :class="[
              hoverClass,
              'transition-shadow',
              'cursor-pointer',
              'min-h-[300px]',
              'w-full',
            ]"
            :title="title"
            :description="description"
            :img-src="imgSrc"
            :img-bg-color="imgBgColor"
            v-bind="contentPreviewProps"
            @click="handleClickNFTDetails"
          />
          <a
            class="transition-colors cursor-pointer hover:text-like-cyan-dark flex items-center justify-center text-medium-gray mt-[8px]"
            :href="url"
            target="_blank"
            rel="noopener"
            @click="handleClickViewContent"
          >
            <NFTWidgetIconEye class="w-[17px]" />
            <span
              class="underline ml-[6px] text-[12px] leading-[5/3]"
            >{{ viewDetailsLabel }}</span>
          </a>
        </NFTWidgetBaseCard>
        <NFTWidgetLikeActionBar
          class="mt-[8px]"
          :creator-display-name="ownerName"
          :creator-avatar-src="ownerAvatarSrc"
          :is-civic-liker="isCivicLiker"
          :creator-address="ownerAddress"
          :like-action-label="likeActionLabel"
          @like="handleClickLike"
        />
      </div>
      <div>
        <NFTSupplyTable
          class="laptop:mt-[8px] w-full laptop:pr-[8px]"
          :collected-count="soldCount"
          :should-collapse-in-mobile="true"
          :should-show-indicator="true"
          @collect="handleClickCollect"
        />
        <div class="mt-[16px] flex items-center justify-between">
          <ul class="grid grid-flow-col gap-[8px]">
            <li class="laptop:min-w-[80px]">
              <div class="text-[24px] leading-[1.5] font-600 text-like-green">{{ soldCount }}</div>
              <div class="mt-[4px] flex items-center text-[12px] leading-[5/3] font-600 text-medium-gray">
                <NFTWidgetIconNFT class="w-[16px] hidden laptop:block" />
                <span class="laptop:ml-[8px]">{{ soldCountLabel }}</span>
              </div>
            </li>
            <li class="laptop:min-w-[80px]">
              <div class="text-[24px] leading-[1.5] font-600 text-like-green">{{ ownerCount }}</div>
              <div class="mt-[4px] flex items-center text-[12px] leading-[5/3] font-600 text-medium-gray">
                <NFTWidgetIconOwner class="w-[16px] hidden laptop:block" />
                <span class="laptop:ml-[8px]">{{ ownerCountLabel }}</span>
              </div>
            </li>
            <li v-if="ownCount" class="laptop:min-w-[80px]">
              <div class="text-[24px] leading-[1.5] font-600 text-like-green">{{ ownCount }}</div>
              <div class="mt-[4px] flex items-center text-[12px] leading-[5/3] font-600 text-like-green">
                <IconCheck class="w-[16px] hidden laptop:block" />
                <span class="laptop:ml-[8px]">{{ ownCountLabel }}</span>
              </div>
            </li>
          </ul>
          <ProgressIndicator v-if="isLoading" />
          <ButtonV2 v-else preset="secondary" @click="handleClickCollect">
            <template #prepend>
              <NFTWidgetIconInsertCoin />
            </template>
            {{ price | formatNumberWithLIKE }}
          </ButtonV2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatNumberWithLIKE } from '~/util/ui';

export default {
  filters: {
    formatNumberWithLIKE,
  },
  props: {
    // UI
    viewDetailsLabel: {
      type: String,
      default: 'View Content',
    },
    likeActionLabel: {
      type: String,
      default: undefined,
    },
    ownerCountLabel: {
      type: String,
      default: 'Collectors',
    },
    soldCountLabel: {
      type: String,
      default: 'Collected',
    },
    ownCountLabel: {
      type: String,
      default: 'Own',
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
    ownerName: {
      type: String,
      default: '',
    },
    isCivicLiker: {
      type: Boolean,
      default: false,
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
    contentPreviewProps: {
      type: Object,
      default: undefined,
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
    ownCount: {
      type: Number,
      default: 0,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hoverClass() {
      // HACK: avoid handling gem level logic by directly mapping imgBgColor
      // Hardcode hover color class list for tailwind
      const color = this.imgBgColor.toLowerCase();
      switch (color) {
        case '#f7f7f7':
          return 'hover:shadow-[0_0_0_2px_#f7f7f7]';
        case '#ebebeb':
          return 'hover:shadow-[0_0_0_2px_#ebebeb]';
        case '#d0d0d0':
          return 'hover:shadow-[0_0_0_2px_#d0d0d0]';
        case '#50e3c2':
          return 'hover:shadow-[0_0_0_2px_#50e3c2]';
        case '#6ccaff':
          return 'hover:shadow-[0_0_0_2px_#6ccaff]';
        case '#fdafff':
          return 'hover:shadow-[0_0_0_2px_#fdafff]';
        case '#ffd748':
          return 'hover:shadow-[0_0_0_2px_#ffd748]';
        case '#ff6464':
          return 'hover:shadow-[0_0_0_2px_#ff6464]';
        case '#c0e1ff':
          return 'hover:shadow-[0_0_0_2px_#c0e1ff]';
        default:
          return 'hover:shadow-[0_0_0_2px_#aaf1e7]';
      }
    },
  },
  methods: {
    handleClickNFTDetails() {
      this.$emit('view-details');
    },
    handleClickViewContent() {
      this.$emit('view-content');
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
