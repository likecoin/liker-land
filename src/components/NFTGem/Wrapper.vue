<template>
  <div class="relative w-full">
    <slot :level="gemLevel" :hover-class="gemHoverClass" />
    <NFTGem
      class="translate-y-[-50%] w-[90%]"
      :level="gemLevel"
      :name="gemName"
      :color-classes="gemColorClasses"
      @mouseenter.native.once="onMouseEnterGem"
      @click.native="onMouseClickGem"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { NFT_GEM_NAME, NFT_GEM_NAME_BOOK, NFT_BOOK } from '@/constant';
import { logTrackerEvent } from '~/util/EventLogger';

export default {
  props: {
    classId: {
      type: String,
      required: true,
    },
    isNftBook: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['getNFTClassGemLevel']),
    gemName() {
      return this.gemLevel === NFT_BOOK
        ? NFT_GEM_NAME_BOOK
        : NFT_GEM_NAME[this.gemLevel];
    },
    gemLevel() {
      return this.isNftBook ? NFT_BOOK : this.getNFTClassGemLevel(this.classId);
    },
    gemColorClasses() {
      const { gemLevel } = this;
      switch (true) {
        case gemLevel <= 3:
          return ['hidden'];

        case gemLevel <= 5:
          return ['via-[#D0D0D0]'];

        case gemLevel <= 7:
          return ['via-[#50E3C2]'];

        case gemLevel <= 9:
          return ['via-[#6CCAFF]'];

        case gemLevel <= 11:
          return ['via-[#FDAFFF]'];

        case gemLevel <= 13:
          return ['via-[#FFD748]'];

        case gemLevel === 14:
          return ['via-[#FF6464]'];

        case gemLevel === 15:
        case gemLevel === NFT_BOOK:
          return ['via-[#C0E1FF]'];

        default:
          return [];
      }
    },
    gemHoverClass() {
      const { gemLevel } = this;
      switch (true) {
        case gemLevel <= 0:
          return 'hover:bg-[#f7f7f7]';
        case gemLevel <= 3:
          return 'hover:bg-[#ebebeb]';
        case gemLevel <= 5:
          return 'hover:bg-[#d0d0d0]';
        case gemLevel <= 7:
          return 'hover:bg-[#50e3c2]';
        case gemLevel <= 9:
          return 'hover:bg-[#6ccaff]';
        case gemLevel <= 11:
          return 'hover:bg-[#fdafff]';
        case gemLevel <= 13:
          return 'hover:bg-[#ffd748]';
        case gemLevel <= 14:
          return 'hover:bg-[#ff6464]';
        case gemLevel <= 15:
        case gemLevel === NFT_BOOK:
          return 'hover:bg-[#c0e1ff]';
        default:
          return 'hover:bg-like-cyan-light';
      }
    },
  },
  methods: {
    onMouseClickGem() {
      logTrackerEvent(
        this,
        'NFTGem',
        'NFTGemClick',
        `NFTGemLevel${this.gemLevel}`,
        1
      );
    },
    onMouseEnterGem() {
      logTrackerEvent(
        this,
        'NFTGem',
        'NFTGemHover',
        `NFTGemLevel${this.gemLevel}`,
        1
      );
    },
  },
};
</script>
